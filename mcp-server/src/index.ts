import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import express, { type Request, type Response } from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";
import aiRuntime, { SEEDANCE_2_FAST_MODEL, SEEDANCE_2_MODEL, type AiProvider } from "./ai-router.js";

const app = express();
const port = Number(process.env.PORT || 8790);
const configuredAuthToken = process.env.MCP_AUTH_TOKEN?.trim();
const maxBodyBytes = Number(process.env.MCP_MAX_BODY_BYTES || 12 * 1024 * 1024);
const publicBaseUrl = (process.env.PUBLIC_BASE_URL || "https://ai-router.metooloo.com").replace(/\/$/, "");
const feishuAppId = process.env.FEISHU_APP_ID?.trim();
const feishuAppSecret = process.env.FEISHU_APP_SECRET?.trim();
const oauthCallbackUrl = process.env.OAUTH_CALLBACK_URL?.trim() || `${publicBaseUrl}/oauth/feishu/callback`;
const oauthEnabled = Boolean(feishuAppId && feishuAppSecret);

if (!configuredAuthToken && !oauthEnabled) {
  throw new Error("MCP_AUTH_TOKEN or FEISHU_APP_ID/FEISHU_APP_SECRET is required");
}

const authToken = configuredAuthToken;
type OAuthState = {
  clientId: string;
  redirectUri: string;
  clientState?: string;
  codeChallenge?: string;
  expiresAt: number;
};
type OAuthCode = OAuthState & { userOpenId: string };
type OAuthClient = {
  redirectUris: string[];
  clientName?: string;
  expiresAt: number;
};
type RefreshTokenRecord = {
  tokenHash: string;
  userOpenId: string;
  clientId: string;
  expiresAt: number;
};
const oauthStates = new Map<string, OAuthState>();
const oauthCodes = new Map<string, OAuthCode>();
const accessTokens = new Map<string, { userOpenId: string; expiresAt: number }>();
const oauthClients = new Map<string, OAuthClient>();
const refreshTokens = new Map<string, RefreshTokenRecord>();
const oauthTtlMs = 10 * 60 * 1000;
const oauthClientTtlMs = 24 * 60 * 60 * 1000;
const accessTokenTtlMs = Number(process.env.OAUTH_ACCESS_TOKEN_TTL_SECONDS || 3_600) * 1_000;
const refreshTokenTtlMs = Number(process.env.OAUTH_REFRESH_TOKEN_TTL_MS || 30 * 24 * 60 * 60 * 1_000);
const refreshTokenStorePath = process.env.OAUTH_REFRESH_TOKEN_STORE_PATH?.trim()
  || "/opt/ecom-ai-router/oauth-refresh-tokens.json";

app.disable("x-powered-by");
app.use(express.json({ limit: maxBodyBytes }));
app.use(express.urlencoded({ extended: false, limit: "64kb" }));

function tokenMatches(request: Request): boolean {
  const header = request.header("authorization") || "";
  const supplied = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  if (!supplied) return false;
  if (authToken && supplied.length === authToken.length && timingSafeEqual(Buffer.from(supplied), Buffer.from(authToken))) {
    return true;
  }
  const session = accessTokens.get(supplied);
  return Boolean(session && session.expiresAt > Date.now());
}

function requireAuth(request: Request, response: Response, next: () => void) {
  if (!tokenMatches(request)) {
    if (oauthEnabled) {
      response.setHeader("WWW-Authenticate", `Bearer resource_metadata="${publicBaseUrl}/.well-known/oauth-protected-resource"`);
    }
    response.status(401).json({ error: "unauthorized" });
    return;
  }
  next();
}

function base64Url(value: Buffer): string {
  return value.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function randomToken(prefix: string): string {
  return `${prefix}${base64Url(randomBytes(32))}`;
}

function tokenHash(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function isRefreshTokenRecord(value: unknown): value is RefreshTokenRecord {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return typeof record.tokenHash === "string"
    && /^[a-f0-9]{64}$/.test(record.tokenHash)
    && typeof record.userOpenId === "string"
    && typeof record.clientId === "string"
    && typeof record.expiresAt === "number";
}

async function loadRefreshTokens(): Promise<void> {
  try {
    const parsed = JSON.parse(await readFile(refreshTokenStorePath, "utf8")) as unknown;
    const records = Array.isArray(parsed)
      ? parsed
      : parsed && typeof parsed === "object" && "tokens" in parsed
        ? Object.entries((parsed as { tokens?: unknown }).tokens || {}).map(([tokenHash, record]) => ({
          tokenHash,
          ...(record && typeof record === "object" ? record : {}),
        }))
        : null;
    if (!records) throw new Error("refresh token store has an unsupported format");
    const now = Date.now();
    for (const record of records) {
      if (isRefreshTokenRecord(record) && record.expiresAt > now) refreshTokens.set(record.tokenHash, record);
    }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return;
    throw error;
  }
}

async function persistRefreshTokens(): Promise<void> {
  const now = Date.now();
  for (const [hash, record] of refreshTokens) {
    if (record.expiresAt <= now) refreshTokens.delete(hash);
  }
  await mkdir(dirname(refreshTokenStorePath), { recursive: true });
  const temporaryPath = `${refreshTokenStorePath}.${process.pid}.tmp`;
  await writeFile(temporaryPath, JSON.stringify({
    version: 1,
    tokens: Object.fromEntries([...refreshTokens.values()].map((record) => [record.tokenHash, {
      userOpenId: record.userOpenId,
      clientId: record.clientId,
      expiresAt: record.expiresAt,
    }])),
  }), { mode: 0o600 });
  await rename(temporaryPath, refreshTokenStorePath);
}

async function issueTokenPair(userOpenId: string, clientId: string, previousRefreshTokenHash?: string) {
  const accessToken = randomToken("at_");
  const refreshToken = randomToken("rt_");
  const refreshRecord: RefreshTokenRecord = {
    tokenHash: tokenHash(refreshToken),
    userOpenId,
    clientId,
    expiresAt: Date.now() + refreshTokenTtlMs,
  };
  if (previousRefreshTokenHash) refreshTokens.delete(previousRefreshTokenHash);
  refreshTokens.set(refreshRecord.tokenHash, refreshRecord);
  await persistRefreshTokens();
  accessTokens.set(accessToken, { userOpenId, expiresAt: Date.now() + accessTokenTtlMs });
  return {
    access_token: accessToken,
    refresh_token: refreshToken,
    token_type: "Bearer",
    expires_in: Math.floor(accessTokenTtlMs / 1_000),
  };
}

function verifyPkce(verifier: string | undefined, challenge: string | undefined): boolean {
  if (!challenge) return true;
  if (!verifier) return false;
  return base64Url(createHash("sha256").update(verifier).digest()) === challenge;
}

async function feishuAppAccessToken(): Promise<string> {
  const result = await fetch("https://open.feishu.cn/open-apis/auth/v3/app_access_token/internal", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ app_id: feishuAppId, app_secret: feishuAppSecret }),
  });
  const data = await result.json() as { app_access_token?: string; code?: number; msg?: string };
  if (!result.ok || !data.app_access_token) throw new Error(`Feishu app token failed: ${data.code || result.status}`);
  return data.app_access_token;
}

async function exchangeFeishuCode(code: string, clientRedirectUri: string, codeVerifier?: string): Promise<string> {
  const appAccessToken = await feishuAppAccessToken();
  const result = await fetch("https://open.feishu.cn/open-apis/authen/v1/oidc/access_token", {
    method: "POST",
    headers: { authorization: `Bearer ${appAccessToken}`, "content-type": "application/json" },
    body: JSON.stringify({ grant_type: "authorization_code", code }),
  });
  const data = await result.json() as {
    data?: { access_token?: string; token_type?: string; refresh_token?: string; expires_in?: number; scope?: string };
    code?: number;
    msg?: string;
  };
  const userAccessToken = data.data?.access_token;
  if (!result.ok || !userAccessToken) {
    throw new Error(`Feishu user token failed: http=${result.status} code=${data.code ?? "missing"} msg=${data.msg ?? "unknown"}`);
  }

  const userInfoResult = await fetch("https://open.feishu.cn/open-apis/authen/v1/user_info", {
    headers: { authorization: `Bearer ${userAccessToken}` },
  });
  const userInfo = await userInfoResult.json() as {
    code?: number;
    msg?: string;
    data?: { open_id?: string };
  };
  const openId = userInfo.data?.open_id;
  if (!userInfoResult.ok || userInfo.code !== 0 || !openId) {
    throw new Error(`Feishu user info failed: http=${userInfoResult.status} code=${userInfo.code ?? "missing"} msg=${userInfo.msg ?? "unknown"}`);
  }
  return openId;
}

function isValidRedirectUri(value: unknown): value is string {
  if (typeof value !== "string" || value.length > 2_000) return false;
  try {
    const uri = new URL(value);
    return uri.protocol === "http:" || uri.protocol === "https:";
  } catch {
    return false;
  }
}

function oauthMetadata() {
  return {
    issuer: publicBaseUrl,
    authorization_endpoint: `${publicBaseUrl}/oauth/authorize`,
    token_endpoint: `${publicBaseUrl}/oauth/token`,
    registration_endpoint: `${publicBaseUrl}/register`,
    response_types_supported: ["code"],
    grant_types_supported: ["authorization_code", "refresh_token"],
    code_challenge_methods_supported: ["S256"],
    token_endpoint_auth_methods_supported: ["none"],
  };
}

function configuredProviders() {
  const providers: AiProvider[] = ["gemini", "doubao", "deepseek", "openai", "qwen"];
  return providers.flatMap((provider) => {
    const capabilities = (["text", "image", "video"] as const).flatMap((capability) => {
      const profile = aiRuntime.env.providerProfile(provider, capability);
      return profile ? [{ capability, configured: Boolean(profile.key), model: profile.model }] : [];
    });
    return capabilities.length ? [{ provider, capabilities }] : [];
  });
}

app.get("/health", (_request, response) => {
  response.json({
    ok: true,
    service: "ecom-ai-router-mcp",
    version: process.env.SERVICE_VERSION || "0.1.0",
    realCallsEnabled: aiRuntime.env.realCallsEnabled(),
    oauthEnabled,
    providers: configuredProviders(),
    videoDefaults: {
      provider: "doubao",
      model: SEEDANCE_2_MODEL,
      fastModel: SEEDANCE_2_FAST_MODEL,
      aliases: ["seedance-2.0", "seedance-2.0-fast"],
    },
  });
});

app.get("/.well-known/oauth-protected-resource", (_request, response) => {
  response.json({ resource: `${publicBaseUrl}/mcp`, authorization_servers: [publicBaseUrl] });
});

app.get("/.well-known/oauth-authorization-server", (_request, response) => {
  if (!oauthEnabled) {
    response.status(404).json({ error: "oauth_not_configured" });
    return;
  }
  response.json(oauthMetadata());
});

app.post("/register", (request, response) => {
  if (!oauthEnabled) {
    response.status(404).json({ error: "oauth_not_configured" });
    return;
  }

  const body = request.body as Record<string, unknown>;
  const redirectUris = Array.isArray(body.redirect_uris)
    ? body.redirect_uris.filter(isValidRedirectUri)
    : [];
  if (!redirectUris.length) {
    response.status(400).json({ error: "invalid_client_metadata", error_description: "redirect_uris must contain at least one http(s) URI" });
    return;
  }

  const clientId = randomToken("client_");
  const clientName = typeof body.client_name === "string" && body.client_name.length <= 200
    ? body.client_name
    : undefined;
  oauthClients.set(clientId, { redirectUris, clientName, expiresAt: Date.now() + oauthClientTtlMs });
  response.status(201).json({
    client_id: clientId,
    client_id_issued_at: Math.floor(Date.now() / 1_000),
    token_endpoint_auth_method: "none",
    grant_types: ["authorization_code", "refresh_token"],
    response_types: ["code"],
    redirect_uris: redirectUris,
    ...(clientName ? { client_name: clientName } : {}),
  });
});

app.get("/oauth/authorize", (request, response) => {
  if (!oauthEnabled) {
    response.status(404).json({ error: "oauth_not_configured" });
    return;
  }
  const clientId = typeof request.query.client_id === "string" ? request.query.client_id : "";
  const redirectUri = typeof request.query.redirect_uri === "string" ? request.query.redirect_uri : "";
  const responseType = typeof request.query.response_type === "string" ? request.query.response_type : "";
  const state = typeof request.query.state === "string" ? request.query.state : undefined;
  const codeChallenge = typeof request.query.code_challenge === "string" ? request.query.code_challenge : undefined;
  const codeChallengeMethod = typeof request.query.code_challenge_method === "string" ? request.query.code_challenge_method : undefined;
  const client = oauthClients.get(clientId);
  if (!client || client.expiresAt < Date.now() || !client.redirectUris.includes(redirectUri)) {
    response.status(400).json({ error: "invalid_client" });
    return;
  }
  if (responseType !== "code" || !isValidRedirectUri(redirectUri)) {
    response.status(400).json({ error: "invalid_request" });
    return;
  }
  if (codeChallengeMethod && codeChallengeMethod !== "S256") {
    response.status(400).json({ error: "unsupported_code_challenge_method" });
    return;
  }
  const internalState = randomToken("st_");
  oauthStates.set(internalState, {
    clientId,
    redirectUri,
    clientState: typeof state === "string" ? state : undefined,
    codeChallenge: typeof codeChallenge === "string" ? codeChallenge : undefined,
    expiresAt: Date.now() + oauthTtlMs,
  });
  const feishuUrl = new URL("https://open.feishu.cn/open-apis/authen/v1/index");
  feishuUrl.searchParams.set("app_id", feishuAppId!);
  // URLSearchParams performs the outer encoding; keep the client callback URI raw here.
  feishuUrl.searchParams.set("redirect_uri", `${oauthCallbackUrl}?redirect_uri=${redirectUri}`);
  feishuUrl.searchParams.set("state", internalState);
  response.redirect(feishuUrl.toString());
});

app.get("/oauth/feishu/callback", async (request, response) => {
  const state = typeof request.query.state === "string" ? request.query.state : "";
  const code = typeof request.query.code === "string" ? request.query.code : "";
  const pending = oauthStates.get(state);
  oauthStates.delete(state);
  if (!pending || pending.expiresAt < Date.now() || !code) {
    response.status(400).send("Invalid or expired OAuth state");
    return;
  }
  try {
    const clientRedirectUri = typeof request.query.redirect_uri === "string" ? request.query.redirect_uri : "";
    if (clientRedirectUri !== pending.redirectUri) {
      response.status(400).send("OAuth redirect URI mismatch");
      return;
    }
    const userOpenId = await exchangeFeishuCode(code, clientRedirectUri, pending.codeChallenge);
    const authCode = randomToken("ac_");
    oauthCodes.set(authCode, { ...pending, userOpenId, expiresAt: Date.now() + oauthTtlMs });
    const redirect = new URL(pending.redirectUri);
    redirect.searchParams.set("code", authCode);
    if (pending.clientState) redirect.searchParams.set("state", pending.clientState);
    response.redirect(redirect.toString());
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    response.status(502).send("Feishu OAuth exchange failed");
  }
});

app.post("/oauth/token", async (request, response) => {
  if (!oauthEnabled) {
    response.status(404).json({ error: "oauth_not_configured" });
    return;
  }
  const body = request.body as Record<string, unknown>;
  const grantType = typeof body.grant_type === "string" ? body.grant_type : "authorization_code";
  const clientId = typeof body.client_id === "string" ? body.client_id : "";
  if (grantType === "refresh_token") {
    const suppliedRefreshToken = typeof body.refresh_token === "string" ? body.refresh_token : "";
    const suppliedRefreshTokenHash = tokenHash(suppliedRefreshToken);
    const record = refreshTokens.get(suppliedRefreshTokenHash);
    if (!record || record.expiresAt <= Date.now() || record.clientId !== clientId) {
      response.status(400).json({ error: "invalid_grant" });
      return;
    }
    try {
      response.json(await issueTokenPair(record.userOpenId, record.clientId, suppliedRefreshTokenHash));
    } catch (error) {
      console.error(error instanceof Error ? error.message : String(error));
      response.status(500).json({ error: "token_persistence_failed" });
    }
    return;
  }
  if (grantType !== "authorization_code") {
    response.status(400).json({ error: "unsupported_grant_type" });
    return;
  }
  const code = typeof body.code === "string" ? body.code : "";
  const redirectUri = typeof body.redirect_uri === "string" ? body.redirect_uri : "";
  const verifier = typeof body.code_verifier === "string" ? body.code_verifier : undefined;
  const pending = oauthCodes.get(code);
  oauthCodes.delete(code);
  if (!pending || pending.expiresAt < Date.now() || pending.clientId !== clientId || pending.redirectUri !== redirectUri || !verifyPkce(verifier, pending.codeChallenge)) {
    response.status(400).json({ error: "invalid_grant" });
    return;
  }
  try {
    response.json(await issueTokenPair(pending.userOpenId, pending.clientId));
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    response.status(500).json({ error: "token_persistence_failed" });
  }
});

const providerSchema = z.enum(["gemini", "doubao", "deepseek", "openai", "qwen"]);
const imageInputSchema = z.object({
  dataUrl: z.string().max(10_000_000).optional(),
  url: z.string().url().max(2_000).optional(),
  mimeType: z.string().max(100).optional(),
}).refine((value) => Boolean(value.dataUrl || value.url), "dataUrl or url is required");

const videoInputSchema = z.object({
  dataUrl: z.string().max(10_000_000).optional(),
  url: z.string().url().max(8_000).optional(),
  materialId: z.string().max(1_000).optional(),
  mimeType: z.enum(["video/mp4", "video/quicktime"]).optional(),
}).refine((value) => Boolean(value.dataUrl || value.url || value.materialId), "dataUrl, url, or materialId is required");

function createServer(): McpServer {
  const server = new McpServer({
    name: "ecom-ai-router-mcp-server",
    version: process.env.SERVICE_VERSION || "0.1.0",
  });

  server.registerTool(
    "ecom_router_text_generate",
    {
      title: "Ecommerce Router Text Generate",
      description: "Generate text or strict JSON through the team AI Router. Provider keys stay on the server.",
      inputSchema: {
        prompt: z.string().min(1).max(100_000).describe("The task prompt"),
        system: z.string().max(30_000).optional(),
        provider: providerSchema.optional(),
        model: z.string().max(200).optional(),
        temperature: z.number().min(0).max(2).optional(),
        jsonMode: z.boolean().optional(),
        images: z.array(imageInputSchema).max(4).optional(),
      },
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: true },
    },
    async (input) => {
      const result = await aiRuntime.text.generate(input);
      return {
        content: [{ type: "text", text: JSON.stringify({
          provider: result.provider,
          model: result.model,
          text: result.text,
          status: result.status || "completed",
        }) }],
      };
    },
  );

  server.registerTool(
    "ecom_router_image_generate",
    {
      title: "Ecommerce Router Image Generate",
      description: "Generate an ecommerce image through the team AI Router. Use a real SKU reference image when identity matters.",
      inputSchema: {
        prompt: z.string().min(1).max(100_000).describe("The structured ecommerce image prompt"),
        provider: providerSchema.optional(),
        model: z.string().max(200).optional(),
        size: z.string().max(40).optional(),
        ratio: z.string().max(20).optional(),
        count: z.number().int().min(1).max(4).optional(),
        quality: z.enum(["low", "medium", "high", "auto"]).optional(),
        outputFormat: z.enum(["png", "jpeg", "webp"]).optional(),
        referenceImage: imageInputSchema.optional(),
      },
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: true },
    },
    async (input) => {
      const result = await aiRuntime.image.generate(input);
      const metadata = {
        provider: result.provider,
        model: result.model,
        status: result.status || "completed",
        text: result.text,
      };
      const content: Array<{ type: "text"; text: string } | { type: "image"; data: string; mimeType: string }> = [
        { type: "text", text: JSON.stringify(metadata) },
      ];
      const inline = result.image;
      if (inline?.data && inline?.mimeType) {
        content.push({ type: "image", data: inline.data, mimeType: inline.mimeType });
      }
      for (const image of result.images || []) {
        if (image?.b64_json) content.push({ type: "image", data: image.b64_json, mimeType: "image/png" });
        if (image?.url) content.push({ type: "text", text: JSON.stringify({ imageUrl: image.url }) });
      }
      return { content };
    },
  );

  server.registerTool(
    "ecom_router_video_start",
    {
      title: "Ecommerce Router Video Start",
      description: "Start a video generation job through the team AI Router. Ecommerce video defaults to Seedance 2.0; use model seedance-2.0-fast for a faster draft. Use referenceVideos for one original MP4/MOV video reference and referenceImages separately for SKU identity. Provider keys stay on the server.",
      inputSchema: {
        prompt: z.string().min(1).max(100_000),
        provider: providerSchema.optional(),
        model: z.string().max(200).optional(),
        ratio: z.string().max(20).optional(),
        seconds: z.number().int().min(1).max(60).optional(),
        size: z.string().max(40).optional(),
        generateAudio: z.boolean().optional(),
        referenceImages: z.array(imageInputSchema).max(4).optional(),
        referenceVideos: z.array(videoInputSchema).max(1).optional(),
      },
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: true },
    },
    async (input) => {
      const result = await aiRuntime.video.generate(input);
      return { content: [{ type: "text", text: JSON.stringify({
        provider: result.provider,
        model: result.model,
        jobId: result.jobId,
        status: result.status || "submitted",
      }) }] };
    },
  );

  server.registerTool(
    "ecom_router_video_poll",
    {
      title: "Ecommerce Router Video Poll",
      description: "Poll a video generation job created by the team AI Router.",
      inputSchema: {
        provider: providerSchema,
        jobId: z.string().min(1).max(1_000),
        model: z.string().max(200).optional(),
      },
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    async ({ provider, jobId, model }) => {
      const result = await aiRuntime.video.poll(provider, jobId, model);
      return { content: [{ type: "text", text: JSON.stringify(result) }] };
    },
  );

  return server;
}

async function handleMcpRequest(request: Request, response: Response) {
  // Tool calls are independent, so a stateless transport avoids idle-session and restart disconnects.
  // It also accepts stale session headers left by clients that previously used this router.
  const server = createServer();
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
  await server.connect(transport);
  response.once("close", () => {
    void transport.close();
    void server.close();
  });
  await transport.handleRequest(request, response, request.body);
}

app.post("/mcp", requireAuth, async (request, response) => {
  try {
    await handleMcpRequest(request, response);
  } catch (error) {
    if (!response.headersSent) response.status(500).json({ error: "mcp_request_failed" });
    console.error(error instanceof Error ? error.message : String(error));
  }
});

app.delete("/mcp", requireAuth, async (request, response) => {
  try {
    await handleMcpRequest(request, response);
  } catch (error) {
    if (!response.headersSent) response.status(500).json({ error: "mcp_request_failed" });
    console.error(error instanceof Error ? error.message : String(error));
  }
});

await loadRefreshTokens();
app.listen(port, "127.0.0.1", () => {
  console.log(`ecom-ai-router-mcp listening on 127.0.0.1:${port}`);
});

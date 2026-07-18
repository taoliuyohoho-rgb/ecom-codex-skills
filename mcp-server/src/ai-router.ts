import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

export type AiCapability = "text" | "image" | "video";
export type AiProvider = "gemini" | "doubao" | "deepseek" | "openai" | "qwen";

export type TextGenerateRequest = {
  prompt: string;
  system?: string;
  provider?: AiProvider;
  model?: string;
  temperature?: number;
  jsonMode?: boolean;
  images?: Array<{ dataUrl?: string; url?: string; mimeType?: string }>;
};

export type ImageGenerateRequest = {
  prompt: string;
  provider?: AiProvider;
  model?: string;
  size?: string;
  ratio?: string;
  count?: number;
  quality?: "low" | "medium" | "high" | "auto";
  outputFormat?: "png" | "jpeg" | "webp";
  referenceImage?: { dataUrl?: string; url?: string; mimeType?: string };
};

export type VideoGenerateRequest = {
  prompt: string;
  provider?: AiProvider;
  model?: string;
  ratio?: string;
  seconds?: number;
  size?: string;
  referenceImages?: Array<{ dataUrl?: string; url?: string; mimeType?: string }>;
  generateAudio?: boolean;
};

type ProviderProfile = {
  provider: AiProvider;
  capability: AiCapability;
  key?: string;
  baseUrl: string;
  model: string;
};

const DEFAULT_SHARED_ENV = join(process.env.HOME || process.env.USERPROFILE || ".", ".env.ai.shared.local");
const explicitEnvKeys = new Set(Object.keys(process.env));

loadAiEnvFiles();

export function loadAiEnvFiles(cwd = process.cwd()): string[] {
  const shared = process.env.AI_SHARED_ENV_PATH?.trim() || DEFAULT_SHARED_ENV;
  const loaded: string[] = [];

  for (const file of [shared, join(cwd, ".env"), join(cwd, ".env.local")]) {
    if (applyEnvFile(file)) loaded.push(file);
  }

  return loaded;
}

function applyEnvFile(file: string): boolean {
  if (!existsSync(file)) return false;

  const lines = readFileSync(file, "utf8").split(/\r?\n/);
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const cleaned = line.startsWith("export ") ? line.slice(7).trim() : line;
    const idx = cleaned.indexOf("=");
    if (idx <= 0) continue;

    const key = cleaned.slice(0, idx).trim();
    let value = cleaned.slice(idx + 1).trim();
    if (!/^[A-Z_][A-Z0-9_]*$/.test(key)) continue;
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (value !== "" && !explicitEnvKeys.has(key)) process.env[key] = value;
  }

  return true;
}

function env(...keys: string[]): string | undefined {
  for (const key of keys) {
    const value = process.env[key]?.trim();
    if (value) return value;
  }
  return undefined;
}

function realCallsEnabled(): boolean {
  return process.env.AI_REAL_CALLS_ENABLED === "true";
}

function fallbackEnabled(): boolean {
  return process.env.AI_ENABLE_FALLBACK !== "false";
}

function preferredProvider(capability: AiCapability): AiProvider {
  const key = `AI_DEFAULT_${capability.toUpperCase()}_PROVIDER`;
  const value = env(key) as AiProvider | undefined;
  if (value && providerOrder(capability).includes(value)) return value;
  if (capability === "image") return "gemini";
  if (capability === "video") return "doubao";
  return "gemini";
}

function providerOrder(capability: AiCapability): AiProvider[] {
  if (capability === "image") return ["gemini", "doubao", "openai"];
  if (capability === "video") return ["doubao", "gemini", "openai"];
  return ["gemini", "deepseek", "doubao", "openai", "qwen"];
}

function orderedProviders(capability: AiCapability, requested?: AiProvider): AiProvider[] {
  if (requested) return [requested];
  const primary = preferredProvider(capability);
  const order = providerOrder(capability);
  return [primary, ...order.filter((provider) => provider !== primary)];
}

function providerProfile(provider: AiProvider, capability: AiCapability, model?: string): ProviderProfile | undefined {
  if (provider === "gemini") {
    return {
      provider,
      capability,
      key: env("GEMINI_API_KEY", "GOOGLE_AI_API_KEY"),
      baseUrl: env("GEMINI_BASE_URL") || "https://generativelanguage.googleapis.com/v1beta",
      model:
        model ||
        (capability === "image"
          ? env("GEMINI_IMAGE_MODEL") || "gemini-3.1-flash-image"
          : capability === "video"
            ? env("GEMINI_VIDEO_MODEL") || "veo-3.1-fast-generate-preview"
            : env("GEMINI_TEXT_MODEL", "GEMINI_MODEL") || "gemini-3.1-flash-lite"),
    };
  }

  if (provider === "doubao") {
    const baseUrl =
      capability === "video"
        ? env("ARK_VIDEO_BASE_URL", "SEEDANCE_BASE_URL", "DOUBAO_BASE_URL", "DOUBAO_ENDPOINT") ||
          "https://ark.cn-beijing.volces.com/api/v3"
        : env("DOUBAO_BASE_URL", "DOUBAO_ENDPOINT") || "https://ark.cn-beijing.volces.com/api/v3";
    return {
      provider,
      capability,
      key:
        capability === "video"
          ? env("ARK_VIDEO_API_KEY", "SEEDANCE_API_KEY", "DOUBAO_API_KEY", "ARK_API_KEY")
          : env("DOUBAO_API_KEY", "ARK_API_KEY"),
      baseUrl,
      model:
        model ||
        (capability === "image"
          ? env("DOUBAO_IMAGE_MODEL", "SEEDREAM_MODEL") || "doubao-seedream-4-5-251128"
          : capability === "video"
            ? env("DOUBAO_VIDEO_MODEL", "SEEDANCE_MODEL", "VIDEO_MODEL_NAME") ||
              "doubao-seedance-1-0-lite-t2v-250428"
            : env("DOUBAO_TEXT_MODEL", "DOUBAO_MODEL") || "doubao-seed-2-0-mini-260215"),
    };
  }

  if (provider === "deepseek" && capability === "text") {
    return {
      provider,
      capability,
      key: env("DEEPSEEK_API_KEY"),
      baseUrl: env("DEEPSEEK_BASE_URL") || "https://api.deepseek.com",
      model: model || env("DEEPSEEK_TEXT_MODEL", "DEEPSEEK_MODEL") || "deepseek-v4-flash",
    };
  }

  if (provider === "openai") {
    const baseUrl =
      capability === "image"
        ? env("OPENAI_IMAGE_BASE_URL") || "https://grsaiapi.com/v1"
        : env("OPENAI_BASE_URL") || "https://api.openai.com";
    return {
      provider,
      capability,
      key: capability === "image" ? env("OPENAI_IMAGE_API_KEY", "OPENAI_API_KEY") : env("OPENAI_API_KEY"),
      baseUrl,
      model:
        model ||
        (capability === "image"
          ? env("OPENAI_IMAGE_MODEL") || "gpt-image-2"
          : capability === "video"
            ? env("OPENAI_VIDEO_MODEL") || "sora-2"
            : env("OPENAI_TEXT_MODEL", "OPENAI_MODEL") || "gpt-5.4-mini"),
    };
  }

  if (provider === "qwen" && capability === "text") {
    const baseUrl =
      env("QWEN_BASE_URL", "DASHSCOPE_BASE_URL") || "https://{WorkspaceId}.ap-southeast-1.maas.aliyuncs.com/compatible-mode/v1";
    return {
      provider,
      capability,
      key: env("QWEN_API_KEY", "DASHSCOPE_API_KEY"),
      baseUrl,
      model: model || env("QWEN_TEXT_MODEL", "QWEN_MODEL") || "qwen-flash",
    };
  }

  return undefined;
}

function trimSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

function ensureV1(baseUrl: string): string {
  const base = trimSlash(baseUrl);
  return base.endsWith("/v1") ? base : `${base}/v1`;
}

function openAiCompatibleChatUrl(profile: ProviderProfile): string {
  if (profile.provider === "doubao") return `${trimSlash(profile.baseUrl)}/chat/completions`;
  if (profile.provider === "qwen") return `${trimSlash(profile.baseUrl)}/chat/completions`;
  return `${ensureV1(profile.baseUrl)}/chat/completions`;
}

function openAiResponsesUrl(profile: ProviderProfile): string {
  const base = trimSlash(profile.baseUrl);
  if (base.endsWith("/v1")) return `${base}/responses`;
  if (base === "https://api.openai.com" || base.endsWith(".openai.com")) return `${base}/v1/responses`;
  return `${base}/responses`;
}

function imageUrl(profile: ProviderProfile): string {
  if (profile.provider === "doubao") return `${trimSlash(profile.baseUrl)}/images/generations`;
  return `${ensureV1(profile.baseUrl)}/images/generations`;
}

function openAiWireApi(): "chat_completions" | "responses" {
  return process.env.OPENAI_WIRE_API === "responses" ? "responses" : "chat_completions";
}

function deepSeekThinking(): "enabled" | "disabled" | undefined {
  const value = process.env.DEEPSEEK_THINKING?.trim();
  if (value === "enabled" || value === "disabled") return value;
  return undefined;
}

function deepSeekReasoningEffort(): "low" | "medium" | "high" | undefined {
  const value = process.env.DEEPSEEK_REASONING_EFFORT?.trim();
  if (value === "low" || value === "medium" || value === "high") return value;
  return undefined;
}

function openAiHeaders(key: string, contentType = true): Record<string, string> {
  return {
    authorization: `Bearer ${key}`,
    "user-agent": "Mozilla/5.0 ai-router",
    ...(contentType ? { "content-type": "application/json" } : {}),
  };
}

function responseOutputText(data: any): string | undefined {
  if (typeof data?.output_text === "string") return data.output_text;
  const chunks: string[] = [];
  for (const item of data?.output || []) {
    for (const content of item?.content || []) {
      if (typeof content?.text === "string") chunks.push(content.text);
      if (typeof content?.value === "string") chunks.push(content.value);
    }
  }
  return chunks.length ? chunks.join("\n") : undefined;
}

async function requestJson(url: string, init: RequestInit): Promise<any> {
  const res = await fetch(url, init);
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  if (!res.ok) {
    const detail = data?.error?.message || data?.message || text || res.statusText;
    throw new Error(`${res.status} ${res.statusText}: ${detail}`);
  }
  return data;
}

async function withProviderFallback<T>(
  capability: AiCapability,
  requested: AiProvider | undefined,
  model: string | undefined,
  call: (profile: ProviderProfile) => Promise<T>,
): Promise<T> {
  const providers = orderedProviders(capability, requested);
  const errors: string[] = [];

  for (const provider of providers) {
    const profile = providerProfile(provider, capability, model);
    if (!profile) continue;

    if (!realCallsEnabled()) {
      return {
        status: "dry-run",
        provider: profile.provider,
        capability,
        model: profile.model,
        realCallsEnabled: false,
      } as T;
    }

    if (profile.baseUrl.includes("{WorkspaceId}")) {
      errors.push(`${provider}: base URL requires WorkspaceId`);
      if (!fallbackEnabled() || requested) break;
      continue;
    }

    if (!profile.key) {
      errors.push(`${provider}: missing API key`);
      if (!fallbackEnabled() || requested) break;
      continue;
    }

    try {
      return await call(profile);
    } catch (error) {
      errors.push(`${provider}: ${error instanceof Error ? error.message : String(error)}`);
      if (!fallbackEnabled() || requested) break;
    }
  }

  throw new Error(`No ${capability} provider succeeded. ${errors.join(" | ")}`);
}

function openAiUserContent(prompt: string, images?: TextGenerateRequest["images"]): any {
  if (!images?.length) return prompt;
  return [
    { type: "text", text: prompt },
    ...images.map((image) => ({ type: "image_url", image_url: { url: image.dataUrl || image.url } })),
  ];
}

function geminiParts(prompt: string, images?: Array<{ dataUrl?: string; url?: string; mimeType?: string }>): any[] {
  const parts: any[] = [{ text: prompt }];
  for (const image of images || []) {
    if (image.dataUrl) {
      const match = image.dataUrl.match(/^data:([^;]+);base64,(.*)$/);
      if (match) parts.push({ inlineData: { mimeType: image.mimeType || match[1], data: match[2] } });
      continue;
    }
    if (image.url) parts.push({ text: `Reference image URL: ${image.url}` });
  }
  return parts;
}

async function generateText(req: TextGenerateRequest): Promise<any> {
  return withProviderFallback("text", req.provider, req.model, async (profile) => {
    if (profile.provider === "gemini") {
      const body: any = {
        contents: [{ role: "user", parts: geminiParts(req.prompt, req.images) }],
        generationConfig: { temperature: req.temperature ?? 0.4 },
      };
      if (req.system) body.systemInstruction = { parts: [{ text: req.system }] };
      if (req.jsonMode) body.generationConfig.responseMimeType = "application/json";

      const data = await requestJson(`${trimSlash(profile.baseUrl)}/models/${profile.model}:generateContent`, {
        method: "POST",
        headers: { "content-type": "application/json", "x-goog-api-key": profile.key! },
        body: JSON.stringify(body),
      });
      const text = data?.candidates?.[0]?.content?.parts?.map((part: any) => part.text).filter(Boolean).join("\n");
      return { provider: profile.provider, model: profile.model, text, raw: data };
    }

    const prompt =
      profile.provider === "deepseek" && req.images?.length
        ? `${req.prompt}\n\nImage references were provided but DeepSeek text endpoints do not process vision here. URLs/data were omitted.`
        : req.prompt;
    const messages = [
      ...(req.system ? [{ role: "system", content: req.system }] : []),
      { role: "user", content: openAiUserContent(prompt, profile.provider === "deepseek" ? [] : req.images) },
    ];

    if (profile.provider === "openai" && openAiWireApi() === "responses") {
      const body: any = {
        model: profile.model,
        input: messages.filter((message) => message.role !== "system"),
      };
      if (req.system) body.instructions = req.system;
      if (req.jsonMode) body.text = { format: { type: "json_object" } };

      const data = await requestJson(openAiResponsesUrl(profile), {
        method: "POST",
        headers: openAiHeaders(profile.key!),
        body: JSON.stringify(body),
      });
      return { provider: profile.provider, model: profile.model, text: responseOutputText(data), raw: data };
    }

    const body: any = {
      model: profile.model,
      messages,
      temperature: req.temperature ?? 0.4,
    };
    if (req.jsonMode) body.response_format = { type: "json_object" };
    if (profile.provider === "deepseek" && profile.model.startsWith("deepseek-v4-")) {
      const thinking = deepSeekThinking();
      if (thinking) body.thinking = { type: thinking };
      const reasoningEffort = deepSeekReasoningEffort();
      if (reasoningEffort) body.reasoning_effort = reasoningEffort;
    }

    const data = await requestJson(openAiCompatibleChatUrl(profile), {
      method: "POST",
      headers:
        profile.provider === "openai"
          ? openAiHeaders(profile.key!)
          : { authorization: `Bearer ${profile.key}`, "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    return { provider: profile.provider, model: profile.model, text: data?.choices?.[0]?.message?.content, raw: data };
  });
}

async function generateImage(req: ImageGenerateRequest): Promise<any> {
  return withProviderFallback("image", req.provider, req.model, async (profile) => {
    if (profile.provider === "gemini") {
      const body = {
        contents: [{ role: "user", parts: geminiParts(req.prompt, req.referenceImage ? [req.referenceImage] : []) }],
        generationConfig: {
          responseModalities: ["TEXT", "IMAGE"],
          imageConfig: req.ratio ? { aspectRatio: req.ratio } : undefined,
        },
      };
      const data = await requestJson(`${trimSlash(profile.baseUrl)}/models/${profile.model}:generateContent`, {
        method: "POST",
        headers: { "content-type": "application/json", "x-goog-api-key": profile.key! },
        body: JSON.stringify(body),
      });
      const parts = data?.candidates?.[0]?.content?.parts || [];
      const image = parts.find((part: any) => part.inlineData)?.inlineData;
      const text = parts.map((part: any) => part.text).filter(Boolean).join("\n");
      return { provider: profile.provider, model: profile.model, image, text, raw: data };
    }

    const body: any = {
      model: profile.model,
      prompt: req.prompt,
      n: req.count || 1,
      size: req.size || "1024x1024",
    };
    if (profile.provider === "doubao") {
      body.response_format = "b64_json";
      body.extra_body = {
        watermark: false,
        reference_image: req.referenceImage?.dataUrl || req.referenceImage?.url,
      };
    } else if (profile.provider === "openai") {
      body.quality = req.quality || env("OPENAI_IMAGE_QUALITY") || undefined;
      body.output_format = req.outputFormat || "png";
    }

    const data = await requestJson(imageUrl(profile), {
      method: "POST",
      headers:
        profile.provider === "openai"
          ? openAiHeaders(profile.key!)
          : { authorization: `Bearer ${profile.key}`, "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    return { provider: profile.provider, model: profile.model, images: data?.data, raw: data };
  });
}

async function generateVideo(req: VideoGenerateRequest): Promise<any> {
  return withProviderFallback("video", req.provider, req.model, async (profile) => {
    if (profile.provider === "doubao") {
      const content: any[] = [{ type: "text", text: req.prompt }];
      for (const image of req.referenceImages || []) {
        const value = image.url || image.dataUrl;
        if (value) content.push({ type: "image_url", image_url: { url: value } });
      }
      const data = await requestJson(`${trimSlash(profile.baseUrl)}/contents/generations/tasks`, {
        method: "POST",
        headers: { authorization: `Bearer ${profile.key}`, "content-type": "application/json" },
        body: JSON.stringify({
          model: profile.model,
          content,
          duration: req.seconds,
          ratio: req.ratio || "16:9",
          watermark: false,
          generate_audio: req.generateAudio ?? false,
        }),
      });
      return { provider: profile.provider, model: profile.model, jobId: data?.id || data?.task_id || data?.data?.id, raw: data };
    }

    if (profile.provider === "gemini") {
      const body = {
        instances: [{ prompt: req.prompt }],
        parameters: {
          aspectRatio: req.ratio || "16:9",
          durationSeconds: req.seconds,
        },
      };
      const data = await requestJson(`${trimSlash(profile.baseUrl)}/models/${profile.model}:predictLongRunning`, {
        method: "POST",
        headers: { "content-type": "application/json", "x-goog-api-key": profile.key! },
        body: JSON.stringify(body),
      });
      return { provider: profile.provider, model: profile.model, jobId: data?.name, raw: data };
    }

    const form = new FormData();
    form.set("model", profile.model);
    form.set("prompt", req.prompt);
    if (req.seconds) form.set("seconds", String(req.seconds));
    if (req.size) form.set("size", req.size);
    const data = await requestJson(`${ensureV1(profile.baseUrl)}/videos`, {
      method: "POST",
      headers: openAiHeaders(profile.key!, false),
      body: form,
    });
    return { provider: profile.provider, model: profile.model, jobId: data?.id, raw: data };
  });
}

async function pollVideo(provider: AiProvider, jobId: string, model?: string): Promise<any> {
  const profile = providerProfile(provider, "video", model);
  if (!profile) throw new Error(`Provider ${provider} does not support video in this router`);
  if (!realCallsEnabled()) return { status: "dry-run", provider, jobId };
  if (!profile.key) throw new Error(`Missing API key for ${provider}`);

  if (provider === "doubao") {
    return requestJson(`${trimSlash(profile.baseUrl)}/contents/generations/tasks/${encodeURIComponent(jobId)}`, {
      method: "GET",
      headers: { authorization: `Bearer ${profile.key}` },
    });
  }

  if (provider === "gemini") {
    const operationUrl = jobId.startsWith("http") ? jobId : `${trimSlash(profile.baseUrl)}/${jobId}`;
    return requestJson(operationUrl, {
      method: "GET",
      headers: { "x-goog-api-key": profile.key },
    });
  }

  return requestJson(`${ensureV1(profile.baseUrl)}/videos/${encodeURIComponent(jobId)}`, {
    method: "GET",
    headers: openAiHeaders(profile.key!, false),
  });
}

export const aiRuntime = {
  env: {
    load: loadAiEnvFiles,
    realCallsEnabled,
    fallbackEnabled,
    providerProfile,
  },
  text: { generate: generateText },
  image: { generate: generateImage },
  video: { generate: generateVideo, poll: pollVideo },
};

export default aiRuntime;

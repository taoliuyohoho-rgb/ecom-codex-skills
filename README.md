# Ecommerce Codex Skills

Public, sanitized skills for the ecommerce team. The package contains:

- `global-ai-router`: calls the team MCP Router without exposing provider keys.
- `ecom-image-director`: identity-safe ecommerce image planning and output protocol.
- `video-director-core`: shared video stage, approval, cost, shot-planning, review, and render-validation rules.
- `shopee-my-detail-tags`: localized Chinese-English-Malay SEO tags, hashtags, and keyword alternatives for Shopee Malaysia.
- `malay-ad-copy-skill`: short bilingual Malaysia ecommerce ad copy and fixed four-hashtag blocks for Shopee, Lazada, and TikTok Shop.
- `mcp-server/`: the stateless Streamable HTTP MCP Router service.

## Install skills

```bash
git clone https://github.com/taoliuyohoho-rgb/ecom-codex-skills.git
cd ecom-codex-skills
npm install
npm run install-skills
```

Installation copies only skill instructions into the local Codex skills directory. It does not install or expose API keys. `video-director-core` is a process skill and does not call a provider by itself; use `global-ai-router` for AI generation.

## MCP Router

The MCP service exposes text, image, and video tools at `/mcp` and a non-secret `/health` endpoint. Provider keys are loaded only by the server from a secret-managed environment. Clients must authenticate with the team-approved MCP transport; do not put the bearer token in this public repository.

## Team Router

- MCP endpoint: `https://ai-router.metooloo.com/mcp`
- Health: `https://ai-router.metooloo.com/health`
- Authentication: Feishu OIDC OAuth with PKCE; clients should follow the MCP OAuth metadata instead of asking operators for provider keys. The Router proxies the Feishu OIDC authorization code exchange server-side and then returns a short-lived MCP token to the client.

## Contributing

Team members change shared skills through Git branches and pull requests. Repository collaborators can push a branch directly; teammates without write access can fork the public repository and submit a pull request. Run `npm test` before requesting review. See [CONTRIBUTING.md](CONTRIBUTING.md) for the exact workflow and image-skill evidence requirements.

Before production work, each teammate should read the [team usage guide](docs/TEAM_USAGE.md) and pass the [team collaboration smoke test](docs/team-collaboration-smoke-test.md). Together they define the Feishu knowledge, published Skill, approval, Router, review, writeback, and knowledge-governance flow.

The ecommerce Feishu protocol is the source for role boundaries, product facts, Skill publication status, writeback rules, and the current Router deployment status.

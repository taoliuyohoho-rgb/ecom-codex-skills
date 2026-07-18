# Ecommerce Codex Skills

Public, sanitized skills for the ecommerce team. The package contains:

- `global-ai-router`: calls the team MCP Router without exposing provider keys.
- `ecom-image-director`: identity-safe ecommerce image planning and output protocol.
- `mcp-server/`: the stateless Streamable HTTP MCP Router service.

## Install skills

```bash
git clone https://github.com/taoliuyohoho-rgb/ecom-codex-skills.git
cd ecom-codex-skills
npm install
npm run install-skills
```

Installation copies only skill instructions into the local Codex skills directory. It does not install or expose API keys.

## MCP Router

The MCP service exposes text, image, and video tools at `/mcp` and a non-secret `/health` endpoint. Provider keys are loaded only by the server from a secret-managed environment. Clients must authenticate with the team-approved MCP transport; do not put the bearer token in this public repository.

## Team Router

- MCP endpoint: `https://ai-router.metooloo.com/mcp`
- Health: `https://ai-router.metooloo.com/health`
- Authentication: Feishu OAuth with PKCE; clients should follow the MCP OAuth metadata instead of asking operators for provider keys.

The ecommerce Feishu protocol is the source for role boundaries, product facts, Skill publication status, writeback rules, and the current Router deployment status.

---
name: global-ai-router
description: Use the team ecommerce MCP Router for text, JSON, image, and video generation. Provider keys remain server-side.
---

# Global AI Router

Use the team MCP Router instead of calling providers directly or inventing project-specific API key names.

The team endpoint is `https://ai-router.metooloo.com/mcp`. Use the MCP client's OAuth flow when it is available; do not copy a bearer token from another user or ask an operator for provider keys.

## Tool selection

- Text or JSON: `ecom_router_text_generate`
- Ecommerce image generation/editing: `ecom_router_image_generate`
- Video jobs: `ecom_router_video_start`, then `ecom_router_video_poll`

### Ecommerce video default

For story-led ecommerce video, use the Router's Doubao/Seedance route. The default model is `doubao-seedance-2-0-260128`; the bounded fast-draft alias is `seedance-2.0-fast` (`doubao-seedance-2-0-fast-260128`). The Router also accepts `seedance-2.0` as an alias for the standard model, so callers do not need to hard-code a provider-specific model ID.

The canonical override is `SEEDANCE_VIDEO_MODEL`; older `DOUBAO_VIDEO_MODEL`, `SEEDANCE_MODEL`, and `VIDEO_MODEL_NAME` settings remain compatibility fallbacks. If an old override still points to Seedance 1.x, change it before running a 2.0 job.

Always run the Skill's `no_spend_dry_run` before a real job. Pass one clean SKU identity reference image for actual generation unless the approved execution plan explicitly assigns roles to additional references for storyboard/planning.

## Rules

- Provider keys, App Secrets, and access tokens are never requested from operators and never written to Feishu, Git, prompts, or logs.
- Use dry-run when the user has not approved a real provider call or when the Router reports live calls disabled.
- Use the product's real SKU/reference image for identity-sensitive ecommerce images. If the selected route cannot accept a reference image, stop and report the limitation.
- Return provider, model, status, result summary, evidence, cost/usage when available, and the next writeback location.
- Do not treat a generated asset as approved or published without the required human confirmation.

## Canonical context

Before calling the Router, read the ecommerce shared protocol and the product master data. Include SKU, store, platform, account, task type, output format, budget/quality boundary, and reference assets.

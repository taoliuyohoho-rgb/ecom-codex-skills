---
name: global-ai-router
description: Use the team ecommerce MCP Router for text, JSON, image, and video generation. Provider keys remain server-side.
---

# Global AI Router

Use the team MCP Router instead of calling providers directly or inventing project-specific API key names.

## Tool selection

- Text or JSON: `ecom_router_text_generate`
- Ecommerce image generation/editing: `ecom_router_image_generate`
- Video jobs: `ecom_router_video_start`, then `ecom_router_video_poll`

## Rules

- Provider keys, App Secrets, and access tokens are never requested from operators and never written to Feishu, Git, prompts, or logs.
- Use dry-run when the user has not approved a real provider call or when the Router reports live calls disabled.
- Use the product's real SKU/reference image for identity-sensitive ecommerce images. If the selected route cannot accept a reference image, stop and report the limitation.
- Return provider, model, status, result summary, evidence, cost/usage when available, and the next writeback location.
- Do not treat a generated asset as approved or published without the required human confirmation.

## Canonical context

Before calling the Router, read the ecommerce shared protocol and the product master data. Include SKU, store, platform, account, task type, output format, budget/quality boundary, and reference assets.

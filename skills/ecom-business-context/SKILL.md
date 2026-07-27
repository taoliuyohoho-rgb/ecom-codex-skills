---
name: ecom-business-context
description: "Use before any team ecommerce task to read the live Feishu product master by SKU, separate confirmed facts from hypotheses, resolve variants and permissions, and return a minimal safe task context. Do not generate content or modify product truth."
version: 1.0.0
---

# Ecommerce Business Context

This is the shared truth-loading layer for team ecommerce Skills. It does not create titles, images, detail pages, videos, research conclusions, or product-master changes.

## Canonical source

Read `马来电商-商品策略 / 商品主数据` by exact SKU or stable product identity. Then read only task-relevant store, Listing, account, strategy, task and prior approved asset records.

Return three separate groups:

- `confirmed_facts`: values explicitly present in the live Base or approved linked evidence;
- `hypotheses`: creative or market ideas that are not product truth;
- `gaps`: missing, conflicting or inaccessible fields with the resource and owner needed.

The minimum context contains SKU, product name, variant, verified structure/specification, approved selling points, forbidden expressions, real SKU reference image, platform, market, audience, lifecycle/approval state, task target and writeback target.

## Rules

- Base truth outranks personal notes, local YAML, prompts, competitor pages and model knowledge.
- A record containing several SKUs or unresolved variants is not production-ready. Stop as `blocked` until one physical variant is selected.
- Competitor content may support market observations, never product specifications or claims.
- Read only the relevant records; do not pull every team table.
- Do not modify product-master facts. Send corrections to the designated fact owner/Admin.
- If the Agent cannot read Feishu, report the exact missing Base/table/identity/scope. Do not replace the missing facts with guesses.

## Output contract

Return SKU, product record reference, confirmed facts, hypotheses, gaps, source revision/time when available, task scope, writeback target, and `context_status` as `ready` or `blocked`.

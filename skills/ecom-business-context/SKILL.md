---
name: ecom-business-context
description: "Use before any team ecommerce task to read the live Feishu product master by SKU, separate confirmed facts from hypotheses, resolve variants and permissions, and return a minimal safe task context. Do not generate content or modify product truth."
metadata:
  version: 1.1.0
---

# Ecommerce Business Context

This is the shared truth-loading layer for team ecommerce Skills. It does not create titles, images, detail pages, videos, research conclusions, or product-master changes.

## Canonical source

Read `马来电商-商品策略 / 商品主数据` by exact SKU or stable product identity. Then read only task-relevant store, Listing, account, strategy, task and prior approved asset records.

Return three separate groups:

- `confirmed_facts`: values explicitly present in the live Base or approved linked evidence;
- `hypotheses`: creative or market ideas that are not product truth;
- `gaps`: missing, conflicting or inaccessible fields with the resource and owner needed.

The minimum context contains SKU, product name, variant, verified structure/specification, approved selling points, forbidden expressions, platform, market, audience, lifecycle/approval state, task target and writeback target. A real SKU reference may come from a Base attachment or a directly inspectable local asset.

## Malaysia Ecom Adapter Procedure

For the Malaysia ecommerce workspace, this Skill is directly executable. Read
the nearest project `AGENTS.md` first, then resolve the source map declared
there. The default product master is `马来电商-商品策略 / 商品主数据`.

Use `lark-cli base` with user identity and real IDs returned by each previous
step. Do not guess table IDs or field names:

1. Resolve the Base by title with `lark-cli base +title-resolve --title
   "马来电商-商品策略" --as user` unless the project adapter supplies a
   current Base URL/token.
2. List Base blocks with `+base-block-list`; identify the table named
   `商品主数据`.
3. Read the table schema with `+field-list`; determine the actual SKU, product
   name, variant, approved-claim, lifecycle, asset, platform, market and store
   fields before searching.
4. Search the exact SKU first with `+record-search`. If the user did not give
   one, resolve a stable product identity from the local product card only as a
   lookup key, then search the live table by its actual product-name field.
5. Read the selected record in full with `+record-get` and record the Base,
   table, record ID, query time and available revision/update time in the task
   context. Do not persist access tokens in run artifacts.
6. When several variants, stores, accounts, or candidate records remain,
   return `context_status: blocked` with the exact disambiguation required.

After this snapshot, local `products/*.yaml`, asset folders, market memory,
prompts and prior runs may supply asset indexes, directly inspectable SKU
references, prior-review context and creative hypotheses. A clean local asset
may be used when its visible SKU/variant, source/owner, rights/reuse status and
baked claims are audited. It cannot overwrite price, inventory, lifecycle,
approved claims, compliance or store/account identity from the live record.

## Rules

- Base truth outranks personal notes, local YAML, prompts, competitor pages and model knowledge for business facts, claims, price, lifecycle, compliance, promotions and store/account identity.
- Local files are first-class asset sources after inspection. A missing Base attachment is a `gap`, not an automatic asset rejection; reject a local asset only when identity, source/rights, reuse scope or visible claims are unresolved.
- A record containing several SKUs or unresolved variants is not production-ready. Stop as `blocked` until one physical variant is selected.
- Missing optional Base fields do not block a direction or no-spend asset audit unless the requested output needs those fields. They do block a claim, price/promotion, paid call, reuse or publishing decision that depends on them.
- Competitor content may support market observations, never product specifications or claims.
- Read only the relevant records; do not pull every team table.
- Do not modify product-master facts. Send corrections to the designated fact owner/Admin.
- If the Agent cannot read Feishu, report the exact missing Base/table/identity/scope. Do not replace the missing facts with guesses.

## Output contract

Return SKU, product record reference, confirmed facts, hypotheses, gaps, source
revision/time when available, task scope, writeback target, and
`context_status` as `ready` or `blocked`. Include `source_trace` with the Base
title, table name/ID, record ID, lookup key and query time, but never an access
token or credential.

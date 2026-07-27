---
name: ecom-nine-images
description: "Use for a standard ecommerce 9-image listing pack. Read the live Feishu product master by SKU, verify identity/specifications/claims/reference image, propose directions, generate one approved sample, review it, then expand to exactly nine numbered slots and write the run back. Do not use for titles, detail-page copy, videos, or product deep research."
version: 1.0.0
metadata:
  hermes:
    tags: [ecommerce, nine-images, listing, sku, review]
    related_skills: [global-ai-router, ecom-business-context, ecom-run-contract, ecom-review-approval]
---

# Ecommerce Nine Images

This is the single production entry point for a standard ecommerce 9-image listing pack. It owns the image pack workflow only. It does not own product research, titles, detail-page copy, video, publishing automation, or personal product memory.

## Required shared context

Use `ecom-business-context` first. Resolve the SKU from the live Feishu `马来电商-商品策略 / 商品主数据` record. Treat the following as canonical:

- SKU and product identity;
- verified structure/specifications;
- real SKU reference image;
- approved selling points and forbidden expressions;
- market, platform and audience;
- lifecycle and approval status.

If the SKU is ambiguous, the record is only a candidate, the real reference image is missing, or a critical fact conflicts, return `blocked`. Never substitute a local YAML, prompt, competitor listing, or model knowledge for missing product truth.

## Standard nine-slot contract

The pack always has exactly nine numbered slots. Platform adapters may change ratio, canvas, language and copy density, but must not change slot numbers or silently add/remove slots.

| Slot | Mission |
|---|---|
| 1 | Product identity / hero: make the exact SKU immediately recognizable |
| 2 | Primary use case: show the product in its normal customer context |
| 3 | Core benefit: prove one approved benefit with visible evidence |
| 4 | Key specification: show only verified size, capacity, material or structure |
| 5 | How to use: show the simplest safe usage sequence |
| 6 | Product details: close-up of controls, texture, interface or construction |
| 7 | Package contents / variants: show only verified contents and variants |
| 8 | Audience / scenario: connect the SKU to one approved buyer situation |
| 9 | Trust / decision support: care, compatibility, boundary, or approved CTA; no invented badge or claim |

The slot mission can be narrowed or reordered within a platform adapter only when the adapter records the mapping. The output must still contain slots `1` through `9`.

## State machine

1. `context_pending`: missing or conflicting facts, permissions, reference or writeback target. Stop and name the exact gap.
2. `context_ready`: SKU, platform, market, audience, claims, reference image, task/run and writeback are known.
3. `directions_proposed`: present 2-3 materially different visual systems and recommend one. No provider call.
4. `direction_approved`: named human selected a direction and authorized the sample scope.
5. `sample_generated`: call `ecom_router_image_generate` exactly for the smallest useful sample, normally one image, with the real reference image.
6. `sample_reviewed`: review identity, claims, slot mission, platform fit and technical quality.
7. `sample_approved`: named human approves the sample and expansion scope.
8. `nine_pack_generated`: generate exactly slots 1-9 using the approved visual system and one mission per slot.
9. `nine_pack_reviewed`: review every slot; any identity drift, unsupported claim, wrong variant or missing reference blocks pack approval.
10. `pack_approved`: Admin or the explicitly designated final approver approves the complete nine-image scope.
11. `written_back`: write version, run, assets, review, approval and next action to Feishu. `published` requires platform evidence and is a separate state.

## Generation rules

- Use `global-ai-router` and `ecom_router_image_generate`; provider keys remain server-side.
- Pass the real SKU image through the Router's exact `referenceImage` input. Do not rename or omit this field.
- Every real request includes `task_id`, `run_id`, `skill_name`, `skill_version`, `sku`, `slot`, platform, market, approved direction and reference image source.
- Generate one sample first. Never generate the full nine-image pack before sample approval.
- Preserve product type, silhouette, proportions, packaging, controls, logo area and visible SKU details. Text-only generation is not identity-safe.
- Do not ask the image model to render long product copy, specifications, ratings, badges or compliance statements. Use a separate approved overlay step when needed.
- A provider result is `generated`, not `reviewed`, `approved`, `delivered` or `published`.

## Run and concurrency rules

Use `ecom-run-contract` for every task. Create a new run for each operator attempt; do not reuse another operator's run or output directory. The canonical asset namespace is:

```text
<SKU>/nine-images/<platform>/<market>/<run_id>/slot-01 ... slot-09
```

Write append-only run events where possible. Never overwrite another run's sample, approval, or final pack. A sample approval applies only to the exact `run_id`, direction version and sample asset it names.

## Output and writeback

Return:

- known facts and evidence sources;
- gaps and blocked items;
- `task_id`, `run_id`, operator/Agent identity, Skill version;
- platform, market and slot map `1..9`;
- selected direction and sample status;
- provider/model/status/request id for each real call;
- asset links and review decisions;
- approval ledger with approver, role, scope and timestamp;
- current state and next owner/action.

Write structured status to the assigned operational task and run log. Store large media in the approved Drive/shared-storage location and write links, not blobs, into Base. Never modify the product master from this Skill. Never mark `published` without a real platform URL or equivalent evidence.

## Stop conditions

Stop as `blocked` when:

- the product master record is missing or ambiguous;
- the SKU has variant collisions that are not resolved;
- the real SKU image is missing or unreadable;
- forbidden expressions or approved claims are unclear;
- the Agent lacks the required Feishu/MCP capability;
- direction, real-call or sample approval is absent;
- a shared or personal run would be overwritten.

Do not ask for API keys. Report the missing capability, resource, scope or approval instead.

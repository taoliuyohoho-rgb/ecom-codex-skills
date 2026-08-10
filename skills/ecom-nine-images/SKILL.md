---
name: ecom-nine-images
description: "Use for a standard ecommerce 9-image listing pack. Read the live Feishu product master by SKU, verify identity/specifications/claims/reference image, propose directions, generate one approved sample, review it, then expand to exactly nine numbered slots and write the run back. Do not use for titles, detail-page copy, videos, or product deep research."
metadata:
  hermes:
    tags: [ecommerce, nine-images, listing, sku, review]
    related_skills: [global-ai-router, ecom-business-context, ecom-run-contract, ecom-review-approval]
---

# Ecommerce Nine Images

This is the single production entry point for a standard ecommerce 9-image listing pack. It owns the image pack workflow only. It does not own product research, titles, detail-page copy, video, publishing automation, or personal product memory.

Read `references/pack-architecture.md` before assigning or revising slot missions. It defines the cross-slot differentiation matrix and the sensitive-category distinction between need-state, desired-state, and personal ritual images.

## Required shared context

Use `ecom-business-context` first. Resolve the SKU from the live Feishu `马来电商-商品策略 / 商品主数据` record. Treat the following as canonical:

- SKU and product identity;
- verified structure/specifications;
- real SKU reference image;
- approved selling points and forbidden expressions;
- market, platform and audience;
- lifecycle and approval status.

Download and inspect the actual Base attachment before declaring it inadequate. Classify it as one of:

- `commercial_key_visual`: a polished product KV that already establishes the product family, composition, palette and hierarchy;
- `clean_packshot`: a clean, readable package/product anchor;
- `partial_reference`: a readable but incomplete view of the SKU;
- `unusable`: unreadable, wrong SKU, severely occluded, or too low-resolution for its intended slot.

A `commercial_key_visual` is a valid production reference, not a reason to ask for another product photo. Use it as the real SKU anchor for every generated or edited image. The model may render packaging and necessary text as part of the complete image, but review must confirm that it did not change any buyer-relevant SKU fact: product type, brand, package/specification, count, quantity relationship, approved claim, promotion or certification.

Formal product-image delivery defaults to one coherent `gpt-image-2` generation or edit with the real SKU reference. Do not use programmatic collage, logo/text overlays, or post-generation layout composition. Programmatic components only transport and verify references, check files/platform requirements, retain run evidence, and assist review.

If the SKU is ambiguous, the record is only a candidate, the actual Base attachment is unavailable, or a critical fact conflicts, return `blocked`. Never substitute a local YAML, prompt, competitor listing, or model knowledge for missing product truth.

## Visual benchmark before direction

Invoke the independent `ecom-visual-benchmark` Skill before proposing directions. It must return a dated benchmark bundle with 5-12 source-bound samples or explicit gaps, mechanism IDs, confidence, forbidden copying boundaries, and a reverse prompt brief. Sources without performance proof remain `visual_reference_only`; they are not high-converting or best-selling evidence. `ecom-nine-images` owns the direction proposal and image-generation approval gates; it does not reimplement collection or provider selection.

A benchmark with inaccessible marketplace sales data can still guide visual design; it cannot justify sales, conversion, or ranking claims. If no current public benchmark is accessible, use a dated local/on-platform evidence set and label confidence accordingly.

## Selling-point visual contract

Read `references/selling-point-visual-contract.md` before mapping approved selling points into secondary slots, especially for intimate care or other sensitive categories.

Default to one approved selling point or one buyer uncertainty per secondary image. Use concise visible text plus a supporting visual when the visual alone would be ambiguous. Slots 2-9 may be remapped around the SKU's approved selling points, proof, use, package, and decision barriers instead of forcing repetitive packshot, specification, and component views. Create a differentiation matrix before generation: any two slots that share the same buyer question or merely vary the same product-plus-headline composition must be redesigned.

A sensitive-category metaphor may make an approved idea understandable without explicit anatomy, but it must remain non-clinical and platform-appropriate. It cannot serve as efficacy evidence, authorize a stronger claim, or substitute for official How to Use directions.

Decision-support slots may use a clearly labeled illustrative shopper question, but never a fabricated user review, star rating, username, date, quotation, testimonial, or personal outcome. Real review language must come from a source-bound research record.

Reject a defensive FAQ that introduces medicine, disease, safety, or treatment anxiety the buyer did not bring to the listing. A user-led need-state, desired-state, or quiet ritual scene may use the SKU as a small or partial visual bridge, but it cannot serve as efficacy proof. When a human says a slot feels the same as another, change the buyer question and persuasion role before changing the styling.

## Standard nine-slot contract

The pack always has exactly nine numbered slots. Platform adapters may change ratio, canvas, language and copy density, but must not change slot numbers or silently add/remove slots.

Reference is required for every formal slot; the real SKU image is attached to every `gpt-image-2` request. The visual task, not a fixed production template, determines how visibly the product appears. Do not prescribe the same composition, product share, lighting, or prop system across all slots: that creates repetitive and generic packs.

| Slot | Mission | Default execution | Prompt boundary |
| --- | --- | --- | --- |
| 1 | Product identity / hero: make the exact SKU immediately recognizable | `gpt-image-2` reference-aware generate/edit | Product is first visual priority; preserve SKU facts |
| 2 | Primary use case: show the product in its normal customer context | `gpt-image-2` reference-aware generate/edit | State the buyer situation and approved use boundary |
| 3 | Core benefit: prove one approved benefit with visible evidence | `gpt-image-2` reference-aware generate/edit | Show only evidence consistent with approved claim |
| 4 | Key specification: show only verified size, capacity, material or structure | `gpt-image-2` reference-aware generate/edit | Generated text/visuals must not change the verified fact |
| 5 | How to use: show the simplest safe usage sequence | `gpt-image-2` reference-aware generate/edit | Do not invent anatomy, dosage, unsafe use, or unsupported outcome |
| 6 | Product details: close-up of controls, texture, interface or construction | `gpt-image-2` reference-aware generate/edit | Preserve product structure and visible details |
| 7 | Package contents / variants: show only verified contents and variants | `gpt-image-2` reference-aware generate/edit | Do not invent or omit a buyer-relevant quantity or variant |
| 8 | Audience / scenario: connect the SKU to one approved buyer situation | `gpt-image-2` reference-aware generate/edit | Keep product facts stable; let scene treatment vary |
| 9 | Trust / decision support: care, compatibility, boundary, or approved CTA | `gpt-image-2` reference-aware generate/edit | Never invent rating, certificate, endorsement, promotion, or claim |

For every slot, begin with a concise Prompt that locks only platform/ratio, buyer scenario, slot mission, the real SKU reference and product-fact invariants. Leave composition, camera, lighting, props, material treatment and minor text layout open unless an approved direction, platform hard rule, or a prior reproducible failure requires a specific constraint.

A visible product is always identity-sensitive. A product-free scene may support a buyer situation, but it cannot prove SKU identity, specification, contents, compatibility, performance or a Claim.

## State machine

1. `context_pending`: missing or conflicting facts, permissions, reference or writeback target. Stop and name the exact gap.
2. `context_ready`: SKU, platform, market, audience, claims, reference image, task/run and writeback are known.
3. `directions_proposed`: present 2-3 materially different visual systems and recommend one. No provider call.
4. `direction_approved`: named human selected a direction and authorized the sample scope.
5. `sample_generated`: call `ecom_router_image_generate` exactly for the smallest useful sample, normally one image, with the real reference image.
6. `sample_reviewed`: review identity, claims, slot mission, platform fit and technical quality.
7. `sample_approved`: named human approves the sample and expansion scope.
8. `nine_pack_generated`: generate exactly slots 1-9 using the approved visual system, one mission per slot, and the differentiation matrix. An approval to continue authorizes only the next scoped slot; retain evidence and review gates for all remaining slots.
9. `nine_pack_reviewed`: review every slot; any identity drift, unsupported claim, wrong variant or missing reference blocks pack approval.
10. `pack_approved`: Admin or the explicitly designated final approver approves the complete nine-image scope.
11. `written_back`: write version, run, assets, review, approval and next action to Feishu. `published` requires platform evidence and is a separate state.

## Generation rules

- Use `global-ai-router` and `ecom_router_image_generate` only after direction approval and real-call authorization. Every formal slot uses a `gpt-image-2` reference-aware generate/edit call; programmatic source-asset composition, collage and overlay paths are not formal image delivery.
- For every call, pass the real SKU image through the Router's exact `referenceImage` input with its source-file `sha256`; prefer a stable short HTTPS URL over model-authored inline Base64. The Router must fetch/decode the reference and return matching hash, byte size, dimensions and MIME evidence before a provider result can be accepted. A schema field alone is not evidence of reference use.
- Every real request includes `task_id`, `run_id`, `skill_name`, `skill_version`, `sku`, `slot`, platform, market, approved direction and reference image source.
- Generate one minimum sample first. **Never generate the full nine-image pack before sample approval.** A pack may expand only after the sample passes SKU/product-fact review, visual-quality review, and human approval. Do not use one slot's sample to approve a materially different buyer situation without explicit approval.
- Preserve product type, silhouette, proportions, packaging, controls, logo area and buyer-relevant SKU details whenever the product is visible. Text-only generation is not identity-safe. A route that silently drops `referenceImage` is text-only generation and must return `blocked`, not a SKU-safe sample.
- Let the image model render packaging, short copy, specifications and other necessary visual information in the coherent whole image. Never ask it to invent unapproved specification, function, material, certification, rating, review, price, promotion, inventory, logistics, warranty or Claim. Do not repair its text with programmatic overlays.
- Review text by commercial risk. Wrong brand, SKU, package/specification, count, quantity relationship, price, Claim, certification or promotion is `fail`. Minor typography, spacing, line-break or non-factual copy imperfections may be `warn` and require the named human to accept or request iteration for the intended slot.
- A provider result is `generated`, not `reviewed`, `approved`, `delivered` or `published`.
- Never ask an LLM or delegated Agent to copy a large Base64 string into a tool call. A deterministic caller must read the file and construct the argument. Any missing/mismatched hash, unreadable image, image below 64×64, or image below 1 KB must stop before the paid provider call.

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
- slot reference policy, whether the product is visible, and the actual product share;
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

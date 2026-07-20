---
name: ecom-image-director
description: Use when planning, generating, editing, reviewing, or expanding ecommerce product images and listing packs. Enforces Feishu product truth, SKU-reference identity, platform/slot strategy, direction and sample approval gates, team MCP Router execution, structured review, and evidence-based writeback.
version: 1.0.0
metadata:
  hermes:
    tags: [ecommerce, image-generation, listing, sku, review]
    related_skills: [global-ai-router]
---

# Ecommerce Image Director

Produce images that help shoppers identify, trust, and understand the real product. A visually attractive image that changes the SKU, invents a claim, or misses its slot mission is a failure.

## When To Use

Use for:

- product image refresh or background/scene edits;
- new product image generation;
- marketplace hero, carousel, detail, campaign, or listing packs;
- image review, comparison, revision, and expansion.

Do not use for product research, listing copy alone, video work, or deterministic layout work that never changes a product image.

## Canonical Inputs

Before planning, read the ecommerce Feishu shared protocol and resolve the product from `马来电商-商品策略 / 商品主数据` by SKU or stable product identity. Then read the relevant store, platform, listing, audience, approved strategy, and task record.

Treat Feishu as canonical for confirmed identity, specification, price, inventory, lifecycle, claims, compliance, and approval status. Local files and prompts may hold execution memory or hypotheses, but may not override shared facts.

Collect the minimum input contract:

- SKU/product identity;
- task mode: `refresh`, `generate`, `listing_pack`, or `review`;
- market, platform, image slot, audience, and task goal;
- verified claims and forbidden claims;
- real SKU/reference image and its source;
- budget/quality boundary;
- intended asset and Feishu writeback locations;
- approver.

If a critical fact conflicts or is missing, return `blocked` with the exact resource and owner needed. Do not guess.

## Workflow

Load [references/workflow.md](references/workflow.md) and follow its state machine.

Always preserve these gates:

1. `context_ready`: product truth, task, slot, reference, and writeback are known.
2. `direction_approved`: present 2-3 directions and recommend one before generation.
3. `sample_reviewed`: generate the smallest useful sample and review it before expansion.
4. `pack_approved`: a full pack may be called approved only after human confirmation.
5. `written_back`: final state, asset links, version, review, and next action are recorded.

Never jump from a vague request to a full pack. A generation call is a paid/external side effect; require approval for the direction and real call.

## Identity And Reference Rules

A real SKU/product/package image is a hard anchor whenever identity matters.

- Keep the exact product type, shape, silhouette, structure, proportions, controls, packaging, brand area, and key details unchanged.
- Change only the approved background, props, proof object, lighting, camera treatment, or information layer.
- If no usable SKU image exists, stop or mark the output `concept_only`; do not call it a final SKU-safe image.
- If the chosen Router route cannot accept the reference image, stop and report the limitation. Text-only generation is not an identity-safe fallback.
- Deterministic compositing that preserves the original product pixels is preferred when it can satisfy the task.

## Direction And Slot Planning

Every image has one primary job. State the slot mission before writing a prompt, for example:

- identify the product;
- prove a result or use case;
- explain size/specification;
- show package contents;
- establish trust;
- communicate an approved campaign.

Use a dated platform/category visual benchmark for claims about current style. Record platform, category, observation date, sample size, mechanisms observed, and confidence. Competitor images are visual evidence, never a source for product facts, claims, badges, or copied layouts.

Present 2-3 directions with:

- direction name and slot mission;
- shopper problem addressed;
- must-show proof;
- composition and information density;
- reference-image use;
- risks and avoid list;
- estimated execution scope;
- one explicit recommendation.

## Prompt Contract

Load [references/prompt-contract.md](references/prompt-contract.md). Structure prompts as:

`output intent -> identity invariant -> benchmark mechanisms -> proof -> market scene -> slot composition -> lighting/material -> allowed changes -> hard constraints -> avoid`

Keep style words concrete and sparse. Prefer short text placeholders or a separate deterministic overlay pass; do not rely on image models for long copy, specification tables, ratings, badges, or compliance statements.

## Router Execution

Load `global-ai-router` and use `ecom_router_image_generate`. Provider keys and MCP tokens remain server-side.

The request must include the approved prompt, provider/model only when intentionally pinned, ratio/size, count, quality boundary, and the real `referenceImage`. Generate one recommended sample by default; use more only when the approved experiment requires it.

Record provider, model, status, request/run identifier when available, asset or URL, reference used, and cost/usage when available. A Router result is `generated`, not `approved` or `published`.

## Review

Load [references/review-rubric.md](references/review-rubric.md) and return a structured review that covers:

- SKU identity;
- factual and claim safety;
- slot mission and proof;
- composition/readability;
- market/platform fit;
- technical quality;
- decision: `pass`, `warn`, or `fail`;
- failure codes and required fixes.

Any critical identity drift, invented claim, missing reference, or wrong product type is a hard fail. Automated vision review assists but never replaces the named human approval gate.

## Expansion And Writeback

Expand only after the sample is explicitly approved. Keep the product identity and visual system stable while assigning one mission per slot.

Write back according to [references/writeback.md](references/writeback.md). At minimum record:

- SKU, task/run, skill version, platform/market/slot;
- approved direction and reference source;
- provider/model and generation status;
- sample/full-pack asset links;
- review decision, failure codes, and approver;
- state: `planned`, `generated_unreviewed`, `reviewed`, `approved`, `delivered`, or `published`;
- next action and owner.

Do not promote a one-off success into this shared skill. Stage it as a candidate, validate it on multiple independent cases plus a holdout, then merge through Git review and publish through the Feishu Skill registry.

## Output Contract

Return the fields defined in [references/output-schema.json](references/output-schema.json). Human-readable responses should lead with:

1. known facts and gaps;
2. current gate/status;
3. recommended direction or review decision;
4. next action, approver, and writeback location.

## Common Pitfalls

- Treating the old local product YAML as canonical business truth.
- Calling the Router before direction approval.
- Generating a full pack before reviewing a sample.
- Calling text-only generation SKU-safe.
- Copying competitor claims or layouts from a benchmark.
- Reviewing only aesthetics while missing identity drift or fake claims.
- Calling an exported asset published without platform evidence.
- Editing the shared skill directly on `main` without tests, PR review, and publication status.

## Verification Checklist

- [ ] Live Feishu product truth and task context were resolved.
- [ ] A readable real SKU reference is attached for identity-sensitive work.
- [ ] Platform, market, audience, slot mission, claims, and writeback are explicit.
- [ ] 2-3 directions were presented and one approved.
- [ ] Only the approved sample scope was generated.
- [ ] Review rubric completed; all hard failures blocked expansion.
- [ ] Human approval recorded before full-pack approval.
- [ ] Final assets, version, state, evidence, and next action were written back.

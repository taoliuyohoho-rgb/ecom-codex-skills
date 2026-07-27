# Team Usage: Feishu + Task Skill + Router

The operating order is fixed:

```text
live Feishu facts
  -> one task-specific Skill
  -> human approval gate
  -> team Router execution when needed
  -> review
  -> isolated run writeback
```

## One-time setup for nine images

```bash
git clone https://github.com/taoliuyohoho-rgb/ecom-codex-skills.git
cd ecom-codex-skills
npm ci
npm test
node install.mjs --client codex --bundle nine-images
```

For Hermes:

```bash
HERMES_HOME="$HERMES_HOME" node install.mjs --client hermes --bundle nine-images
```

For another Agent, replace the target with its documented Skill directory:

```bash
node install.mjs --client generic --target /absolute/path/to/skills --bundle nine-images
```

Connect `https://ai-router.metooloo.com/mcp` and use the operator's own ecommerce Feishu OAuth identity. Restart/reload the Agent after Skill installation.

## Prompt to give any Agent

```text
Read this ecommerce team protocol and use the published ecom-nine-images workflow for SKU <SKU> on <platform>/<market>.

First read the live Feishu product master and return: exact SKU/variant, confirmed product facts, approved and forbidden claims, real reference-image status, data/permission gaps, task/run identity, and writeback target. Stop if the SKU is ambiguous or the real reference image is unavailable.

Then propose 2-3 nine-image directions and recommend one. Do not call an image provider yet.

After I approve the direction and real call, generate exactly one sample through ecom_router_image_generate with the real SKU image in referenceImage. Review the sample for identity, claims, slot mission, platform fit and technical quality, then stop for sample approval.

Only after sample approval, expand the same run to exactly slots 1-9, review every slot, store assets under the run namespace, and write version/status/assets/review/approval/next action back to Feishu. Generated is not approved or published.
```

## Standard nine slots

1. product identity/hero;
2. primary use case;
3. approved core benefit/proof;
4. verified specification;
5. how to use;
6. product detail/structure;
7. package contents/variants;
8. audience/scenario;
9. trust/decision support/approved CTA.

Platform adapters may change ratio, language and copy density but not the `1..9` numbering.

## Separate task Skills

- Nine images: `ecom-nine-images`
- Product title: `ecom-product-title`
- Detail page: `ecom-product-detail-page`
- Product video: `ecom-product-video`
- Product deep research: `ecom-product-deepresearch`

Do not use `ecom-content-studio` as a team default. It is a personal/local workbench. Do not load multiple task directors for one task.

## Personal changes and upstream updates

Operators may modify their installed copy. The installer will not overwrite local changes. Pull upstream and review/merge changes manually. Personal work becomes a team default only through tests, PR review and Feishu publication.

## State language

Keep these distinct:

```text
planned
created/generated
reviewed
approved
delivered
published
```

A failure must name the exact SKU, Base/table, identity/scope, missing reference, approval or Router capability that blocked execution. Never request provider keys.

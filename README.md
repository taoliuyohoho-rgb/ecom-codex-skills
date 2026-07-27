# Ecommerce Team Skills

Public, sanitized, task-scoped skills for the ecommerce team. Product facts remain in Feishu; provider keys remain on the team Router server; personal prompts and experiments remain in each operator's workspace.

## Skill layout

Shared foundations:

- `global-ai-router`: team text/image/video model execution.
- `ecom-business-context`: live Feishu product truth and gap handling.
- `ecom-run-contract`: task/run identity, operator isolation and writeback.
- `ecom-review-approval`: review and immutable approval scopes.

Operator-facing task skills:

- `ecom-nine-images`: product truth -> direction -> one sample -> review -> exactly slots 1-9.
- `ecom-product-title`: product title only.
- `ecom-product-detail-page`: detail-page structure and copy only.
- `ecom-product-video`: ecommerce video only; uses `video-director-core` as process support.
- `ecom-product-deepresearch`: evidence-backed product research only.
- `shopee-my-detail-tags`: Shopee Malaysia SEO/tag specialist.
- `malay-ad-copy-skill`: Malaysia ad short-copy specialist.

`ecom-image-director` is a compatibility stub for old links and is not installed by default. `ecom-content-studio` is not part of this package; it remains a personal/local workbench.

## Install by task

Clone once:

```bash
git clone https://github.com/taoliuyohoho-rgb/ecom-codex-skills.git
cd ecom-codex-skills
npm ci
npm test
```

Codex, nine-image work only:

```bash
node install.mjs --client codex --bundle nine-images
```

Hermes, active profile only:

```bash
HERMES_HOME="$HERMES_HOME" node install.mjs --client hermes --bundle nine-images
```

Other Agent clients:

```bash
node install.mjs --client generic --target /absolute/path/to/that-agent/skills --bundle nine-images
```

Available bundles: `nine-images`, `title`, `detail-page`, `video`, `deepresearch`, and `all`.

The installer never overwrites an unknown or locally modified same-name skill. Identical reinstall is idempotent. A managed, unmodified prior version can upgrade. Every install writes `.ecom-codex-skills.json` with package version and hashes.

## Nine-image operating path

After one-time Skill and MCP/Feishu setup, give the Agent the team Feishu protocol URL and a SKU. The Agent must:

1. read the live product master;
2. return confirmed facts, gaps, reference-image status and writeback target;
3. propose 2-3 directions and recommend one;
4. wait for direction and real-call approval;
5. generate one sample with the real SKU image in `referenceImage`;
6. review identity, claims and slot mission;
7. wait for sample approval;
8. expand to exactly numbered slots 1-9;
9. review and write the isolated run back.

## Team Router

- MCP: `https://ai-router.metooloo.com/mcp`
- Health: `https://ai-router.metooloo.com/health`
- Authentication: Feishu OAuth with each operator's own ecommerce identity.

Provider keys are server-side. Operators must never copy another user's bearer token or request provider keys.

## Personal customization and updates

Operators may edit their installed copy. The installer records hashes and refuses to overwrite local changes during a later update. Review upstream changes with Git, then manually merge or keep the personal version. See [Personal Customization](docs/PERSONAL_CUSTOMIZATION.md).

Run `npm test` before proposing a personal improvement back to the team. Team defaults change only through PR review and Feishu Skill registry publication.

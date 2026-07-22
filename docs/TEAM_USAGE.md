# Team Usage: Feishu Knowledge + Skills + MCP

This repository provides shared methods. It does not contain canonical product facts, private business data, generated media, or provider keys.

The ecommerce Feishu protocol is the business source of truth:

- Shared protocol: https://jcn2l8712e1q.feishu.cn/docx/CXacdDGoPoNpAjxdreIcvn1Wnzc
- Product master: `马来电商-商品策略 / 商品主数据`
- Published methods: `马来电商-SOP与知识库 / 共享 Skill 注册表`
- Team MCP: `https://ai-router.metooloo.com/mcp`

## Mental Model

- Feishu knowledge answers: what has the team confirmed?
- A published Skill answers: how should this task be performed?
- The MCP Router answers: which server-side AI capability executes the approved step?
- Feishu writeback answers: what happened, what is approved, and what happens next?

Use them in this order:

```text
Feishu protocol and facts
  -> published Skill and version
  -> human approval gate
  -> MCP Router execution
  -> review
  -> Feishu task/asset/state writeback
  -> personal candidate or shared-method candidate
```

## First-Time Setup

```bash
git clone https://github.com/taoliuyohoho-rgb/ecom-codex-skills.git
cd ecom-codex-skills
npm install
npm test
npm run install-skills
```

Restart Codex or reopen its workspace. Configure the MCP endpoint and complete OAuth with your own ecommerce Feishu identity. Never request or copy provider keys, App Secrets, bearer tokens, or another teammate's OAuth token.

Confirm the client can discover:

- `global-ai-router` and the task-specific Skill;
- `ecom_router_text_generate`;
- `ecom_router_image_generate`;
- `ecom_router_video_start`;
- `ecom_router_video_poll`.

## Every Task

1. Read the Feishu shared protocol and published Skill registry.
2. Resolve the SKU/product from the live product master.
3. Read only the relevant store, account, persona, Listing, task, assets, approved strategy, and recent review.
4. Select a published Skill and state its version, missing inputs, gates, expected output, writeback, and approver.
5. Stop as `blocked` when facts, permission, reference assets, or writeback targets are missing or conflicting.
6. Get human approval for the next real/paid external action.
7. Let the Skill construct the request and use the team Router. Record actual provider/model/status and result handles.
8. Review the output and write state, assets, evidence, owner, and next action back to Feishu.

Generated is not reviewed. Reviewed is not approved. Approved is not delivered. Delivered is not published.

## Knowledge Ownership

| Layer | Examples | Canonical location | Governance |
| --- | --- | --- | --- |
| Team facts | SKU, spec, cost, inventory, price, lifecycle, compliance, approved claims | Feishu product master and approved strategy | Admin/fact owner confirms; everyone reads |
| Team methods | published Skills, SOPs, prompt baselines, review rules | protected Git `main` + Feishu Skill registry | anyone may propose; Admin reviews/publishes |
| Owner business knowledge | store/account positioning, persona, Listing versions, tasks, recent reviews | Feishu store/account/task records and owner Docs | owner maintains; Admin can inspect/take over |
| Personal experiment memory | prompt variants, branches, runs, failures, unverified hypotheses | personal branch/fork, local run, personal experiment Doc | individual owns; never automatic team default |

A personal note must reference the shared SKU/record rather than duplicate confirmed product truth. Record owner, scope, version, status, evidence, updated time, and next validation.

## Admin Responsibilities

- maintain the single source of product truth and resolve conflicts;
- protect `main`, review PR evidence, and maintain rollback versions;
- publish/pause Skill versions in the Feishu registry;
- operate Router health, OAuth, providers, fallback, timeout, rate limit, cost, and log redaction;
- review method candidates weekly and prune stale/duplicate knowledge monthly;
- ensure owner-maintained business knowledge remains transferable.

A Git merge and a Feishu `已发布` status are separate actions.

## Individual Responsibilities

- use shared facts and the current published Skill for production work;
- keep personal prompts, runs, failures, and hypotheses in a branch/fork or personal experiment record;
- write final task state and transferable links back to team Feishu;
- run `npm test` and submit a PR for shared method changes;
- label knowledge as personal experiment, product/account candidate, or team candidate;
- hand over Base records, Docs, PRs, assets, recent reviews, open work, and risks.

## Promotion Path

```text
personal run/branch
  -> product or account candidate
  -> second independent case
  -> holdout regression
  -> PR + CI + review
  -> Admin approval
  -> Feishu Skill registry: published
```

Do not promote a method unless independent cases improve, no new identity/claim/compliance/platform hard failure appears, a holdout does not materially regress, behavior and failure boundaries are documented, and a rollback version exists.

## Start Prompt

```text
Use the ecommerce Feishu identity. Read the shared protocol, the published Skill registry, and the live product master by SKU. Then read only the relevant store/account/persona/Listing/task/assets and recent review.

Before execution, return known facts, gaps, Skill/version, MCP need, current gate, expected output, writeback target, and approver. Stop as blocked if facts or permissions are missing.

After approval, use the team MCP Router without asking for provider keys. Return actual provider/model/status, assets, review/approval/delivery/publication state, evidence, next action, and owner, then write back to Feishu.
```

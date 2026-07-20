# Team Collaboration Smoke Test

Passing this test means a teammate can use and improve the shared ecommerce workflow. Repository access alone is not enough.

Read [TEAM_USAGE.md](TEAM_USAGE.md) first. It defines the required Feishu knowledge -> published Skill -> approval -> MCP -> review -> writeback sequence, plus Admin/global and individual knowledge boundaries.

## Preconditions

- The teammate has a GitHub account.
- The teammate can open the ecommerce Feishu onboarding document and product master Base with their own identity.
- Codex or another MCP-capable client is installed.
- Node.js 22 and Git are available.

Do not share provider API keys, Feishu App Secrets, bearer tokens, or another teammate's OAuth token.

## 1. Feishu business context

Using the ecommerce Feishu application and the teammate's own user identity:

1. Open the shared ecommerce protocol.
2. Read `马来电商-商品策略 / 商品主数据`.
3. Resolve one known SKU and report the product identity plus at least one confirmed field.
4. State where an image task and its final asset would be written back.

Pass: the values came from the live Base, not a local YAML file or copied screenshot.

Fail: wrong app/profile, missing Base permission, missing scope, or facts inferred from local files.

## 2. Shared skill installation

```bash
git clone https://github.com/taoliuyohoho-rgb/ecom-codex-skills.git
cd ecom-codex-skills
npm install
npm test
npm run install-skills
```

Restart Codex or reopen its workspace, then confirm that `ecom-image-director` and `global-ai-router` are discoverable.

Pass: `npm test` succeeds and both skills are discoverable after restart.

## 3. Team Router authentication

Configure the MCP client with:

```text
https://ai-router.metooloo.com/mcp
```

Start the MCP OAuth flow and sign in with the teammate's own Feishu identity. Do not paste a bearer token manually.

Pass: the client can list `ecom_router_text_generate`, `ecom_router_image_generate`, `ecom_router_video_start`, and `ecom_router_video_poll`.

Security check: an unauthenticated request must receive HTTP 401 with OAuth resource metadata.

## 4. Contribution path

### With repository write access

```bash
git switch main
git pull --ff-only
git switch -c docs/<name>-onboarding-proof
# make one harmless documentation correction
npm test
git push -u origin HEAD
```

Open a pull request. Direct pushes to `main` are not the workflow.

### Without repository write access

Fork the repository on GitHub, clone the fork, create the branch there, and open a pull request into `taoliuyohoho-rgb/ecom-codex-skills:main`.

Pass: CI `validate` succeeds, another team member approves, and all review conversations are resolved before merge.

## 5. Dry-run image handoff

Ask Codex to prepare, but not generate, one image sample for the SKU resolved in step 1. The response must include:

- SKU/product identity;
- platform, market, slot, and audience;
- verified claims and forbidden claims;
- real reference-image plan;
- 2-3 visual directions and one recommendation;
- planned Router tool;
- approval gate;
- output and Feishu writeback location.

Pass: no provider call occurs before direction approval, and a text-only route is not described as SKU-safe.

## Evidence to return

Send the project owner:

```text
Name:
GitHub username:
Feishu identity/app used:
Product master read: pass/fail + resource/error
Skills installed: pass/fail
Router OAuth/tool list: pass/fail
PR URL: URL or blocked reason
Dry-run image handoff: pass/fail + short result
```

The collaboration setup is accepted only when all five sections pass. A failure should name the exact identity, resource, scope, command, or client step that blocked it.

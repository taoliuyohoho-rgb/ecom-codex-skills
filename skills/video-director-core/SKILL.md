---
name: video-director-core
description: "Cross-project video workflow core for scripting, planning, review, and reusable production logic. Use when Codex needs shared rules for stage order, localization versus hybrid versus AI-full routing, script confirmation, shot planning, review rubrics, render validation, or promotion of stable video learnings."
---

# Video Director Core

Use this skill as the shared process layer for video work.

This skill owns:

1. workflow stages
2. mode playbooks
3. script and shot gates
4. review rules
5. short-form quality bars that are stable across repos
6. promotion policy for cross-repo learnings
7. cross-project default guardrails for generation approval and spend control

This skill does not own:

- product facts
- account positioning
- campaign context
- local publish paths
- repo-specific delivery constraints
- reference-library implementation
- provider API/runtime integration
- publishing browser automation
- global learning inbox and review memory

If a local repo already defines niche, audience ladder, account promise, or product truth, keep that local truth fully in charge. This skill should only add shared short-form process and quality rules on top.

## Read Order

Load only what the current stage needs.

1. `references/stage-rules.md`
2. `references/mode-routing.md`
3. stage-specific refs as needed:
   - `references/short-form-quality-bar.md`
   - `references/script-gate.md`
   - `references/tiktok-script-delivery.md`
   - `references/shot-planning.md`
   - `references/review-rubric.md`
4. if the task needs reference-video analysis, atomic shots, or shot-library selection, load the optional `video-reference-lab` companion if it is installed; otherwise stop at the included planning and review rules.
5. if the task asks to apply or record global hook/script/platform/ecommerce learnings, load the optional `video-growth-memory` companion if it is installed.
6. if the task is about shared memory or workflow promotion:
   - `references/promotion-policy.md`
   - `memory/promoted-learnings.yaml`

The optional promotion utilities under `scripts/` are for Admin maintenance. Install their Python dependency from `requirements.txt` only when using those utilities; normal video planning does not require Python setup.

## Runtime Contract

Treat repo-local context as truth, and this skill as process.

Formula:

`local truth + current task + global video process = output`

Do not let this skill overwrite repo-local facts.

## Global Hard Defaults

## Feedback Execution Contract

Local repo memory and current user corrections are part of `local truth`. Before applying shared video rules, the local adapter must recall its active account/product/run constraints and convert them into execution constraints.

If a failure pattern is stable across repos, promote it into this skill or a referenced core rule. If it is repo-specific, update the local adapter or local memory instead. Do not only write a memory note when the repeated behavior depends on a skill rule changing.

During review, check whether the script, shot plan, or execution plan actually applies active feedback. Reject outputs that merely mention remembered constraints while violating them.


Unless a repo has a stricter explicit rule, apply these defaults to all video work:

1. make only `1` candidate version per generation round
2. include both `bgm` and an explicit voice/sound plan in the script or execution plan
3. before any generation step, get user confirmation on the script only; do not keep reopening fine-detail questions unless the user asks
4. before any paid generation, remix, dubbing, music, or other spendful provider action, get explicit user approval
5. default to segmented AI-original production instead of one long provider generation: spend the strongest model on first-screen hook, people, hands, emotion, complex motion, or native-audio moments; use cheaper generation or local editing for simple product/context/transition/CTA beats; assemble the final film locally unless the user explicitly asks for a full-model single-pass video

### Mandatory Confirmation Gates

Treat broad continuation requests such as `继续做下一个视频`, `继续做视频`, `下一条`, or `做下一个` as permission to choose the next candidate and draft the next script/prompt package only. They are not permission to render, generate, spend credits, upload references, or call an external provider.

After drafting or revising a fresh script/prompt, stop at `script confirmation`.

Before explicit user confirmation, do not:

- proceed to shot planning as if the script is locked
- write provider-ready generation prompts for a live run
- write or run provider execution scripts
- upload local references, images, prompts, videos, audio, account data, product assets, or run artifacts to any external service
- call paid or external generation APIs

Acceptable confirmation must explicitly lock the script/prompt or specific changes, for example `确认，用这个脚本`, `脚本OK，继续生成`, or `hook 用 A，CTA 改 B，然后继续`.

Before any Seedance, Sora, Veo, JiMeng, dubbing, music, remix, or other external / paid provider step, stop again unless the same user message already explicitly approved that provider step. The approval request must name the provider or script, state that prompts/assets may be sent outside the local workspace, and identify the concrete run folder or artifact.

## Default Workflow

The default video production order is:

`task framing -> angle -> script -> script confirmation -> shots -> execution plan -> review -> local writeback`

If a repo has more detailed truth-loading rules, apply them before this workflow.

## Mode Intent

- `localization`: keep the original proof/body logic stable; adapt language, subtitle, CTA, and edit plan without silently reopening the whole concept
- `hybrid`: use real proof or source footage where possible, then fill only the missing beats with generated material
- `ai_full`: use only when the repo or user explicitly accepts the higher cost and weaker proof chain

## Promotion Rule

Only promote stable learnings into shared memory when they are clearly reusable beyond one repo or one run.

Promote:

- process rules
- gating rules
- repeatable review heuristics
- recurring failure patterns

Do not promote:

- one-off hooks
- product claims
- account persona specifics
- campaign tactics
- provider quirks without stable evidence

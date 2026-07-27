---
name: ecom-run-contract
description: "Use for every team ecommerce execution to create an isolated task/run identity, bind operator/Agent/Skill versions and approvals, prevent cross-operator overwrites, and write append-only status and asset evidence back to Feishu."
version: 1.0.0
---

# Ecommerce Run Contract

Every operator attempt is an independent run. Shared facts may be read by everyone; samples, approvals, prompts, assets and execution state belong to one exact run until deliberately promoted.

## Required identity

Before execution, resolve or create:

```text
task_id
run_id
operator_id
agent_client
skill_name
skill_version
sku
platform
market
input_revision
created_at
```

Use a new `run_id` for a fresh attempt. A continuation may reuse a run only when the user names it and the next gate is unambiguous.

## Isolation

- Never overwrite another operator's run, sample, approval or asset.
- Store assets under `<SKU>/<skill>/<platform>/<market>/<run_id>/...`.
- Bind every approval to `run_id`, stage, immutable asset/version, scope, approver and timestamp.
- A newer run does not invalidate or silently replace an older run. Promotion to the task's selected result is an explicit action.
- Prefer append-only run events. Update the task's summary pointer only after the designated owner selects the run.

## States

Use only the states defined by the task Skill. Across Skills, preserve the distinction:

`planned -> generated -> reviewed -> approved -> delivered -> published`

Never infer a later state. Failure or blocking records the reason, next action and owner.

## Writeback

Write structured task state to `运营工作台 / 统一任务` or the assigned task record. Write execution evidence to `SOP与知识库 / Agent运行日志` or the designated run table. Put large files in approved shared storage and write stable links to Feishu.

Return `task_id`, `run_id`, current state, latest event, asset/version references, approvals, next action and owner.

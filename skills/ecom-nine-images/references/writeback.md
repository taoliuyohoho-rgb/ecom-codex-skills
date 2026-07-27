# Feishu Writeback

Writeback closes the team loop. It does not turn generated output into approved or published output.

## Canonical Locations

- Product identity, specification, price, inventory, lifecycle, compliance, and approved claims: `马来电商-商品策略 / 商品主数据` and approved strategy records. Image work reads these and must not modify them.
- Operational task, owner, stage, approval, output link, and next action: `马来电商-运营工作台` or the linked image/Listing task.
- Listing image version and platform state: `马来电商-店铺运营 / Listing` or its optimization/task record.
- Shared method candidates and published skill version: `马来电商-SOP与知识库 / 共享 Skill 注册表` and the Git repository.
- Large images and source assets: approved Drive/shared-storage location; Feishu stores links and state.

## Role Boundaries

### Operator

May update assigned operational workflow states, asset links, issues, and review feedback. `published` may be written only after reading a real platform URL or equivalent platform evidence. May propose a method change through a Git branch/PR or a Feishu candidate.

May not modify product master truth, approve changes to product truth/compliance/strategy, approve a complete image pack, or publish the shared Skill by themselves.

### Admin

May confirm product/strategy boundaries, approve final packs, review/merge skill changes, and change the Feishu Skill registry publication state.

A Git merge and a Feishu `已发布` state are distinct actions. New code remains non-default until validation and publication are recorded.

## Required Writeback Fields

```text
SKU / product identity
Task/run identifier
Skill name and version
Platform / market / slot
Approved direction
Reference asset source
Provider / model / Router status
Sample and final asset links
Review decision and failure codes
Approval ledger: stage, state, approver identity, approver role, approved scope, real-call authorization, and timestamp
Delivery/publish state and required evidence
Next action and owner
Evidence or benchmark links
```

## State Semantics

- `concept_only`: no usable identity-safe final path exists; the artifact is for direction discussion only and cannot enter sample/full-pack approval, delivery, or publication.
- `planned`: context/direction exists; no generated asset.
- `generated_unreviewed`: provider returned an asset; no completed review.
- `reviewed`: rubric completed; may still be warn/fail.
- `approved`: named human approved the stated scope.
- `delivered`: approved asset exists in the agreed delivery location.
- `published`: external platform evidence/link exists.

Never infer a later state from an earlier one.

## Learning Promotion

Record task-specific feedback with the task/run first. Promote a shared method only when:

1. multiple independent cases improve;
2. no new identity, claim, or platform hard failure appears;
3. at least one holdout does not regress;
4. applicability, inputs, steps, outputs, and failure boundary are documented;
5. CI and PR review pass;
6. an Admin publishes the version in the Feishu Skill registry.

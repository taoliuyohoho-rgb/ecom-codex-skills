# Image Workflow

Use this state machine for every image task. A state advances only when its completion evidence exists.

## Modes

| Mode | Use when | Default stages |
| --- | --- | --- |
| `refresh` | A valid product image exists and the task changes scene, background, proof, campaign, or information layer | context -> directions -> sample edit -> review -> delivery |
| `generate` | No usable composition exists but a real SKU anchor is available | context -> directions -> sample generation -> review -> delivery |
| `listing_pack` | Several marketplace slots must work as one coherent set | context -> pack strategy -> sample board -> review -> full expansion -> review -> delivery |
| `review` | Existing images need identity, claims, slot, or platform QA | context -> review -> decision -> writeback |

Prefer `refresh` or deterministic compositing over `generate` when it can preserve product identity and satisfy the task.

## State Machine

### 1. `context_ready`

Required evidence:

- live Feishu SKU/product record;
- platform, market, audience, task and slot;
- verified and forbidden claims;
- real reference image or an explicit `concept_only` limitation;
- asset and Feishu writeback locations;
- named approver.

Failure: return `blocked`; list the missing resource, field, or owner.

### 2. `directions_proposed`

Produce 2-3 materially different directions. Each direction states one slot mission, proof, composition, information density, reference plan, risk, and avoid list. Recommend one.

No provider call is allowed in this state.

### 3. `direction_approved`

Evidence: named human, timestamp when available, selected direction, and allowed scope. For a listing pack, the approval covers the slot strategy and sample slots, not the full pack.

### 4. `sample_generated`

Call `ecom_router_image_generate` for the smallest useful sample. Default to one recommended output. Preserve the real SKU reference in the request. Record the actual provider/model/status and asset handle.

Generation failure does not reopen product facts or direction silently. Classify the provider failure and either retry within the approved scope or return `blocked`.

### 5. `sample_reviewed`

Review every sample using `review-rubric.md`.

- `fail`: block expansion; revise prompt/reference/route and generate a new sample only after explaining the fix.
- `warn`: require a named human decision; do not auto-expand.
- `pass`: still requires human sample approval before expansion.

### 6. `sample_approved`

Evidence: named approver, selected sample/direction, fixes accepted, and explicit permission to expand.

### 7. `full_pack_generated`

Applies to `listing_pack` or approved multi-image work. Assign one mission to each slot and preserve the approved identity, visual system, and claims. Do not duplicate the same image with cosmetic changes and call it a pack.

### 8. `full_pack_reviewed`

Review identity and claims on every image. Review slot coverage across the pack. Any critical fail blocks approval of the entire pack until fixed or explicitly removed.

### 9. `pack_approved`

Evidence: the named human approver accepted the complete reviewed pack, its included/excluded assets, and its delivery scope. A passing automated review does not create this approval.

### 10. `delivered`

Assets are uploaded to the approved delivery location and linked from the relevant Feishu task/Listing/content record. `delivered` does not mean `published`.

### 11. `written_back`

Record skill version, direction, reference, provider/model, assets, review, approval state, failure codes, owner, and next action. Only platform evidence can advance state to `published`.

## Continuation

Treat a task as continuation only when the user or task explicitly says so. Read one direct carry-forward or prior task link. State what remains locked and what can reopen. A same-product historical run is not automatic truth.

## Provider Failure Policy

- Authentication/permission: stop and identify the exact client/OAuth issue; never request provider keys.
- Reference unsupported: stop; do not fall back to text-only final generation.
- Rate limit/overload: retry within bounded policy or switch provider only if the approved scope allows it; record the switch.
- Invalid output/no image: classify as provider failure, not a reviewed sample.
- Safety refusal: preserve the refusal and revisit claims/brief; do not weaken compliance boundaries silently.

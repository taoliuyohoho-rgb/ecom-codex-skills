# Mode Routing

Use these default routing rules unless the local repo has a stronger explicit rule.

## Localization

Choose `localization` when:

- there is already a usable source video or locked body/proof structure
- the main change is language, subtitle, CTA, pacing, or market adaptation
- the workflow should preserve proof rather than recreate it

Default posture:

- do not silently reopen the core hook/body logic
- keep proof anchored
- adapt copy and edit plan precisely

## Hybrid

Choose `hybrid` when:

- there is some real footage, reference footage, or reusable proof
- the missing value is structural gapfill, better hook, or selected new shots
- a full remake would increase cost without improving proof
- the goal is AI-original enough for platform safety, but the final film can still be assembled from separately generated/source-controlled beats

Default posture:

- real footage first
- localized edits second
- segmented AI-original gapfill third: strongest provider for hook / people / hands / complex motion; cheaper provider or local edit for product display / context / CTA
- full single-pass AI last

## AI Full

Choose `ai_full` only when:

- the user or local repo explicitly accepts the higher cost
- proof can be handled honestly without pretending to have real footage
- there is no better lower-cost route
- a single provider-generated video is required for the creative goal, not merely because it is convenient

Default posture:

- treat this as an explicit upgrade, not the normal default
- state the proof risk and cost posture clearly
- compare against segmented generation + local assembly before recommending a full-length provider generation
- before any paid provider step, stop for explicit user approval

## Cross-Mode Cost Rule

Across `localization`, `hybrid`, and `ai_full`:

- do not silently trigger paid generation, dubbing, music, or remix actions
- name the spendful step before running it
- wait for explicit user approval before spending money

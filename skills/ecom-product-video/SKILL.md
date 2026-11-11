---
name: ecom-product-video
description: "Compatibility source for ecommerce product-video production. Use the canonical Codex ecom-product-video scenario Skill with video-production-core; supports story-led director-brief exploration and production-master handoff while this copy remains a compatibility source."
metadata:
  version: 2.8.0-compat
---

# Ecommerce Product Video Compatibility Source

The canonical operator-facing scenario is `/Users/liutao/.codex/skills/ecom-product-video`. It composes `video-production-core`, uses required `direction`, `script`, and `final_video` gates plus an optional `sample` gate, requires a no-spend dry run before external execution, scans anchors for baked claims, declares exact-copy ownership, and retains the project adapter for live SKU facts and writeback.

The supported execution modes remain `localization`, `hybrid`, and `ai_full`. Stop for explicit script approval, and require explicit approval before any external or paid generation. Generated is not approved or published.

The current story-led execution split is:

- `director_brief_exploration`: lock the single product reference role, `purpose -> hook -> concrete story -> product moment -> CTA`, market context, required product action, native audio/text contract, and confirmed offer facts; let the model choose framing, camera, acting, pacing, transitions, and promotion treatment for one explicitly authorized bounded sample.
- `production_master`: convert accepted story language into reviewed beats, verified text/CTA, continuity requirements, and deterministic final assembly where exact copy or timing matters.

Exploration does not waive script confirmation, paid-call authorization, product/claim review, provenance, or final approval. AI-generated product interaction remains illustrative rather than real proof.

The canonical Skill now requires a complete content contract before prompting:
TikTok Shop purpose/market, first-two-second hook, concrete story, product
moment, public product language, approved Malay/local voice and subtitle lines,
music/SFX intent, and CTA. Internal SKU/model codes remain run metadata only.
Use one clean identity anchor by default; do not invent `Reference B`. If the
script is confirmed and direct production is authorized, the sample branch is
optional and the approved-duration master may be submitted after the no-spend
dry run.

For in-use scenes, the identity anchor locks product structure, control order,
asymmetric details and physical relationships, but does not lock the reference
camera direction. Allow a real 3D turn or alternate viewpoint so the controls
face the operator when natural. Prohibit 2D horizontal mirroring, panel redesign,
reordered controls, and invented or removed product details.

Before any paid or external Router submission, show the user the complete
provider-bound prompt together with reference roles, duration, route, material
parameters, estimated cost, prompt hash and manifest hash. Script approval is
not prompt approval. Bind execution authorization to that exact preview, and
re-preview after any material change.

For execution, the shared MCP Router is the only provider entrypoint. Its ecommerce video default is Seedance 2.0 (`doubao-seedance-2-0-260128`); `seedance-2.0` and `seedance-2.0-fast` are supported caller aliases. Do not extend this copy with credentials, project facts, or a second production workflow. Keep it as a compatibility source until consumers are mapped and the canonical no-spend scenario regression passes.

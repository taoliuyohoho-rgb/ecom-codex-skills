---
name: ecom-product-video
description: "Compatibility source for ecommerce product-video production. Use the canonical Codex ecom-product-video scenario Skill with video-production-core; supports story-led director-brief exploration and production-master handoff while this copy remains a compatibility source."
metadata:
  version: 2.3.0
---

# Ecommerce Product Video Compatibility Source

The canonical operator-facing scenario is `/Users/liutao/.codex/skills/ecom-product-video`. It composes `video-production-core`, uses four human gates (`direction`, `script`, `sample`, `final_video`), requires a no-spend dry run before external execution, and retains the project adapter for live SKU facts and writeback.

The supported execution modes remain `localization`, `hybrid`, and `ai_full`. Stop for explicit script approval, and require explicit approval before any external or paid generation. Generated is not approved or published.

The current story-led execution split is:

- `director_brief_exploration`: lock the single SKU reference role, `hook -> concrete story -> product moment -> CTA`, market context, required product action, and confirmed offer facts; let the model choose framing, camera, acting, pacing, transitions, and promotion treatment for one bounded sample.
- `production_master`: convert accepted story language into reviewed beats, verified text/CTA, continuity requirements, and deterministic final assembly where exact copy or timing matters.

Exploration does not waive script confirmation, paid-call authorization, product/claim review, provenance, or final approval. AI-generated product interaction remains illustrative rather than real proof.

For execution, the shared MCP Router is the only provider entrypoint. Its ecommerce video default is Seedance 2.0 (`doubao-seedance-2-0-260128`); `seedance-2.0` and `seedance-2.0-fast` are supported caller aliases. Do not extend this copy with credentials, project facts, or a second production workflow. Keep it as a compatibility source until consumers are mapped and the canonical no-spend scenario regression passes.

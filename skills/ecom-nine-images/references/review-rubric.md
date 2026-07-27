# Image Review Rubric

Review the generated image against the real SKU reference, confirmed Feishu facts, approved direction, and slot mission. Return structured evidence, not an aesthetic impression.

## Hard Gates

Any of these sets the decision to `fail`:

- `reference_missing`: identity-sensitive output has no verified real SKU reference.
- `wrong_product_type`: the generated subject is a different product category or SKU.
- `identity_drift`: silhouette, proportions, controls, packaging, brand area, handles, lid, spout, base, interfaces, or key parts changed.
- `added_or_missing_parts`: a structural component was invented, removed, duplicated, or relocated.
- `fake_claim_risk`: specification, function, material, certification, rating, review, price, promotion, inventory, logistics, or warranty is unverified or invented.
- `physical_impossibility`: use, fluid, steam, perspective, human interaction, or product behavior is materially impossible or misleading.

Ambiguous or occluded identity evidence is at least `warn`; it is never silently `pass`.

## Dimensions

Score each dimension `pass`, `warn`, or `fail` with one-sentence evidence.

### SKU identity

- product type and body silhouette;
- proportions and perspective geometry;
- controls, brand/label area, packaging layout;
- handles, lid/knob, spout, base, interfaces, accessories;
- added/missing/duplicated parts.

### Claims and compliance

- all visible facts trace to confirmed Feishu fields or approved strategy;
- forbidden claims absent;
- text readable and accurate;
- no fabricated badges, ratings, reviews, promotions, or logistics promises.

### Slot mission and proof

- image answers one shopper question;
- proof is visible, relevant, and verifiable;
- proof supports rather than obscures the product;
- required must-show items are present.

### Composition and readability

- product is recognized first where required;
- hierarchy product -> proof -> conclusion is clear;
- text/information density suits the slot;
- crop, contrast, scale, and safe areas are usable;
- no clutter, duplicated content, or unreadable model text.

### Market and platform fit

- ratio and slot behavior match platform needs;
- scene and props are plausible for market/audience;
- visual mechanisms trace to a dated benchmark or approved store style;
- output is commerce-first rather than an unrelated editorial image.

### Technical quality

- sufficient resolution and clean edges;
- no malformed text, hands, geometry, reflections, shadows, or transparency;
- consistent product color/material and pack visual system;
- asset is downloadable and opens correctly.

## Decision Rules

- `fail`: any hard gate fails, or the slot mission is not usable.
- `warn`: no hard fail, but identity is unclear, proof/fit is weak, or human judgment is required.
- `pass`: all hard gates pass and the image is usable for the approved slot. Human approval is still required before expansion or publication.

## Review Output

```json
{
  "decision": "pass|warn|fail",
  "identity_preserved": true,
  "critical_failure": false,
  "failure_codes": [],
  "checks": {
    "sku_identity": {"status": "pass|warn|fail", "evidence": ""},
    "claims_compliance": {"status": "pass|warn|fail", "evidence": ""},
    "slot_proof": {"status": "pass|warn|fail", "evidence": ""},
    "composition_readability": {"status": "pass|warn|fail", "evidence": ""},
    "market_platform_fit": {"status": "pass|warn|fail", "evidence": ""},
    "technical_quality": {"status": "pass|warn|fail", "evidence": ""}
  },
  "must_fix": [],
  "recommended_prompt_fixes": [],
  "human_approval_required": true
}
```

Automated vision review should compare image A (real SKU anchor) with image B (generated image). Store the model/provider used for review. A failed or unavailable automated review becomes `warn` and requires human inspection; it must not default to pass.

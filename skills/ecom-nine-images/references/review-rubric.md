# Image Review Rubric

Review the generated image against the real SKU reference, confirmed Feishu facts, approved direction, and slot mission. Return structured evidence, not an aesthetic impression.

## Hard Gates

Any of these sets the decision to `fail`:

- `reference_missing`: a formal image request has no verified real SKU reference or reference evidence.
- `wrong_product_type`: the generated subject is a different product category or SKU.
- `identity_drift`: buyer-relevant product type, silhouette, proportions, controls, packaging, brand, quantity relationship, or key structural part changed.
- `added_or_missing_parts`: a buyer-relevant structural component was invented, removed, duplicated, or relocated.
- `buyer_fact_error`: brand, SKU, package/specification, count, quantity, price, Claim, certification, rating, promotion, inventory, logistics, or warranty is unverified, invented, or materially incorrect.
- `physical_impossibility`: use, fluid, steam, perspective, human interaction, or product behavior is materially impossible or misleading.
- `fabricated_testimonial`: a fictional review, rating, username, date, quotation, endorsement, or personal outcome is presented as customer evidence.

Ambiguous or occluded identity evidence is at least `warn`; it is never silently `pass`.

## Text Risk Classification

Text is reviewed for buyer impact, not for pixel-perfect reproduction.

| Text condition | Decision |
|---|---|
| Changes a buyer-relevant fact: brand, SKU, package/specification, count, quantity, price, Claim, certification, rating, promotion, inventory, logistics, or warranty | `fail` with `buyer_fact_error` |
| Minor typography, spacing, line break, kerning, ornamental copy, or non-factual text imperfection | `warn`; named human accepts or requests iteration based on slot use and visual quality |
| Clear and accurate for the intended slot | `pass` |

Do not repair a `warn` with programmatic text overlays. Either accept the complete generated image for that slot or make a new reference-aware generation/edit.

## Dimensions

Score each dimension `pass`, `warn`, or `fail` with one-sentence evidence. A sample that is technically safe but visually weak is not ready for expansion: it needs `pass` on **composition/readability**, **market/platform fit**, and **technical quality**, or a named human must explicitly accept the `warn` for the approved scope.

### SKU identity

- product type and body silhouette;
- proportions and perspective geometry;
- controls, brand/label area, packaging layout;
- handles, lid/knob, spout, base, interfaces, accessories;
- added/missing/duplicated parts;
- buyer-relevant package/count/variant relationship.

### Claims and commercial facts

- all visible buyer-relevant facts trace to confirmed Feishu fields or approved strategy;
- forbidden claims absent;
- no fabricated badges, ratings, reviews, promotions, or logistics promises;
- text risk classification is recorded.

### Slot mission and proof

- image answers one shopper question and communicates no more than one primary approved selling point;
- proof is visible, relevant, and verifiable;
- proof supports rather than obscures the product;
- required must-show items are present.
- any metaphor is identifiable as illustrative, does not resemble anatomical or clinical evidence, and does not strengthen the approved claim;
- slot has a distinct buyer question, persuasion role, primary subject, and visual grammar relative to completed slots; a cosmetic variation of an existing slot is `fail` for pack coverage;
- decision-support content resolves an evidenced uncertainty instead of creating a new medical, safety, disease, or treatment concern;
- non-factual lifestyle copy is not framed as a review, testimonial, quotation, star rating, or buyer outcome;

### Composition and readability

- product is recognized first where the slot requires it;
- hierarchy supports the slot mission;
- information density suits the slot;
- crop, contrast, scale, and safe areas are usable;
- no clutter or duplicated content;
- the image is not a generic repetition of another slot.
- headline and support text remain readable on mobile and do not compete with several unrelated claims;

### Market and platform fit

- ratio and slot behavior match platform needs;
- scene and props are plausible for market/audience;
- visual mechanisms trace to a dated benchmark or approved store style;
- output is commerce-first rather than an unrelated editorial image.

### Technical quality

- sufficient resolution and clean edges;
- no distracting malformed hands, geometry, reflections, shadows, or transparency;
- consistent product color/material and pack visual system;
- asset is downloadable and opens correctly.

## Decision Rules

- `fail`: any hard gate fails, or the slot mission is not usable.
- `warn`: no hard fail, but identity is unclear, text has non-factual imperfections, proof/fit is weak, or human judgment is required.
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
  "text_risk": "pass|warn|fail",
  "must_fix": [],
  "recommended_prompt_fixes": [],
  "human_approval_required": true
}
```

Automated vision review should compare image A (real SKU anchor) with image B (generated image). Store the model/provider used for review. A failed or unavailable automated review becomes `warn` and requires human inspection; it must not default to pass.

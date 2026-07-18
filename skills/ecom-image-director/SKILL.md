---
name: ecom-image-director
description: Plan and execute identity-safe ecommerce product images through the team AI Router.
---

# Ecommerce Image Director

Make ecommerce images useful for clicks and conversion, not merely attractive.

## Before generation

- Decide `refresh` versus `generate`.
- Read the product master data and use the actual SKU/product image as the hard identity anchor when available.
- Confirm platform, market, slot purpose, target audience, verified claims, and the intended writeback location.
- If the Router cannot accept the reference image, do not treat a text-only result as a final SKU-safe product image.

## Prompt structure

Write the prompt in this order: output intent, subject identity, proof, market scene, composition, lighting/material, constraints, and avoid list.

For an anchored product image, require:

- Keep the exact product shape, structure, proportions, controls, packaging, and key details unchanged.
- Change only the approved background, props, proof object, lighting, or light information layer.
- Do not invent specifications, certifications, promotions, reviews, logistics promises, or product functions.

## Output protocol

Return the recommended direction, slot mission, must-show items, avoid list, reference-image plan, Router provider/model, status, asset/URL, approval state, and next step. Start with 2-3 directions and one recommendation before expanding a full image pack.

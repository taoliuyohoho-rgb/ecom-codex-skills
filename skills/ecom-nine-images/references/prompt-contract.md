# Prompt Contract

Prompts are execution artifacts, not product truth. Build them only from confirmed Feishu facts, the approved direction, the real SKU reference, and documented visual evidence.

## Blocks

1. **Output intent**
   - task mode, platform, market, slot, ratio, and commercial purpose.
2. **Identity invariant**
   - exact product/SKU identity and structures that must not change.
3. **Benchmark mechanisms**
   - 2-4 dated visual mechanisms; never competitor facts, brands, badges, or copied layouts.
4. **Proof**
   - one visible, verifiable object/result that serves the slot mission.
5. **Market scene**
   - plausible audience, environment, props, behavior, and physical relationships.
6. **Slot composition**
   - framing, subject share, camera angle, information hierarchy, and negative space.
7. **Lighting/material**
   - concrete rendering expectations for the product and proof.
8. **Allowed changes**
   - background, props, proof, light, and approved information layer only.
9. **Hard constraints**
   - exact structures, packaging, verified claims, and platform rules to preserve.
10. **Avoid**
   - identity drift, invented parts/claims, unreadable text, physical errors, visual clutter, and off-platform composition.

## Anchored Edit Skeleton

```text
Edit the supplied SKU reference into a <platform/market/slot> ecommerce image.

Product identity invariant:
- keep the exact product type, shape, silhouette, structure, proportions, controls, packaging, brand area, and key details unchanged
- do not redesign, add, remove, or relocate product parts

Slot mission: <one shopper decision this image supports>
Proof: <visible and verified proof object/result>
Market scene: <plausible audience/context/props>
Composition: <ratio, framing, product share, information hierarchy>
Lighting/material: <concrete treatment>

Allowed changes:
- <background/props/proof/light/information layer>

Hard constraints:
- <verified claim and identity constraints>

Avoid:
- <identity failure>
- <claim/compliance failure>
- <composition/platform failure>
```

## New Composition Skeleton

Use only when a real reference is still attached and the provider supports it.

```text
Generate a <ratio> ecommerce composition for <platform/market/slot> using the supplied SKU reference as the immutable product identity.

<identity invariant>
<slot mission and proof>
<market scene>
<composition>
<lighting/material>
<allowed changes>
<hard constraints>
<avoid>
```

## Text And Marketing Layers

- Default to zero or 1-2 short fact labels, each no more than 3-4 words.
- Prefer reserved information space and deterministic post-generation overlays for titles, tables, prices, ratings, certifications, and logistics promises.
- Use only approved modules. Never invent `Hot Sale`, free shipping, COD, rating, reviews, ready stock, certification, warranty, or promotion.
- One image communicates one conclusion. The reading order is product -> proof -> conclusion.

## Hero Defaults

For a marketplace hero unless a current benchmark or platform rule overrides it:

- product is recognized first;
- product occupies roughly 70-85% of the frame;
- background supports rather than competes;
- information is sparse but not empty;
- proof does not become the main subject;
- avoid editorial posters, magazine covers, decorative cards, and atmosphere-first layouts.

## Benchmark Record

Before saying a style is current or mainstream, capture:

```json
{
  "platform": "",
  "market": "",
  "category": "",
  "observed_at": "YYYY-MM-DD",
  "sample_size": 0,
  "mechanisms": [],
  "confidence": "low|medium|high",
  "performance_evidence": "none|internal|platform"
}
```

Search rank or prevalence is not proof of conversion. Internal CTR/CVR evidence takes precedence when available.

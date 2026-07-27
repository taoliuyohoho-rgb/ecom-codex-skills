---
name: ecom-product-detail-page
description: "Use only for ecommerce product detail-page copy and structure. Read live SKU truth, organize verified benefits/specifications/usage/package/FAQ/SEO, review claims and localization, and write an approved detail-page version back. Do not create titles, 9-image packs, ads, videos or deep research."
version: 1.0.0
---

# Ecommerce Product Detail Page

Create the product detail-page content package, not the product title or image pack.

## Required sections

Adapt to platform, but cover only supported sections:

1. concise product overview;
2. buyer problem and approved benefit hierarchy;
3. verified features/specifications;
4. usage and care instructions supported by evidence;
5. verified package contents and variants;
6. compatibility, limitations and forbidden-use boundaries;
7. FAQ based on real objections and known facts;
8. SEO/search terms, with hypotheses labeled;
9. claim and localization review notes.

## Workflow

Load `ecom-business-context`, create an isolated run with `ecom-run-contract`, draft one recommended structure, and use `ecom-review-approval` before the version is called approved. Use `shopee-my-detail-tags` only when Shopee Malaysia keyword localization is needed; it is an optional specialist, not this Skill's replacement.

Do not copy competitor detail pages, invent reviews/ratings/certifications/results, or convert a packaging phrase into a broader performance claim.

## Output

Return SKU, platform/market/languages, sectioned copy, verified fact references, hypotheses, prohibited claims, localization notes, version, approval state, writeback target and next test.

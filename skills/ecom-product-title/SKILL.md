---
name: ecom-product-title
description: "Use only for ecommerce product titles. Read live SKU truth, platform/category rules and keyword evidence, propose title variants, check claims and length, obtain copy approval, and write the selected title version back. Do not create detail pages, ads, images, videos or deep research."
version: 1.0.0
---

# Ecommerce Product Title

Create platform-ready product titles only.

## Workflow

1. Load `ecom-business-context` and `ecom-run-contract`.
2. Confirm exact SKU/variant, platform, market, category, language, verified attributes, forbidden expressions and current title.
3. Collect keyword evidence from approved platform/search sources. Label unverified search ideas as hypotheses.
4. Build one recommended title and 2-3 test variants using: brand/product category -> differentiating verified attributes -> use case/audience -> variant where needed.
5. Check character/byte limits, duplication, readability, claim safety, variant correctness and platform prohibited terms.
6. Use `ecom-review-approval` for copy approval and write the selected version to the Listing/task record.

Do not invent specifications, ratings, discounts, shipping promises, certifications, health effects or urgency. Do not stuff the title with near-duplicate keywords.

## Output

Return SKU, platform/market/category, evidence keywords, recommended title, variants with rationale, length checks, claim notes, version, approval state, writeback target and next test.

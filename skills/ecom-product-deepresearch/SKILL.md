---
name: ecom-product-deepresearch
description: "Use only for evidence-backed ecommerce product deep research: product truth, competitors, prices, buyers, store/account positioning, content opportunities, risks and list/test/scale/clear decisions with Feishu writeback. Do not create production titles, detail pages, images or videos."
version: 1.0.0
---

# Ecommerce Product Deep Research

Produce an evidence-backed strategy artifact, not production content.

## Workflow

1. Load `ecom-business-context` and create a research run with `ecom-run-contract`.
2. Separate confirmed product truth, hypotheses and open questions.
3. Plan source classes before collection: same-product listings, direct/indirect competitors, prices, reviews/objections, seller/store positioning, social/content patterns and regulatory sources.
4. Preserve source URLs, collection time, raw evidence, confidence and access failures.
5. Synthesize audience, pains, selling-point candidates, store/account positioning, content opportunities, compliance boundaries and list/test/scale/clear/stop recommendation with conditions.
6. Review factual support and risk using `ecom-review-approval`.
7. Write the narrative report to Feishu Doc and link it from the product/strategy record. Do not overwrite confirmed product facts with research hypotheses.

Required status is one of `draft`, `complete_with_gaps`, `blocked`, or `complete`. Use `complete` only when required evidence classes and Feishu writeback are verified.

## Output

Return SKU/context snapshot, source ledger, competitor/price findings, buyer objections, positioning, content opportunities, risks, confidence, decision/conditions, evidence gaps, report link and next actions.

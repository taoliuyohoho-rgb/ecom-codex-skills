---
name: shopee-my-detail-tags
description: "Generate localized SEO tags, hashtags, and alternative keywords for Shopee Malaysia product detail pages. Use when Codex needs one-to-one Chinese-English-Malay tag mapping, search coverage expansion, Malaysian local phrasing, or keyword alternatives for a Shopee MY listing."
---

# Shopee MY Detail Tags

Create search-oriented tags for Shopee Malaysia detail pages. Optimize for useful search coverage and natural local phrasing, not keyword stuffing.

## Before writing

- Read the confirmed product facts for the SKU: product name, category, materials, dimensions, functions, variants, verified claims, and prohibited claims.
- Confirm the Shopee Malaysia category, target buyer, language preference, and whether the output is for the title, detail page, search tags, social hashtags, or all of them.
- Treat store positioning and account persona as task context, not as product facts.
- Do not invent certifications, performance numbers, health claims, discounts, shipping promises, or product functions.

## Output contract

Return these sections in order:

1. `Primary tags`: a table with one row per concept and aligned `中文`, `English`, and `Bahasa Melayu` columns. Keep the three columns semantically equivalent; do not translate one concept into three unrelated keywords.
2. `Shopee search tags`: compact Malay-first tags suitable for the detail page, grouped into product/category, use case, benefit, audience, and attribute terms.
3. `Hashtags`: platform-appropriate hashtags for Shopee MY or the requested downstream channel.
4. `Alternative keywords`: spelling, word-order, colloquial, and long-tail variants. Mark each as `recommended`, `test`, or `avoid`.
5. `Claim and localization notes`: explain any Malay phrasing choice, ambiguity, or term that needs native review.

## Localization rules

- Prefer natural Malaysian Bahasa Melayu over literal machine translation.
- Keep English loanwords only when Malaysian shoppers commonly use them or when the platform/category convention requires them.
- Keep singular/plural, modifier order, and product category terms consistent across the output.
- Do not mix Indonesian vocabulary into Bahasa Melayu without flagging it.
- Use the requested spelling and capitalization convention consistently; default to readable lowercase tags unless a proper noun or brand requires capitalization.
- Avoid repeated near-duplicates that add no search coverage.

## Quality gate

Before delivery, check:

- Every primary concept has a one-to-one Chinese-English-Malay mapping.
- Every keyword is supported by product facts or an explicitly marked search hypothesis.
- Search tags and hashtags are distinct outputs; hashtags are not a dump of all keywords.
- The answer separates verified claims from test ideas.
- The final output contains the SKU, version, platform, evidence source, and next testing step.

Use `global-ai-router` for multilingual expansion when a live model call is needed. If Router or product facts are unavailable, return a structured draft and list the missing inputs; do not ask for provider keys.

---
name: malay-ad-copy-skill
description: "Write short, forceful Malaysia ecommerce ad copy for Shopee, Lazada, and TikTok Shop. Use when Codex needs bilingual Chinese-English headlines, hooks, short ad lines, or a fixed four-hashtag block for a Malaysian ecommerce campaign."
---

# Malay Ad Copy

Write short, direct, platform-ready ecommerce copy for Malaysia. The goal is fast comprehension and usable testing variants, not long brand storytelling.

## Before writing

- Read the confirmed product facts and verified offer details for the SKU.
- Confirm platform, placement, audience, objective, CTA, offer window, and character limit if provided.
- Keep store positioning, account persona, and campaign strategy as separate context. Do not turn a personal positioning note into a universal product claim.
- Do not invent prices, discounts, stock urgency, ratings, certifications, delivery promises, product performance, or before/after results.

## Output contract

Return:

1. `Recommended version`: bilingual Chinese-English headline, hook, body line if needed, and CTA.
2. `Test variants`: 3-5 short alternatives, each labeled by angle such as problem, benefit, use case, value, or urgency.
3. `Fixed 4-hashtag block`: exactly four hashtags, in a reusable block. Keep them relevant to Malaysia, category, use case, and shopping intent; do not add a fifth hashtag.
4. `Platform adaptation`: note the changes for Shopee, Lazada, and TikTok Shop.
5. `Claim notes`: identify facts used, claims that need approval, and the next test to run.

## Copy rules

- Keep the first line short and concrete. Lead with a buyer problem, visible benefit, use case, or offer that is actually verified.
- Make Chinese and English versions semantically aligned, but let each language sound natural rather than translating word-for-word.
- Use Malaysian English where it improves clarity, but do not force slang. Use Bahasa Melayu only when requested or when a platform placement benefits from it; label the language clearly.
- Prefer one idea per line and verbs that make the action obvious.
- Avoid generic hype such as “best”, “number one”, “guaranteed”, or “must buy” unless the claim is substantiated and approved.
- Keep hashtags lowercase and stable. The fixed block must be copy-pasteable and contain exactly four unique hashtags.

## Platform guidance

- `Shopee`: prioritize searchable product/category wording, clear value, and a direct shopping CTA.
- `Lazada`: prioritize product benefit, offer clarity, and compact promotional language.
- `TikTok Shop`: prioritize the first-second hook, visible use case, spoken-language rhythm, and a short CTA.

Use `global-ai-router` for live bilingual polishing or variant generation when approved. If the Router or product facts are unavailable, return a dry-run draft with missing inputs instead of asking for API keys.

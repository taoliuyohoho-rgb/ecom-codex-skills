#!/usr/bin/env node

import { access, readFile, readdir } from "node:fs/promises";
import { join, resolve } from "node:path";

const repoPath = resolve(new URL("../", import.meta.url).pathname);
const skillsPath = join(repoPath, "skills");

const contracts = {
  "ecom-business-context": [
    "马来电商-商品策略 / 商品主数据",
    "confirmed_facts",
    "hypotheses",
    "gaps",
    "context_status",
    "Do not modify product-master facts",
  ],
  "ecom-image-director": [
    "retained only for compatibility",
    "load and use `ecom-nine-images`",
    "Do not run this legacy skill and `ecom-nine-images` together",
  ],
  "ecom-nine-images": [
    "exactly nine numbered slots",
    "direction_approved",
    "sample_approved",
    "ecom_router_image_generate",
    "referenceImage",
    "Never generate the full nine-image pack before sample approval",
  ],
  "ecom-product-deepresearch": [
    "evidence-backed strategy artifact, not production content",
    "Preserve source URLs",
    "complete_with_gaps",
    "Do not overwrite confirmed product facts with research hypotheses",
  ],
  "ecom-product-detail-page": [
    "not the product title or image pack",
    "verified features/specifications",
    "ecom-review-approval",
    "Do not copy competitor detail pages",
  ],
  "ecom-product-title": [
    "product titles only",
    "keyword evidence",
    "character/byte limits",
    "Do not invent specifications",
    "ecom-review-approval",
  ],
  "ecom-product-video": [
    "localization",
    "hybrid",
    "ai_full",
    "Stop for explicit script approval",
    "explicit approval before any external or paid generation",
    "Generated is not approved or published",
  ],
  "ecom-review-approval": [
    "pass",
    "needs_revision",
    "fail",
    "blocked",
    "Automated review never creates human approval",
    "`published` requires external platform evidence",
  ],
  "ecom-run-contract": [
    "task_id",
    "run_id",
    "operator_id",
    "Never overwrite another operator's run",
    "planned -> generated -> reviewed -> approved -> delivered -> published",
  ],
  "global-ai-router": [
    "ecom_router_text_generate",
    "ecom_router_image_generate",
    "ecom_router_video_start",
    "ecom_router_video_poll",
    "Use dry-run",
    "do not copy a bearer token from another user",
    "ask an operator for provider keys",
  ],
  "malay-ad-copy-skill": [
    "Fixed 4-hashtag block",
    "exactly four hashtags",
    "Do not invent prices",
    "Shopee",
    "Lazada",
    "TikTok Shop",
  ],
  "shopee-my-detail-tags": [
    "中文",
    "English",
    "Bahasa Melayu",
    "one-to-one Chinese-English-Malay mapping",
    "Do not invent certifications",
    "next testing step",
  ],
  "video-director-core": [
    "local truth + current task + global video process = output",
    "make only `1` candidate version per generation round",
    "script confirmation",
    "before any paid generation",
    "localization",
    "hybrid",
    "ai_full",
  ],
};

const failures = [];
const entries = (await readdir(skillsPath, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

const expected = Object.keys(contracts).sort();
if (JSON.stringify(entries) !== JSON.stringify(expected)) {
  failures.push(`Skill inventory mismatch. Expected ${expected.join(", ")}; found ${entries.join(", ")}`);
}

for (const [name, requiredTokens] of Object.entries(contracts)) {
  const file = join(skillsPath, name, "SKILL.md");
  let content;
  try {
    content = await readFile(file, "utf8");
  } catch (error) {
    failures.push(`${name}: cannot read SKILL.md: ${error.message}`);
    continue;
  }

  for (const token of requiredTokens) {
    if (!content.includes(token)) failures.push(`${name}: missing contract token '${token}'`);
  }
}

for (const file of [
  "skills/ecom-nine-images/references/output-schema.json",
  "skills/video-director-core/scripts/validate_candidates.py",
  "skills/video-director-core/scripts/promote_learning.py",
]) {
  await access(join(repoPath, file)).catch(() => failures.push(`Missing executable contract asset: ${file}`));
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Verified responsibility boundaries and minimum safety contracts for all ${expected.length} packaged skills.`);

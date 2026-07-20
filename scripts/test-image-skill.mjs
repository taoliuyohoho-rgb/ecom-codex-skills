#!/usr/bin/env node

import { readFile } from "node:fs/promises";

const skillUrl = new URL("../skills/ecom-image-director/SKILL.md", import.meta.url);
const workflowUrl = new URL("../skills/ecom-image-director/references/workflow.md", import.meta.url);
const rubricUrl = new URL("../skills/ecom-image-director/references/review-rubric.md", import.meta.url);
const schemaUrl = new URL("../skills/ecom-image-director/references/output-schema.json", import.meta.url);

const [skill, workflow, rubric, schemaText] = await Promise.all([
  readFile(skillUrl, "utf8"),
  readFile(workflowUrl, "utf8"),
  readFile(rubricUrl, "utf8"),
  readFile(schemaUrl, "utf8"),
]);
const schema = JSON.parse(schemaText);

const failures = [];
function requireText(haystack, needle, reason) {
  if (!haystack.includes(needle)) failures.push(`${reason}: missing '${needle}'`);
}

requireText(skill, "return `blocked`", "Missing-context behavior");
requireText(skill, "Text-only generation is not an identity-safe fallback", "Reference enforcement");
requireText(workflow, "No provider call is allowed in this state", "Direction approval gate");
requireText(workflow, "requires human sample approval before expansion", "Sample approval gate");
requireText(rubric, "reference_missing", "Reference failure code");
requireText(rubric, "identity_drift", "Identity failure code");
requireText(rubric, "fake_claim_risk", "Claim failure code");

const statuses = new Set(schema.properties?.status?.enum || []);
for (const status of ["blocked", "generated_unreviewed", "approved", "delivered", "published", "concept_only"]) {
  if (!statuses.has(status)) failures.push(`Output schema missing status '${status}'`);
}
const gates = new Set(schema.properties?.current_gate?.enum || []);
for (const gate of ["context_ready", "direction_approved", "sample_reviewed", "sample_approved", "written_back"]) {
  if (!gates.has(gate)) failures.push(`Output schema missing gate '${gate}'`);
}
if (schema.properties?.router?.properties?.tool?.const !== "ecom_router_image_generate") {
  failures.push("Output schema must pin the team image Router tool");
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log("Verified ecommerce image hard gates and output contract.");

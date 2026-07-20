#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import Ajv2020 from "ajv/dist/2020.js";

const skillUrl = new URL("../skills/ecom-image-director/SKILL.md", import.meta.url);
const workflowUrl = new URL("../skills/ecom-image-director/references/workflow.md", import.meta.url);
const rubricUrl = new URL("../skills/ecom-image-director/references/review-rubric.md", import.meta.url);
const schemaUrl = new URL("../skills/ecom-image-director/references/output-schema.json", import.meta.url);
const interfaceUrl = new URL("../skills/ecom-image-director/agents/openai.yaml", import.meta.url);

const [skill, workflow, rubric, schemaText, interfaceText] = await Promise.all([
  readFile(skillUrl, "utf8"),
  readFile(workflowUrl, "utf8"),
  readFile(rubricUrl, "utf8"),
  readFile(schemaUrl, "utf8"),
  readFile(interfaceUrl, "utf8"),
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
requireText(workflow, "approver_role=admin", "Admin pack approval gate");
requireText(interfaceText, "Stop after recommending one direction", "Default interface stop gate");
requireText(interfaceText, "separate real-call authorization", "Default interface real-call gate");
requireText(rubric, "reference_missing", "Reference failure code");
requireText(rubric, "identity_drift", "Identity failure code");
requireText(rubric, "fake_claim_risk", "Claim failure code");

const statuses = new Set(schema.properties?.status?.enum || []);
for (const status of ["blocked", "generated_unreviewed", "approved", "delivered", "published", "concept_only"]) {
  if (!statuses.has(status)) failures.push(`Output schema missing status '${status}'`);
}
const gates = new Set(schema.properties?.current_gate?.enum || []);
for (const gate of ["context_pending", "context_ready", "direction_approved", "sample_reviewed", "sample_approved", "pack_approved", "written_back"]) {
  if (!gates.has(gate)) failures.push(`Output schema missing gate '${gate}'`);
}
if (schema.properties?.router?.properties?.tool?.const !== "ecom_router_image_generate") {
  failures.push("Output schema must pin the team image Router tool");
}

const ajv = new Ajv2020({ allErrors: true, strict: false });
const validate = ajv.compile(schema);
const base = {
  skill_version: "1.0.0",
  sku: "TEST-SKU",
  product_name: "Test product",
  mode: "listing_pack",
  platform: "shopee",
  market: "MY",
  slot: 1,
  status: "planned",
  current_gate: "directions_proposed",
  known_facts: [],
  gaps: [],
  directions: [{
    name: "Proof hero",
    slot_mission: "Identify the product",
    proof: "Verified product reference",
    must_show: ["SKU"],
    avoid: ["identity drift"],
    recommended: true,
  }],
  reference_plan: { required: true, source: "feishu://asset", router_supported: true },
  approvals: [],
  assets: [],
  review: null,
  writeback: { target: "Feishu task", completed: false, record_or_doc_url: null },
  next_action: "Await direction approval",
  next_owner: "operator",
};

function expectValid(name, value) {
  if (!validate(value)) failures.push(`${name} should be valid: ${ajv.errorsText(validate.errors)}`);
}
function expectInvalid(name, value) {
  if (validate(value)) failures.push(`${name} should be rejected by output schema`);
}

expectValid("direction proposal", structuredClone(base));

const adminDelivered = structuredClone(base);
adminDelivered.status = "delivered";
adminDelivered.current_gate = "delivered";
adminDelivered.approvals = [
  { stage: "direction", state: "approved", approver: "operator", approver_role: "operator", approved_scope: "one sample", real_call_authorized: true, approved_at: "2026-07-20T00:00:00Z" },
  { stage: "sample", state: "approved", approver: "operator", approver_role: "operator", approved_scope: "full expansion", real_call_authorized: false, approved_at: "2026-07-20T00:10:00Z" },
  { stage: "pack", state: "approved", approver: "admin", approver_role: "admin", approved_scope: "delivery", real_call_authorized: false, approved_at: "2026-07-20T00:20:00Z" },
];
adminDelivered.router = { tool: "ecom_router_image_generate", provider: "gemini", model: "test", status: "completed", request_id: "req-test", cost: null };
adminDelivered.assets = [{ kind: "full_pack", url: "https://example.com/pack", state: "delivered", approval_ref: "pack-admin", platform_evidence: null }];
expectValid("admin-approved delivery", adminDelivered);

const routerWithoutApproval = structuredClone(base);
routerWithoutApproval.status = "generated_unreviewed";
routerWithoutApproval.current_gate = "sample_generated";
routerWithoutApproval.router = { tool: "ecom_router_image_generate", provider: "gemini", model: "test", status: "completed", request_id: "req-test", cost: null };
expectInvalid("Router call without direction approval", routerWithoutApproval);

const operatorPackApproval = structuredClone(adminDelivered);
operatorPackApproval.approvals[2].approver_role = "operator";
expectInvalid("operator pack approval", operatorPackApproval);

const earlyPublished = structuredClone(adminDelivered);
earlyPublished.status = "published";
earlyPublished.current_gate = "sample_generated";
earlyPublished.assets[0] = { kind: "sample", url: "https://example.com/sample", state: "published", approval_ref: "sample", platform_evidence: "https://platform.example/item" };
expectInvalid("early published state", earlyPublished);

const publishedWithoutEvidence = structuredClone(adminDelivered);
publishedWithoutEvidence.status = "published";
publishedWithoutEvidence.current_gate = "written_back";
publishedWithoutEvidence.assets[0].state = "published";
publishedWithoutEvidence.assets[0].platform_evidence = null;
expectInvalid("published without platform evidence", publishedWithoutEvidence);

const conceptDelivered = structuredClone(base);
conceptDelivered.status = "concept_only";
conceptDelivered.current_gate = "directions_proposed";
conceptDelivered.assets = [{ kind: "sample", url: "https://example.com/concept", state: "delivered", approval_ref: "concept", platform_evidence: null }];
expectInvalid("concept-only delivery", conceptDelivered);

const deliveredWrittenBackOperator = structuredClone(adminDelivered);
deliveredWrittenBackOperator.status = "delivered";
deliveredWrittenBackOperator.current_gate = "written_back";
deliveredWrittenBackOperator.approvals[2].approver_role = "operator";
expectInvalid("delivered+written_back with operator pack approval", deliveredWrittenBackOperator);

const publishedWrittenBackOperator = structuredClone(adminDelivered);
publishedWrittenBackOperator.status = "published";
publishedWrittenBackOperator.current_gate = "written_back";
publishedWrittenBackOperator.approvals[2].approver_role = "operator";
publishedWrittenBackOperator.assets[0] = { kind: "full_pack", url: "https://example.com/pack", state: "published", approval_ref: "pack-operator", platform_evidence: "https://platform.example/item" };
expectInvalid("published+written_back with operator pack approval", publishedWrittenBackOperator);

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log("Verified ecommerce image hard gates, schema conditions, and negative state combinations.");

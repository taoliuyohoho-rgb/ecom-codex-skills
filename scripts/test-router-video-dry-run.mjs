import assert from "node:assert/strict";

process.env.AI_REAL_CALLS_ENABLED = "false";
process.env.AI_SHARED_ENV_PATH = "/tmp/ecom-ai-router-test-missing.env";

const { default: aiRuntime, normalizeVideoModel, SEEDANCE_2_MODEL, SEEDANCE_2_FAST_MODEL } = await import("../mcp-server/dist/ai-router.js");

assert.equal(normalizeVideoModel("seedance-2.0"), SEEDANCE_2_MODEL);
assert.equal(normalizeVideoModel("seedance-2.0-fast"), SEEDANCE_2_FAST_MODEL);
assert.equal(aiRuntime.env.providerProfile("doubao", "video").model, SEEDANCE_2_MODEL);

const result = await aiRuntime.video.generate({
  provider: "doubao",
  model: "seedance-2.0",
  prompt: "A short story-led ecommerce video sample.",
  ratio: "9:16",
  seconds: 6,
});

assert.equal(result.status, "dry-run");
assert.equal(result.provider, "doubao");
assert.equal(result.model, SEEDANCE_2_MODEL);
console.log(`Router video dry-run passed: ${result.provider}/${result.model}`);

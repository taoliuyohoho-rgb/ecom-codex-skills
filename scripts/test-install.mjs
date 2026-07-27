#!/usr/bin/env node

import { mkdtemp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const installer = new URL("../install.mjs", import.meta.url).pathname;
const sourceSkills = await readdir(new URL("../skills/", import.meta.url), { withFileTypes: true });
const skillNames = sourceSkills.filter((item) => item.isDirectory() && item.name !== "ecom-image-director").map((item) => item.name);
const nineImageSkills = ["global-ai-router", "ecom-business-context", "ecom-run-contract", "ecom-review-approval", "ecom-nine-images"];

function run(args, env = {}) {
  return spawnSync(process.execPath, [installer, ...args], {
    env: { ...process.env, ...env },
    encoding: "utf8",
  });
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const sandbox = await mkdtemp(join(tmpdir(), "ecom-skills-install-"));
try {
  const codexHome = join(sandbox, "codex-home");
  let result = run(["--client", "codex", "--bundle", "all"], { CODEX_HOME: codexHome });
  assert(result.status === 0, result.stderr || result.stdout || "Codex install failed");
  for (const name of skillNames) {
    const content = await readFile(join(codexHome, "skills", name, "SKILL.md"), "utf8");
    assert(content.startsWith("---\n"), `Invalid Codex skill: ${name}`);
  }
  const codexManifest = JSON.parse(await readFile(join(codexHome, "skills", ".ecom-codex-skills.json"), "utf8"));
  assert(codexManifest.package === "ecom-codex-skills", "Codex manifest missing package name");
  assert(!(await readdir(join(codexHome, "skills"))).includes("ecom-image-director"), "Legacy image stub must not be installed by default");

  const hermesHome = join(sandbox, "hermes-profile");
  result = run(["--client", "hermes", "--bundle", "nine-images"], { HERMES_HOME: hermesHome });
  assert(result.status === 0, result.stderr || result.stdout || "Hermes install failed");
  assert((await readFile(join(hermesHome, "skills", "ecom-nine-images", "SKILL.md"), "utf8")).includes("name: ecom-nine-images"), "Hermes install target is wrong");
  const hermesEntries = (await readdir(join(hermesHome, "skills"))).filter((name) => !name.startsWith("."));
  assert(JSON.stringify(hermesEntries.sort()) === JSON.stringify(nineImageSkills.sort()), "Nine-images bundle installed unrelated skills");

  const customRoot = join(sandbox, "generic-skills");
  result = run(["--client", "generic", "--target", customRoot, "--bundle", "nine-images"]);
  assert(result.status === 0, result.stderr || result.stdout || "Generic install failed");
  assert((await readFile(join(customRoot, "ecom-nine-images", "SKILL.md"), "utf8")).includes("name: ecom-nine-images"), "Generic install target is wrong");

  result = run(["--client", "generic", "--target", customRoot, "--bundle", "nine-images"]);
  assert(result.status === 0, "Identical reinstall must be idempotent");

  const conflictRoot = join(sandbox, "conflict-skills");
  await mkdir(join(conflictRoot, "ecom-nine-images"), { recursive: true });
  await writeFile(join(conflictRoot, "ecom-nine-images", "SKILL.md"), "personal skill\n");
  result = run(["--client", "generic", "--target", conflictRoot, "--bundle", "nine-images"]);
  assert(result.status !== 0, "Conflicting skill must stop installation");
  assert(result.stderr.includes("conflict"), "Conflict failure must explain the conflict");
  assert((await readFile(join(conflictRoot, "ecom-nine-images", "SKILL.md"), "utf8")) === "personal skill\n", "Conflicting personal skill was overwritten");
  assert(!(await readdir(conflictRoot)).includes("global-ai-router"), "Conflict check must be atomic before copying any skill");

  console.log(`Installed and verified ${skillNames.length} shared skills plus the isolated nine-images bundle for Codex, Hermes, and a generic target; conflict and idempotency behavior passed.`);
} finally {
  await rm(sandbox, { recursive: true, force: true });
}

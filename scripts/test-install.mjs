#!/usr/bin/env node

import { mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const sandbox = await mkdtemp(join(tmpdir(), "ecom-skills-install-"));
try {
  const result = spawnSync(process.execPath, [new URL("../install.mjs", import.meta.url).pathname], {
    env: { ...process.env, CODEX_HOME: sandbox },
    encoding: "utf8",
  });
  if (result.status !== 0) throw new Error(result.stderr || result.stdout || "install failed");
  const sourceSkills = await readdir(new URL("../skills/", import.meta.url), { withFileTypes: true });
  for (const entry of sourceSkills.filter((item) => item.isDirectory())) {
    const installed = join(sandbox, "skills", entry.name, "SKILL.md");
    const content = await readFile(installed, "utf8");
    if (!content.startsWith("---\n")) throw new Error(`Invalid installed skill: ${installed}`);
  }
  console.log(`Installed and verified ${sourceSkills.filter((item) => item.isDirectory()).length} shared skills in a clean sandbox.`);
} finally {
  await rm(sandbox, { recursive: true, force: true });
}

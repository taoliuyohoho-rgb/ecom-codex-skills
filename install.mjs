#!/usr/bin/env node

import { createHash } from "node:crypto";
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  renameSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { homedir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL(".", import.meta.url)));
const source = join(root, "skills");
const packageJson = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
const manifestName = ".ecom-codex-skills.json";

function parseArgs(argv) {
  const options = { client: "codex", target: "", bundle: "all" };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--client" || argument === "--target" || argument === "--bundle") {
      const value = argv[index + 1];
      if (!value || value.startsWith("--")) throw new Error(`${argument} requires a value`);
      options[argument.slice(2)] = value;
      index += 1;
    } else if (argument === "--help" || argument === "-h") {
      console.log("Usage: node install.mjs --client codex|hermes|generic --bundle nine-images|title|detail-page|video|deepresearch|all [--target /path/to/skills]");
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${argument}`);
    }
  }
  return options;
}

function resolveTarget({ client, target }) {
  if (target) return resolve(target.replace(/^~(?=$|\/)/, homedir()));
  if (client === "codex") return join(process.env.CODEX_HOME || join(homedir(), ".codex"), "skills");
  if (client === "hermes") {
    if (!process.env.HERMES_HOME) {
      throw new Error("Hermes install requires HERMES_HOME for the intended profile or an explicit --target path");
    }
    return join(process.env.HERMES_HOME, "skills");
  }
  if (client === "generic") throw new Error("Generic install requires --target /path/to/skills");
  throw new Error(`Unsupported client: ${client}`);
}

function listFiles(path, rootPath = path) {
  const files = [];
  for (const entry of readdirSync(path, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const child = join(path, entry.name);
    if (entry.isDirectory()) files.push(...listFiles(child, rootPath));
    else if (entry.isFile()) files.push({ path: child, relative: child.slice(rootPath.length + 1) });
  }
  return files;
}

function treeHash(path) {
  const hash = createHash("sha256");
  for (const file of listFiles(path)) {
    hash.update(file.relative);
    hash.update("\0");
    hash.update(readFileSync(file.path));
    hash.update("\0");
  }
  return hash.digest("hex");
}

function readManifest(path) {
  if (!existsSync(path)) return null;
  try {
    const parsed = JSON.parse(readFileSync(path, "utf8"));
    return parsed.package === "ecom-codex-skills" ? parsed : null;
  } catch {
    return null;
  }
}

const options = parseArgs(process.argv.slice(2));
const target = resolveTarget(options);
if (!existsSync(source)) throw new Error(`Missing skill directory: ${source}`);
mkdirSync(target, { recursive: true });

const manifestPath = join(target, manifestName);
const previousManifest = readManifest(manifestPath);
const foundations = ["global-ai-router", "ecom-business-context", "ecom-run-contract", "ecom-review-approval"];
const bundles = {
  "nine-images": [...foundations, "ecom-nine-images"],
  title: [...foundations, "ecom-product-title", "shopee-my-detail-tags"],
  "detail-page": [...foundations, "ecom-product-detail-page", "shopee-my-detail-tags"],
  video: [...foundations, "ecom-product-video", "video-director-core"],
  deepresearch: [...foundations, "ecom-product-deepresearch"],
};
const allSkills = readdirSync(source, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && entry.name !== "ecom-image-director")
  .map((entry) => entry.name);
const selectedNames = options.bundle === "all" ? allSkills : bundles[options.bundle];
if (!selectedNames) throw new Error(`Unsupported bundle: ${options.bundle}`);
const skillEntries = readdirSync(source, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && selectedNames.includes(entry.name))
  .map((entry) => ({ name: entry.name, source: join(source, entry.name) }));
const plan = [];
const conflicts = [];

for (const skill of skillEntries) {
  const destination = join(target, skill.name);
  const sourceHash = treeHash(skill.source);
  if (!existsSync(destination)) {
    plan.push({ ...skill, destination, sourceHash, action: "install" });
    continue;
  }
  if (!statSync(destination).isDirectory()) {
    conflicts.push(`${skill.name}: target exists and is not a directory`);
    continue;
  }
  const currentHash = treeHash(destination);
  if (currentHash === sourceHash) {
    plan.push({ ...skill, destination, sourceHash, action: "unchanged" });
    continue;
  }
  const managedHash = previousManifest?.skills?.[skill.name]?.hash;
  if (managedHash && managedHash === currentHash) {
    plan.push({ ...skill, destination, sourceHash, action: "upgrade" });
    continue;
  }
  conflicts.push(`${skill.name}: conflict with an existing personal or locally modified skill at ${destination}`);
}

if (conflicts.length) {
  console.error("Installation stopped before copying because skill conflicts were found:\n" + conflicts.map((item) => `- ${item}`).join("\n"));
  console.error("Use a dedicated Agent profile/skills directory, rename the personal skill, or review and remove the conflict explicitly.");
  process.exit(2);
}

for (const item of plan) {
  if (item.action === "unchanged") continue;
  const staging = join(dirname(item.destination), `.${basename(item.destination)}.ecom-staging-${process.pid}`);
  rmSync(staging, { recursive: true, force: true });
  cpSync(item.source, staging, { recursive: true });
  if (item.action === "upgrade") rmSync(item.destination, { recursive: true, force: true });
  renameSync(staging, item.destination);
}

const manifest = {
  package: "ecom-codex-skills",
  version: packageJson.version,
  client: options.client,
  bundle: options.bundle,
  installed_at: new Date().toISOString(),
  skills: Object.fromEntries(plan.map((item) => [item.name, { hash: item.sourceHash }])),
};
writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, { mode: 0o600 });

const counts = Object.fromEntries(["install", "upgrade", "unchanged"].map((action) => [action, plan.filter((item) => item.action === action).length]));
console.log(`Installed shared ecommerce skills into ${target}`);
console.log(`Result: ${counts.install} new, ${counts.upgrade} upgraded, ${counts.unchanged} unchanged. Other skills were not touched.`);
console.log("Skills do not contain API keys. Configure the team MCP Router separately for live AI calls.");

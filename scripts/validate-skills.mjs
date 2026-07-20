#!/usr/bin/env node

import { access, readFile, readdir } from "node:fs/promises";
import { basename, dirname, extname, join, resolve } from "node:path";
import process from "node:process";

const repoPath = resolve(new URL("../", import.meta.url).pathname);
const rootPath = join(repoPath, "skills");
const forbidden = [
  /(?:api[_-]?key|app[_-]?secret|access[_-]?token|bearer[_-]?token)\s*[:=]\s*["']?[A-Za-z0-9_\-]{16,}/i,
  /\b(?:sk-[A-Za-z0-9_-]{20,}|AIza[A-Za-z0-9_-]{30,}|gh[oprsu]_[A-Za-z0-9_]{30,}|xox[baprs]-[A-Za-z0-9-]{20,})\b/,
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
];
const textExtensions = new Set([".md", ".json", ".yaml", ".yml", ".js", ".mjs", ".ts", ".py", ".txt", ".toml"]);
const ignoredDirectories = new Set([".git", "node_modules", "dist", "coverage"]);

function parseFrontmatter(content, file) {
  if (!content.startsWith("---\n")) throw new Error(`${file}: frontmatter must start at byte zero`);
  const end = content.indexOf("\n---\n", 4);
  if (end < 0) throw new Error(`${file}: missing frontmatter terminator`);
  const frontmatter = content.slice(4, end);
  const body = content.slice(end + 5).trim();
  const values = {};
  for (const line of frontmatter.split("\n")) {
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.+?)\s*$/);
    if (match) values[match[1]] = match[2].replace(/^(["'])(.*)\1$/, "$2");
  }
  if (!values.name) throw new Error(`${file}: missing name`);
  if (!values.description) throw new Error(`${file}: missing description`);
  if (values.description.length > 1024) throw new Error(`${file}: description exceeds 1024 characters`);
  if (!body) throw new Error(`${file}: body is empty`);
  return values;
}

async function walk(path) {
  const files = [];
  for (const entry of await readdir(path, { withFileTypes: true })) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue;
    const child = join(path, entry.name);
    if (entry.isDirectory()) files.push(...await walk(child));
    else files.push(child);
  }
  return files;
}

async function validateMarkdownLinks(content, file) {
  const links = content.matchAll(/\[[^\]]*\]\(([^)]+)\)/g);
  for (const match of links) {
    const raw = match[1].trim().replace(/^<|>$/g, "").split("#", 1)[0];
    if (!raw || /^(https?:|mailto:)/.test(raw)) continue;
    const target = resolve(dirname(file), raw);
    if (!target.startsWith(rootPath)) throw new Error(`${file}: relative link escapes skills root: ${raw}`);
    await access(target).catch(() => { throw new Error(`${file}: broken relative link: ${raw}`); });
  }
}

function validateImageDirector(content, file) {
  const required = [
    "context_ready",
    "direction_approved",
    "sample_reviewed",
    "pack_approved",
    "written_back",
    "ecom_router_image_generate",
    "referenceImage",
    "马来电商-商品策略 / 商品主数据",
  ];
  for (const token of required) {
    if (!content.includes(token)) throw new Error(`${file}: missing required image workflow token '${token}'`);
  }
}

const entries = await readdir(rootPath, { withFileTypes: true });
let checked = 0;
let checkedFiles = 0;
const errors = [];
for (const entry of entries) {
  if (!entry.isDirectory()) continue;
  const skillDir = join(rootPath, entry.name);
  const skillFile = join(skillDir, "SKILL.md");
  let skillContent;
  try {
    skillContent = await readFile(skillFile, "utf8");
    const values = parseFrontmatter(skillContent, skillFile);
    if (values.name !== basename(entry.name)) {
      throw new Error(`${skillFile}: name '${values.name}' must match directory '${entry.name}'`);
    }
    if (entry.name === "ecom-image-director") validateImageDirector(skillContent, skillFile);
    checked += 1;
  } catch (error) {
    errors.push(error instanceof Error ? error.message : String(error));
    continue;
  }

  for (const file of await walk(skillDir)) {
    if (!textExtensions.has(extname(file))) continue;
    try {
      const content = await readFile(file, "utf8");
      if (extname(file) === ".json") JSON.parse(content);
      if (extname(file) === ".md") await validateMarkdownLinks(content, file);
      checkedFiles += 1;
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error));
    }
  }
}

let scannedRepoFiles = 0;
for (const file of await walk(repoPath)) {
  if (!textExtensions.has(extname(file))) continue;
  try {
    const content = await readFile(file, "utf8");
    for (const pattern of forbidden) {
      if (pattern.test(content)) throw new Error(`${file}: possible secret detected`);
    }
    scannedRepoFiles += 1;
  } catch (error) {
    errors.push(error instanceof Error ? error.message : String(error));
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`Validated ${checked} shared skills across ${checkedFiles} skill assets; scanned ${scannedRepoFiles} repository text files for secrets.`);

#!/usr/bin/env node

import { readFile, readdir } from "node:fs/promises";
import { basename, join } from "node:path";
import process from "node:process";

const root = new URL("../skills/", import.meta.url);
const forbidden = [
  /(?:api[_-]?key|app[_-]?secret|access[_-]?token|bearer[_-]?token)\s*[:=]\s*["']?[A-Za-z0-9_\-]{16,}/i,
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
];

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

const entries = await readdir(root, { withFileTypes: true });
let checked = 0;
const errors = [];
for (const entry of entries) {
  if (!entry.isDirectory()) continue;
  const fileUrl = new URL(`${entry.name}/SKILL.md`, root);
  let content;
  try {
    content = await readFile(fileUrl, "utf8");
  } catch (error) {
    errors.push(`${entry.name}: missing SKILL.md`);
    continue;
  }
  try {
    const values = parseFrontmatter(content, fileUrl.pathname);
    if (values.name !== basename(entry.name)) {
      throw new Error(`${fileUrl.pathname}: name '${values.name}' must match directory '${entry.name}'`);
    }
    for (const pattern of forbidden) {
      if (pattern.test(content)) throw new Error(`${fileUrl.pathname}: possible secret detected`);
    }
    checked += 1;
  } catch (error) {
    errors.push(error instanceof Error ? error.message : String(error));
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`Validated ${checked} shared skills.`);

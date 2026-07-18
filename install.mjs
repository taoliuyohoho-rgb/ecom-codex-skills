#!/usr/bin/env node
import { cpSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL(".", import.meta.url)));
const target = join(process.env.CODEX_HOME || join(process.env.HOME || process.cwd(), ".codex"), "skills");
const source = join(root, "skills");

if (!existsSync(source)) throw new Error(`Missing skill directory: ${source}`);
cpSync(source, target, { recursive: true });
console.log(`Installed shared ecommerce skills into ${target}`);
console.log("Skills do not contain API keys. Configure a team MCP Router for live AI calls.");

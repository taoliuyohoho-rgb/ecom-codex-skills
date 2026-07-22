# Security Policy

## Reporting a Vulnerability

This repository contains shared ecommerce skill instructions and helper scripts. It does not contain provider API keys, Feishu App Secrets, bearer tokens, customer data, or generated media.

If you discover a provider key, access token, or customer data in this repository, do not use it and do not disclose it publicly. Report it by:

1. Opening a GitHub Security Advisory on this repository, or
2. Contacting the repository owner directly through the linked Feishu community.

Do not file a public issue for a confirmed secret leak.

## Safe Use

- Clone from `https://github.com/taoliuyohoho-rgb/ecom-codex-skills.git` or an official fork.
- Verify that `git log` shows commits from expected authors only.
- Run `npm test` after every `git pull`.
- No provider key or token should ever be committed. If a scan finds one, it is a vulnerability.

## Dependency Management

Dependencies are managed through Dependabot (npm weekly, GitHub Actions monthly). Review dependency update PRs before merging.

# Contributing

This repository publishes shared ecommerce skills and the team AI Router. Product facts and operating decisions remain in the ecommerce Feishu workspace; provider API keys remain on the Router server.

## Access models

### Repository collaborator

A collaborator with write access can create a branch in this repository:

```bash
git clone https://github.com/taoliuyohoho-rgb/ecom-codex-skills.git
cd ecom-codex-skills
npm install
git switch -c skill/<name>-<change>
```

### External contributor

Anyone without write access can fork the repository, create a branch in the fork, and open a pull request into this repository's `main` branch. This is also the default path while access is being arranged.

## Change workflow

1. Pull the latest `main` and create a non-`main` branch.
2. Change one skill or one coherent behavior at a time.
3. Keep provider keys, bearer tokens, Feishu secrets, product-private data, and generated media out of Git.
4. Run the checks:

```bash
npm test
```

5. For behavior changes, test with the same product, SKU reference, platform, market, and slot used by the baseline. Record evidence in the pull request, not as generated media in Git.
6. Push the branch and open a pull request. Do not push directly to `main`.
7. Another team member reviews the behavior and evidence before merge.

## Skill contract

Every `skills/<name>/SKILL.md` must:

- start with YAML frontmatter at byte zero;
- include a `name` matching the directory and a trigger-focused `description`;
- contain actionable instructions after the frontmatter;
- use the shared `global-ai-router` skill for provider calls;
- never ask an operator for a provider API key;
- preserve human approval before an asset is called approved or published.

Put large references under the skill's `references/`, reusable templates under `templates/`, and scripts under `scripts/`.

## Ecommerce image changes

Image-skill pull requests must state:

- task type: refresh, generate, listing pack, or review;
- platform, market, slot, and intended audience;
- whether a real SKU reference was supplied;
- baseline versus candidate outputs;
- identity, claim, composition, readability, and platform-fit review results;
- cost/provider changes;
- intended Feishu or delivery writeback location.

Do not merge a text-only result as an identity-safe SKU image.

## Installing a reviewed version

After a pull request is merged:

```bash
git switch main
git pull --ff-only
npm install
npm run install-skills
```

Restart Codex or reopen its workspace so the installed skill registry reloads. Installation copies instructions only; MCP access is authenticated separately through the team Router's Feishu OAuth flow.

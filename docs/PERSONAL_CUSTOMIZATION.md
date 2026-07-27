# Personal Customization and Team Updates

The team publishes a stable baseline. Each operator owns their local copy and may adapt it without changing the team default.

## Rules

- Install only the task bundle you need.
- Personal edits stay local or on a personal Git branch/fork.
- Do not edit the team's protected `main` directly.
- Do not create a second product truth source; personal Skills still read Feishu facts.
- Give a materially different personal Skill a different name, such as `ecom-nine-images-operator-a`, when both versions must coexist.

## Update behavior

The installer stores a manifest and hash for each installed Skill.

- Same content: idempotent, no copy.
- Team-managed, locally unchanged content: safe upgrade.
- Unknown same-name Skill: installation stops before any file is copied.
- Locally modified managed Skill: installation stops and preserves the local files.

There is no automatic three-way merge. This is intentional: an Agent instruction conflict should be reviewed by a person.

## Recommended merge flow

```bash
cd ecom-codex-skills
git fetch origin
git diff HEAD..origin/main -- skills/ecom-nine-images
```

Then choose one:

1. keep the personal version;
2. manually apply selected upstream changes;
3. rename the personal Skill and install the new team version alongside it for an explicit experiment;
4. move the useful personal change to a branch and submit a PR.

After merging, run:

```bash
npm ci
npm test
node install.mjs --client codex --bundle nine-images
```

For Hermes, use the active profile's `HERMES_HOME`. For another Agent, use `--client generic --target <skills-dir>`.

## Promotion to team default

A personal change becomes a team candidate only after evidence from more than one independent case, a holdout check, claim/identity review, tests and another person's review. Git merge and Feishu `已发布` status are separate approvals.

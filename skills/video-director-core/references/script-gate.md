# Script Gate

Use this file to decide whether the task is allowed to move past script.

## Required Parts

A script is only considered explicit when all of these are present:

1. `hook`
2. `body`
3. `proof`
4. `CTA`
5. `audio`, covering both `bgm` and voice/sound intent

If any part is still fuzzy, do not move to shot planning.

## Confirmation Rule

Before any generation or shot-planning step, the user must explicitly confirm the script unless they already provided a locked script.

Default confirmation behavior:

- ask for script confirmation only
- do not keep asking fine-detail follow-up questions unless something is truly blocking truthfulness or execution
- if the user confirms the script, treat that as sufficient to continue

## Allowed Skip Cases

Skip script only when at least one is true:

1. the user provides a locked script
2. the task is a pure execution or shot-conversion task
3. the task is a pure technical repair

If skipped, state the reason in the local artifact.

## Quality Questions

Check:

- for TikTok / short-form work, does the script use a strong default shape such as `total -> breakdown -> total`, or is there a stated reason not to?
- does the hook clearly frame the viewer's reason to keep watching?
- for TikTok / short-form work, has the hook been scored for stop-scroll strength and rewritten if it is below `4/5`?
- does the body advance one coherent message instead of loose fragments?
- for TikTok / short-form work, does proof or consequence arrive by line `2` or roughly second `6`?
- is proof explicit rather than implied?
- does the CTA match the platform and the truth available?
- does the audio plan clearly state `bgm` plus voice/sound?
- has the user explicitly approved this script for generation?

If any answer is no, the script is not ready.

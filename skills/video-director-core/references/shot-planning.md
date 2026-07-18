# Shot Planning

Shot planning begins only after script is explicit.

## Required Output

Write a scene-by-scene plan that covers every script beat.

Each beat should declare:

- source type: keep / replace / generate
- if generated, model tier intent: `premium` for first-screen hook, people, hands, emotion, complex motion, or native audio; `standard` for simple product display, environment, steam/food/action inserts, transitions, or neutral context; `local` for CTA cards, subtitles, BGM, overlays, and final assembly
- scene purpose
- proof coverage
- transition logic if important

For real-asset, documentary, travel, family, testimonial, or proof-led videos, use an evidence table:

| beat | narration intent | strong visual evidence | fallback / weak evidence | transition logic |
|---|---|---|---|---|

For narration-driven rough cuts, also keep machine-readable planning artifacts:

- `timing.json` or equivalent: narration line ids, text, start/end, duration, total duration
- `assets_index.json` or equivalent: clip file, duration, orientation, scene, description, tags, usable/marginal/false, chapters, highlight, reason
- `sheets/` or equivalent contact sheets: representative frames for human/Codex spot-checking
- `timeline.json` or equivalent: each narration line maps to one or more shots with `file`, `in`, `dur`, and `why`

## Hard Rules

- do not silently change the script while planning shots
- do not claim proof without a source
- do not let the hook consume the whole creative idea
- do not treat duplicate continuation footage as a full body plan
- do not ask one expensive model to generate the whole film when the same originality goal can be achieved by premium hook/action beats plus standard/simple generated inserts and local assembly
- do not cut visuals sentence-by-sentence when the story is beat-led; organize visuals by story beat, proof, and emotion
- do not imply an event was filmed when no visual evidence exists; mark it as weak evidence and use fallback treatment
- declare hard-excluded assets before execution when the user identifies screenshots, private data, irrelevant files, or off-topic clips
- group duplicate or near-duplicate footage and set a usage limit before rendering
- never treat an automatic shot allocator as final; use it as a baseline, inspect contact sheets for weak picks, then rewrite the timeline before render approval

## Readiness Check

The shot plan is ready only when:

- every script beat has a scene source
- proof is visibly covered
- the plan does not require hidden strategy invention
- weak-evidence beats have honest fallback treatment
- excluded assets and duplicate groups are recorded
- for rough cuts, the timeline is validatable and can be rerendered without rereading chat history

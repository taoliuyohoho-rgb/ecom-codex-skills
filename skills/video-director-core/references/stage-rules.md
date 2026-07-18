# Stage Rules

Use this as the shared default stage order for video work.

## Default Order

1. `task framing`
2. `angle`
3. `script`
4. `script confirmation`
5. `shots`
6. `execution plan`
7. `review`
8. `local writeback`

Do not enter a later stage until the current stage has a written artifact or an explicit reason to skip.

## Stage Outputs

### 1. Task Framing

Write:

- the task in one sentence
- the chosen mode
- the main uncertainty to reduce
- the success bar

### 2. Angle

Write:

- one recommended angle
- why it fits the audience or platform
- any hard constraint that shapes the script

### 3. Script

Write:

- hook
- body
- proof
- CTA
- audio plan, including `bgm` plus voice/sound intent

Script is not complete until all four are explicit.

Default generation posture:

- prepare exactly `1` recommended script version unless the user explicitly asks for multiple versions

### 4. Script Confirmation

Write:

- whether the script has explicit user confirmation
- whether the user locked only the script or also any other production constraint
- any paid-step warning that still blocks execution

Do not move to shot planning or generation until the script is explicitly confirmed by the user, unless the user already provided a locked script as input.

### 5. Shots

Write:

- scene-by-scene mapping
- keep / replace / generate decision for each beat
- for generated beats, the provider tier intent: `premium` for hook / people / hands / emotion / complex motion / native audio, `standard` for product display / context / transition, or `local` for edit-only CTA / subtitle / BGM / overlays
- proof coverage
- for real-asset videos, a `beat -> visual evidence -> fallback -> transition` table plus excluded assets and duplicate groups
- for narration-driven rough cuts, a machine-readable shot contract: `timing.json` or equivalent narration timing, `assets_index.json` or equivalent clip index, and `timeline.json` or equivalent per-line shot assignment

### 6. Execution Plan

Write:

- the concrete next production step
- gating assumptions
- what still needs approval or confirmation
- whether the next step spends money and, if yes, whether the user already approved that spend
- for rendered videos, pre-render checks for asset references, proxy needs, still previews, audio/subtitle timing, and final media validation

Render engine selection:

- use existing deterministic ffmpeg/MoviePy/local scripts for simple concat, subtitle burn-in, TTS/BGM mixing, proxying, and low-motion localization
- use a `vlog-cut`-style ffmpeg rough-cut pipeline when the job is narration-led and the needed output is a reviewable rough cut from `script/timing + clip index + timeline`; keep explicit human checkpoints after narration, asset index, timeline, rough cut, and subtitles
- prefer Remotion or an equivalent data-driven timeline when the deliverable needs many images/clips, layered captions, labels, BGM/voice, smooth transitions, cards, light leaks, or beat-level visual control
- keep AI video providers focused on short hook/gapfill/source clips; assemble longer final films locally instead of asking one generation task to produce the whole edit
- do not default to one full-length premium generation when segmented generation can preserve originality and reduce cost; reserve premium models for high-attention beats, and route simple product/context/CTA beats to cheaper generation or local rendering
- when using any structured local renderer, keep shots as a structured table or `timeline.json` and run asset-reference, still-frame, stream, and decode checks before delivery

### 7. Review

Write:

- pass / revise
- what worked
- what failed
- earliest stage to roll back to

### 8. Local Writeback

Write only to the local repo memory and artifacts.

Do not write directly to shared promoted memory from a normal task flow.

## Narration-Driven Rough Cut Contract

When a task is `script or narration + folder of raw clips -> rough cut`, use this shared contract unless a repo has a stricter local one:

1. Build or verify narration timing first: `script.json` plus TTS, or user audio plus alignment, should produce `timing.json` and a canonical narration track.
2. Build a clip index before choosing shots: probe metadata, extract representative frames, create contact sheets, and mark each clip with `scene`, `description`, `tags`, `usable`, optional `chapters`, and optional `highlight`.
3. Draft a deterministic baseline timeline, then let Codex refine it by inspecting the contact sheets. The timeline must be machine-readable and include per-line shot choices with `file`, `in`, `dur`, and `why`.
4. Validate before rendering: source files exist, clip windows stay within source duration, shot duration covers narration timing, line ids match, and duplicate/reused clips are intentional.
5. Do not auto-render immediately after planning. Stop for timeline review even when validation is clean.
6. After rendering, probe duration/streams and inspect frames from the rendered video itself. If subtitles are requested, treat subtitle split/build/burn as a separate post-rough-cut checkpoint.

# Review Rubric

Use this rubric for cross-project video review.

## Always Decide

Every review must end with one of:

- `pass`
- `revise`

If revise, also name the earliest stage to roll back to.

## Review Questions

### Strategy Fit

- does the video still match the chosen angle?
- is the viewer promise coherent from hook to CTA?

### Script Integrity

- did the final output preserve the approved script logic?
- did shot choices weaken or distort the proof chain?
- did execution stay within the single approved version scope, unless the user asked for more?

### Proof Quality

- is proof explicit and honest?
- is anything being implied that the footage does not support?
- were weak-evidence events handled as narration, cards, atmosphere, or fallback visuals instead of fake proof?
- were excluded assets kept out?
- were duplicate assets reduced instead of padding the body?

### Audio And Caption Fit

- if TTS is used, does it sound like continuous speech rather than chopped sentence fragments?
- do TTS and subtitle timing come from the same timing source?
- is BGM ducked enough to keep voice intelligible?

### Platform Fit

- does the pacing fit the platform?
- is the CTA natural for the platform?
- do audio choices include both `bgm` and voice/sound support when the output is meant to ship with sound?

### Render Integrity

- did pre-render checks verify asset references and media extensions?
- were problematic phone videos, HEVC files, Live Photos, or rotated clips proxied or avoided?
- did final review inspect frames from the rendered video itself, not only timeline stills?
- did final media contain expected video and audio streams and fully decode?
- if the edit had many clips, captions, and transitions, did it use a data-driven timeline such as Remotion or an equivalent structured renderer instead of fragile ad hoc command chains?

### Approval Discipline

- was the script explicitly confirmed before generation?
- was any paid step explicitly approved before spend?

### Reuse Value

- is there any repeatable learning worth staging for shared promotion?

## Review Output

Write:

- pass / revise
- what worked
- what failed
- earliest rollback stage
- reusable learning candidate, if any


## Narration-driven rough cut review

For `script/audio + raw clips -> rough cut` workflows, review these before calling the cut usable:

- narration timing was approved before shot assignment
- asset index and contact sheets were spot-checked, including unusable clips and duplicate groups
- timeline choices are machine-readable and each shot has a reason, not just a visual guess
- validator or equivalent checks passed: files exist, `in + dur` fits source duration, shot coverage meets narration duration, and line ids match timing
- the render was probed and frame-checked from the final mp4, not only from cached segments or source stills
- subtitle burn-in, if requested, was handled after rough-cut approval with its own split/build/burn review loop

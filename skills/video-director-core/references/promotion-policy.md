# Promotion Policy

Shared memory should contain only stable reusable video knowledge.

## Promotion Threshold

Promote only when at least one is true:

1. repeated in at least `2` independent runs
2. seen in at least `2` repos
3. clearly a workflow rule instead of a taste preference

## Good Promotion Candidates

- stage gates
- routing rules
- review heuristics
- recurring failure patterns
- reusable cross-project process defaults

## Reject From Promotion

- product-specific proof language
- account persona specifics
- one-off hooks or CTAs
- campaign tactics
- provider quirks without stable evidence

## Flow

1. local task writes only local memory
2. local review curates shared candidates into `docs/shared/video-core-candidates.yaml`
3. `scripts/promote_learning.py` validates and dedupes candidates
4. accepted items are written into `memory/promoted-learnings.yaml`

#!/usr/bin/env python3

from __future__ import annotations

import sys
from pathlib import Path

import yaml


REQUIRED_TOP_LEVEL = {
    "id",
    "title",
    "rule",
    "type",
    "scope",
    "evidence",
    "confidence",
    "status",
    "promoted_at",
}
ALLOWED_TYPES = {"hard_rule", "playbook_rule", "review_rule", "failure_pattern"}
ALLOWED_SCOPE = {"cross_repo"}
ALLOWED_STATUS = {"proposed", "rejected", "promoted"}


def load_yaml(path: Path):
    with path.open("r", encoding="utf-8") as fh:
        data = yaml.safe_load(fh)
    if data is None:
        return []
    return data


def validate_candidate(candidate: dict, path: Path, index: int) -> list[str]:
    errors: list[str] = []
    missing = REQUIRED_TOP_LEVEL - set(candidate)
    if missing:
        errors.append(f"{path}:{index} missing keys: {', '.join(sorted(missing))}")

    extra = set(candidate) - REQUIRED_TOP_LEVEL
    if extra:
        errors.append(f"{path}:{index} unexpected keys: {', '.join(sorted(extra))}")

    if candidate.get("type") not in ALLOWED_TYPES:
        errors.append(f"{path}:{index} invalid type: {candidate.get('type')!r}")
    if candidate.get("scope") not in ALLOWED_SCOPE:
        errors.append(f"{path}:{index} invalid scope: {candidate.get('scope')!r}")
    if candidate.get("status") not in ALLOWED_STATUS:
        errors.append(f"{path}:{index} invalid status: {candidate.get('status')!r}")

    evidence = candidate.get("evidence")
    if not isinstance(evidence, dict):
        errors.append(f"{path}:{index} evidence must be a mapping")
        return errors

    repos = evidence.get("repos")
    runs = evidence.get("runs")
    if not isinstance(repos, list) or not repos:
        errors.append(f"{path}:{index} evidence.repos must be a non-empty list")
    if not isinstance(runs, list) or not runs:
        errors.append(f"{path}:{index} evidence.runs must be a non-empty list")
    return errors


def main(argv: list[str]) -> int:
    if len(argv) < 2:
        print("usage: validate_candidates.py <candidate-file> [<candidate-file> ...]", file=sys.stderr)
        return 1

    all_errors: list[str] = []
    for raw in argv[1:]:
        path = Path(raw).expanduser()
        data = load_yaml(path)
        if not isinstance(data, list):
            all_errors.append(f"{path}: top-level YAML must be a list")
            continue
        for index, candidate in enumerate(data, start=1):
            if not isinstance(candidate, dict):
                all_errors.append(f"{path}:{index} candidate must be a mapping")
                continue
            all_errors.extend(validate_candidate(candidate, path, index))

    if all_errors:
        for error in all_errors:
            print(error, file=sys.stderr)
        return 1

    print("candidate files are valid")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))

#!/usr/bin/env python3

from __future__ import annotations

import argparse
import sys
from datetime import date
from pathlib import Path

import yaml


ROOT = Path(__file__).resolve().parents[1]
PROMOTED_PATH = ROOT / "memory" / "promoted-learnings.yaml"
DEFAULT_CANDIDATES = [
    Path("docs/shared/video-core-candidates.yaml"),
]
REJECT_PATTERNS = (
    "product-specific",
    "account persona",
    "one-off hook",
    "one-off cta",
    "campaign tactic",
    "provider quirk",
)


def load_yaml(path: Path):
    if not path.exists():
        return []
    with path.open("r", encoding="utf-8") as fh:
        data = yaml.safe_load(fh)
    if data is None:
        return []
    return data


def save_yaml(path: Path, data) -> None:
    with path.open("w", encoding="utf-8") as fh:
        yaml.safe_dump(data, fh, allow_unicode=True, sort_keys=False)


def should_promote(candidate: dict) -> bool:
    status = candidate.get("status")
    if status != "proposed":
        return False

    rule_text = str(candidate.get("rule", "")).lower()
    title_text = str(candidate.get("title", "")).lower()
    haystack = f"{title_text} {rule_text}"
    if any(pattern in haystack for pattern in REJECT_PATTERNS):
        return False

    evidence = candidate.get("evidence") or {}
    repos = evidence.get("repos") or []
    runs = evidence.get("runs") or []
    candidate_type = candidate.get("type")
    if len(set(repos)) >= 2:
        return True
    if len(runs) >= 2:
        return True
    return candidate_type == "hard_rule"


def merge_candidates(paths: list[Path]) -> tuple[list[dict], list[str]]:
    merged: dict[str, dict] = {}
    notes: list[str] = []

    for path in paths:
        data = load_yaml(path)
        if not isinstance(data, list):
            notes.append(f"skip non-list candidate file: {path}")
            continue
        for candidate in data:
            if not isinstance(candidate, dict) or "id" not in candidate:
                notes.append(f"skip malformed candidate in {path}")
                continue
            existing = merged.get(candidate["id"])
            if existing is None:
                merged[candidate["id"]] = candidate
                continue

            existing_evidence = existing.setdefault("evidence", {})
            new_evidence = candidate.get("evidence") or {}
            existing_repos = list(dict.fromkeys((existing_evidence.get("repos") or []) + (new_evidence.get("repos") or [])))
            existing_runs = list(dict.fromkeys((existing_evidence.get("runs") or []) + (new_evidence.get("runs") or [])))
            existing_evidence["repos"] = existing_repos
            existing_evidence["runs"] = existing_runs
            if candidate.get("confidence") == "high":
                existing["confidence"] = "high"
    return list(merged.values()), notes


def main(argv: list[str]) -> int:
    parser = argparse.ArgumentParser(description="Promote stable cross-repo video learnings.")
    parser.add_argument("--candidate", action="append", default=[], help="Candidate YAML file path.")
    parser.add_argument("--apply", action="store_true", help="Write promoted learnings to memory/promoted-learnings.yaml")
    args = parser.parse_args(argv[1:])

    candidate_paths = [Path(p).expanduser() for p in args.candidate] if args.candidate else DEFAULT_CANDIDATES
    candidates, notes = merge_candidates(candidate_paths)
    promoted_existing = load_yaml(PROMOTED_PATH)
    existing_by_id = {item["id"]: item for item in promoted_existing if isinstance(item, dict) and "id" in item}

    promoted_now: list[dict] = []
    today = date.today().isoformat()
    for candidate in candidates:
        if not should_promote(candidate):
            continue
        item = dict(candidate)
        item["status"] = "promoted"
        if not item.get("promoted_at"):
            item["promoted_at"] = today if args.apply else "pending-review"
        existing_by_id[item["id"]] = item
        promoted_now.append(item)

    final_items = sorted(existing_by_id.values(), key=lambda item: item["id"])
    for note in notes:
        print(f"[note] {note}")
    print(f"[promote_learning] scanned {len(candidate_paths)} files")
    print(f"[promote_learning] promotable items: {len(promoted_now)}")

    if args.apply:
        save_yaml(PROMOTED_PATH, final_items)
        print(f"[promote_learning] wrote {PROMOTED_PATH}")
    else:
        for item in promoted_now:
            print(f"- {item['id']}: {item['title']}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))

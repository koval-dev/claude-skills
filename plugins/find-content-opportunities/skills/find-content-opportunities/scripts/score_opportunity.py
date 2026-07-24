#!/usr/bin/env python3
"""Score a content opportunity from a JSON file or stdin."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any


WEIGHTS = {
    "customer_problem_severity": 15,
    "profitable_service_relevance": 15,
    "demonstrated_demand": 15,
    "existing_results_weakness": 10,
    "business_authority": 10,
    "primary_source_support": 10,
    "conversion_and_internal_links": 10,
    "linkability": 5,
    "topical_authority_value": 5,
    "maintenance_feasibility": 5,
}

DEDUCTION_MAXIMA = {
    "cannibalization": 20,
    "legal_or_reputational_risk": 15,
    "unclear_intent": 10,
    "production_cost_weak_payoff": 10,
    "temporary_news_value": 10,
}

EDITORIAL_ROUTES = {
    "create",
    "update-existing",
    "merge",
    "narrow",
    "monitor",
    "reject",
}


class InputError(ValueError):
    """Raised for an invalid scoring payload."""


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Calculate the weighted score for one content opportunity."
    )
    parser.add_argument(
        "input",
        nargs="?",
        help="JSON input path. Read stdin when omitted or set to '-'.",
    )
    parser.add_argument(
        "--compact",
        action="store_true",
        help="Print compact JSON instead of indented JSON.",
    )
    return parser.parse_args()


def read_payload(input_path: str | None) -> dict[str, Any]:
    if input_path in (None, "-"):
        raw = sys.stdin.read()
    else:
        raw = Path(input_path).read_text(encoding="utf-8")

    try:
        payload = json.loads(raw)
    except json.JSONDecodeError as exc:
        raise InputError(f"Invalid JSON: {exc}") from exc

    if not isinstance(payload, dict):
        raise InputError("The top-level JSON value must be an object.")
    return payload


def require_number(value: Any, label: str, minimum: float, maximum: float) -> float:
    if isinstance(value, bool) or not isinstance(value, (int, float)):
        raise InputError(f"{label} must be a number from {minimum:g} to {maximum:g}.")
    number = float(value)
    if not minimum <= number <= maximum:
        raise InputError(f"{label} must be from {minimum:g} to {maximum:g}.")
    return number


def threshold(score: float) -> str:
    if score >= 80:
        return "priority-production"
    if score >= 65:
        return "viable-after-targeted-research"
    if score >= 50:
        return "backlog-narrow-or-combine"
    return "reject"


def calculate(payload: dict[str, Any]) -> dict[str, Any]:
    ratings = payload.get("ratings")
    deductions = payload.get("deductions", {})
    gate_failures = payload.get("hard_gate_failures", [])
    editorial_route = payload.get("editorial_route")

    if not isinstance(ratings, dict):
        raise InputError("'ratings' must be an object containing every criterion.")
    if not isinstance(deductions, dict):
        raise InputError("'deductions' must be an object.")
    if not isinstance(gate_failures, list) or not all(
        isinstance(item, str) and item.strip() for item in gate_failures
    ):
        raise InputError("'hard_gate_failures' must be an array of non-empty strings.")
    if editorial_route is not None and editorial_route not in EDITORIAL_ROUTES:
        raise InputError(
            "'editorial_route' must be one of: "
            + ", ".join(sorted(EDITORIAL_ROUTES))
            + "."
        )

    unknown_ratings = sorted(set(ratings) - set(WEIGHTS))
    unknown_deductions = sorted(set(deductions) - set(DEDUCTION_MAXIMA))
    missing_ratings = sorted(set(WEIGHTS) - set(ratings))

    if unknown_ratings:
        raise InputError(f"Unknown rating keys: {', '.join(unknown_ratings)}")
    if unknown_deductions:
        raise InputError(f"Unknown deduction keys: {', '.join(unknown_deductions)}")
    if missing_ratings:
        raise InputError(f"Missing rating keys: {', '.join(missing_ratings)}")

    criterion_points: dict[str, float] = {}
    normalized_ratings: dict[str, float] = {}
    for key, weight in WEIGHTS.items():
        rating = require_number(ratings[key], f"ratings.{key}", 0, 5)
        normalized_ratings[key] = rating
        criterion_points[key] = round((rating / 5) * weight, 2)

    normalized_deductions: dict[str, float] = {}
    for key, maximum in DEDUCTION_MAXIMA.items():
        value = deductions.get(key, 0)
        normalized_deductions[key] = require_number(
            value, f"deductions.{key}", 0, maximum
        )

    base_score = round(sum(criterion_points.values()), 2)
    deduction_total = round(sum(normalized_deductions.values()), 2)
    final_score = round(max(0, base_score - deduction_total), 2)
    score_threshold = threshold(final_score)
    editorial_decision = (
        editorial_route
        if editorial_route is not None
        else ("reject" if gate_failures else score_threshold)
    )
    if gate_failures and editorial_route is not None:
        note = "The editorial route overrides the numeric threshold because a hard gate failed."
    elif gate_failures:
        note = "A failed hard gate overrides the numeric threshold."
    else:
        note = "Apply cannibalization and owner-page judgment before production."

    return {
        "ratings": normalized_ratings,
        "criterion_points": criterion_points,
        "base_score": base_score,
        "deductions": normalized_deductions,
        "deduction_total": deduction_total,
        "final_score": final_score,
        "threshold": score_threshold,
        "hard_gate_failures": gate_failures,
        "editorial_decision": editorial_decision,
        "note": note,
    }


def main() -> int:
    args = parse_args()
    try:
        result = calculate(read_payload(args.input))
    except (InputError, OSError) as exc:
        print(f"Error: {exc}", file=sys.stderr)
        return 2

    if args.compact:
        print(json.dumps(result, ensure_ascii=False, separators=(",", ":")))
    else:
        print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

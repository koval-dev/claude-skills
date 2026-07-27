#!/usr/bin/env python3
"""dataforseo.py — a thin, dependency-free CLI over the DataForSEO API.

This file contains NO secrets and is safe to publish. Credentials are read from
the environment at run time:

    DATAFORSEO_LOGIN      your API login (usually the account email)
    DATAFORSEO_PASSWORD   your API password from https://app.dataforseo.com/api-access
                          (this is NOT your dashboard account password)

Optional defaults (override per call with flags):

    DATAFORSEO_LOCATION_NAME   default "United States"
    DATAFORSEO_LANGUAGE_NAME   default "English"

Every subcommand prints normalized JSON to stdout. Pass --raw to get the
untouched API response instead.

Subcommands
    search-volume   --keywords "a,b,c"              Google Ads monthly search volume
    keyword-ideas   --keywords "seed1,seed2"        related ideas + volume + difficulty
    ranked-keywords --target example.com            keywords a domain already ranks for
    serp            --keyword "..."                 top organic results for a keyword
    competitors     --target example.com            competitor domains for a target domain

Common options (all subcommands)
    --location-name / --location-code
    --language-name / --language-code
    --raw
"""

from __future__ import annotations

import argparse
import base64
import json
import os
import sys
import urllib.error
import urllib.request

BASE_URL = "https://api.dataforseo.com"
OK = 20000  # DataForSEO success status_code


def fail(message: str) -> "NoReturn":  # type: ignore[name-defined]
    print(f"Error: {message}", file=sys.stderr)
    raise SystemExit(1)


def credentials() -> tuple[str, str]:
    login = os.environ.get("DATAFORSEO_LOGIN")
    password = os.environ.get("DATAFORSEO_PASSWORD")
    if not login or not password:
        fail(
            "DATAFORSEO_LOGIN and DATAFORSEO_PASSWORD are not both set. "
            "Nothing was sent. Export them (or source a gitignored .env) before running. "
            "See the dataforseo-connector skill for setup."
        )
    return login, password


def call(path: str, task: dict) -> tuple[dict, dict]:
    """POST a single task to a DataForSEO live endpoint and return (payload, task0).

    DataForSEO live endpoints take a top-level JSON array of task objects.
    """
    login, password = credentials()
    body = json.dumps([task]).encode("utf-8")
    token = base64.b64encode(f"{login}:{password}".encode("utf-8")).decode("ascii")
    request = urllib.request.Request(
        BASE_URL + path,
        data=body,
        headers={
            "Authorization": "Basic " + token,
            "Content-Type": "application/json",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=180) as response:
            payload = json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", "replace")
        fail(f"DataForSEO HTTP {exc.code}: {detail[:800]}")
    except urllib.error.URLError as exc:
        fail(f"could not reach DataForSEO: {exc.reason}")
    except json.JSONDecodeError as exc:
        fail(f"DataForSEO returned invalid JSON: {exc}")

    if payload.get("status_code") != OK:
        fail(f"DataForSEO API status {payload.get('status_code')}: {payload.get('status_message')}")
    tasks = payload.get("tasks") or []
    if not tasks:
        fail("DataForSEO returned no tasks.")
    task0 = tasks[0]
    if task0.get("status_code") != OK:
        fail(f"DataForSEO task status {task0.get('status_code')}: {task0.get('status_message')}")
    return payload, task0


def loc_lang(args: argparse.Namespace) -> dict:
    fields: dict = {}
    if getattr(args, "location_code", None):
        fields["location_code"] = args.location_code
    else:
        fields["location_name"] = (
            args.location_name or os.environ.get("DATAFORSEO_LOCATION_NAME") or "United States"
        )
    if getattr(args, "language_code", None):
        fields["language_code"] = args.language_code
    else:
        fields["language_name"] = (
            args.language_name or os.environ.get("DATAFORSEO_LANGUAGE_NAME") or "English"
        )
    return fields


def split_keywords(raw: str) -> list[str]:
    keywords = [item.strip() for item in raw.split(",") if item.strip()]
    if not keywords:
        fail("--keywords was empty after parsing.")
    return keywords


def labs_items(task0: dict) -> list:
    result = task0.get("result") or []
    if not result:
        return []
    return result[0].get("items") or []


def cmd_search_volume(args: argparse.Namespace) -> dict:
    task = {"keywords": split_keywords(args.keywords)}
    task.update(loc_lang(args))
    payload, task0 = call("/v3/keywords_data/google_ads/search_volume/live", task)
    if args.raw:
        return payload
    rows = []
    for item in task0.get("result") or []:
        rows.append(
            {
                "keyword": item.get("keyword"),
                "search_volume": item.get("search_volume"),
                "competition": item.get("competition"),
                "competition_index": item.get("competition_index"),
                "cpc": item.get("cpc"),
            }
        )
    return {"command": "search-volume", "count": len(rows), "keywords": rows}


def cmd_keyword_ideas(args: argparse.Namespace) -> dict:
    task = {
        "keywords": split_keywords(args.keywords),
        "limit": args.limit or 100,
        "order_by": ["keyword_info.search_volume,desc"],
    }
    task.update(loc_lang(args))
    payload, task0 = call("/v3/dataforseo_labs/google/keyword_ideas/live", task)
    if args.raw:
        return payload
    rows = []
    for item in labs_items(task0):
        info = item.get("keyword_info") or {}
        props = item.get("keyword_properties") or {}
        intent = item.get("search_intent_info") or {}
        rows.append(
            {
                "keyword": item.get("keyword"),
                "search_volume": info.get("search_volume"),
                "competition": info.get("competition"),
                "cpc": info.get("cpc"),
                "keyword_difficulty": props.get("keyword_difficulty"),
                "search_intent": intent.get("main_intent"),
            }
        )
    return {"command": "keyword-ideas", "count": len(rows), "keywords": rows}


def cmd_ranked_keywords(args: argparse.Namespace) -> dict:
    task = {
        "target": args.target,
        "limit": args.limit or 100,
        "order_by": ["keyword_data.keyword_info.search_volume,desc"],
    }
    task.update(loc_lang(args))
    payload, task0 = call("/v3/dataforseo_labs/google/ranked_keywords/live", task)
    if args.raw:
        return payload
    rows = []
    for item in labs_items(task0):
        data = item.get("keyword_data") or {}
        info = data.get("keyword_info") or {}
        props = data.get("keyword_properties") or {}
        serp = (item.get("ranked_serp_element") or {}).get("serp_item") or {}
        rows.append(
            {
                "keyword": data.get("keyword"),
                "search_volume": info.get("search_volume"),
                "keyword_difficulty": props.get("keyword_difficulty"),
                "rank_absolute": serp.get("rank_absolute"),
                "url": serp.get("url"),
            }
        )
    return {"command": "ranked-keywords", "target": args.target, "count": len(rows), "keywords": rows}


def cmd_serp(args: argparse.Namespace) -> dict:
    task = {"keyword": args.keyword, "depth": args.depth or 10}
    task.update(loc_lang(args))
    payload, task0 = call("/v3/serp/google/organic/live/advanced", task)
    if args.raw:
        return payload
    result = task0.get("result") or []
    items = (result[0].get("items") if result else []) or []
    rows = []
    for item in items:
        if item.get("type") != "organic":
            continue
        rows.append(
            {
                "rank_absolute": item.get("rank_absolute"),
                "domain": item.get("domain"),
                "url": item.get("url"),
                "title": item.get("title"),
                "description": item.get("description"),
            }
        )
    return {"command": "serp", "keyword": args.keyword, "count": len(rows), "results": rows}


def cmd_competitors(args: argparse.Namespace) -> dict:
    task = {
        "target": args.target,
        "limit": args.limit or 30,
        "order_by": ["metrics.organic.etv,desc"],
    }
    task.update(loc_lang(args))
    payload, task0 = call("/v3/dataforseo_labs/google/competitors_domain/live", task)
    if args.raw:
        return payload
    rows = []
    for item in labs_items(task0):
        organic = (item.get("full_domain_metrics") or {}).get("organic") or {}
        rows.append(
            {
                "domain": item.get("domain"),
                "avg_position": item.get("avg_position"),
                "intersections": item.get("intersections"),
                "organic_keywords": organic.get("count"),
                "organic_etv": organic.get("etv"),
            }
        )
    return {"command": "competitors", "target": args.target, "count": len(rows), "competitors": rows}


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="dataforseo.py",
        description="Thin, dependency-free CLI over the DataForSEO API. Credentials come from the environment.",
    )
    subparsers = parser.add_subparsers(dest="command", required=True)

    common = argparse.ArgumentParser(add_help=False)
    common.add_argument("--location-name", help='e.g. "United States" (default) or "Ukraine"')
    common.add_argument("--location-code", type=int, help="numeric location code (overrides --location-name)")
    common.add_argument("--language-name", help='e.g. "English" (default) or "Ukrainian"')
    common.add_argument("--language-code", help="language code, e.g. en (overrides --language-name)")
    common.add_argument("--raw", action="store_true", help="print the raw API response")

    sv = subparsers.add_parser("search-volume", parents=[common], help="Google Ads monthly search volume for exact keywords")
    sv.add_argument("--keywords", required=True, help="comma-separated keywords")
    sv.set_defaults(func=cmd_search_volume)

    ki = subparsers.add_parser("keyword-ideas", parents=[common], help="related keyword ideas with volume and difficulty")
    ki.add_argument("--keywords", required=True, help="comma-separated seed keywords")
    ki.add_argument("--limit", type=int, help="max results (default 100)")
    ki.set_defaults(func=cmd_keyword_ideas)

    rk = subparsers.add_parser("ranked-keywords", parents=[common], help="keywords a domain already ranks for")
    rk.add_argument("--target", required=True, help="domain, e.g. example.com")
    rk.add_argument("--limit", type=int, help="max results (default 100)")
    rk.set_defaults(func=cmd_ranked_keywords)

    sp = subparsers.add_parser("serp", parents=[common], help="top organic results for a keyword")
    sp.add_argument("--keyword", required=True)
    sp.add_argument("--depth", type=int, help="results depth (default 10, max 200)")
    sp.set_defaults(func=cmd_serp)

    co = subparsers.add_parser("competitors", parents=[common], help="competitor domains for a target domain")
    co.add_argument("--target", required=True, help="domain, e.g. example.com")
    co.add_argument("--limit", type=int, help="max results (default 30)")
    co.set_defaults(func=cmd_competitors)

    return parser


def main(argv: list[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    result = args.func(args)
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

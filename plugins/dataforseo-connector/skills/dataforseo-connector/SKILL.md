---
name: dataforseo-connector
description: Fetches live SEO data from the DataForSEO API: Google search volume, keyword ideas with difficulty and intent, keywords a domain already ranks for, live Google SERP top results, and competitor domains. Use when the user asks for search volume, keyword difficulty, ranked keywords, SERP or top-10 results, or competitor domains for a keyword or website, or when content-opportunity research needs measured demand and competitor evidence. Requires DATAFORSEO_LOGIN and DATAFORSEO_PASSWORD environment variables; without them it reports figures as not available instead of guessing.
argument-hint: [keyword-or-domain]
metadata:
  last-reviewed: "2026-10-02"
  reviewed-against: "Claude Code 2.1.285; code.claude.com/docs/en/skills; docs.dataforseo.com/v3 (all five endpoints)"
---

# DataForSEO Connector

Turn a keyword or a domain into real numbers from DataForSEO: monthly search volume, keyword difficulty, ranked keywords, live SERP results, and competitor domains. Return the data; never fabricate a metric.

Use `${CLAUDE_SKILL_DIR}/scripts/dataforseo.py`. It depends only on the Python standard library, so it runs on any machine with Python 3 — no `pip install`. If credentials are missing it sends nothing; say so and mark volume, difficulty, and similar figures as `not available`.

## Credentials

The helper reads two variables from the environment and sends nothing when either is missing:

| Variable | Value |
| --- | --- |
| `DATAFORSEO_LOGIN` | your API login (usually the account email) |
| `DATAFORSEO_PASSWORD` | the API password from https://app.dataforseo.com/api-access — **not** your dashboard account password |

Optional defaults, overridable per call:

| Variable | Default |
| --- | --- |
| `DATAFORSEO_LOCATION_NAME` | `United States` |
| `DATAFORSEO_LANGUAGE_NAME` | `English` |

### Security

- These credentials are personal and paid. Never print them, never write them into a file inside a repository, and never commit them.
- Keep them in a gitignored `.env` (see `.env.example`) or in your shell profile. Shell state does not carry between Bash calls, so load the `.env` in the same command as the script: `set -a; . ./.env; set +a; python3 ${CLAUDE_SKILL_DIR}/scripts/dataforseo.py ...`. Never print the `.env`.
- The connector code contains no secrets and is safe to publish. Anyone installing it must supply their own credentials in their own environment.
- If either variable is missing, the helper stops with a clear message and sends no request. Report that and, when useful, fall back to web search for everything except the figures.

## Commands

Run from any directory:

```bash
python3 ${CLAUDE_SKILL_DIR}/scripts/dataforseo.py <command> [options]
```

| Command | Purpose | Required option |
| --- | --- | --- |
| `search-volume` | Google Ads monthly search volume for exact keywords | `--keywords "a,b,c"` |
| `keyword-ideas` | Related keyword ideas with volume, competition, difficulty, intent | `--keywords "seed1,seed2"` |
| `ranked-keywords` | Keywords a domain already ranks for, with position | `--target example.com` |
| `serp` | Top organic results (URL, domain, title) for a keyword | `--keyword "..."` |
| `competitors` | Competitor domains for a target domain | `--target example.com` |

Common options for every command: `--location-name` / `--location-code`, `--language-name` / `--language-code`, and `--raw` (print the untouched API response). `keyword-ideas`, `ranked-keywords`, and `competitors` also accept `--limit`; `serp` accepts `--depth`.

### Examples

```bash
# Demand for exact terms
python3 ${CLAUDE_SKILL_DIR}/scripts/dataforseo.py search-volume --keywords "bathroom remodel cost, cost to renovate bathroom"

# Expand a seed into related ideas (Ukraine / Ukrainian)
python3 ${CLAUDE_SKILL_DIR}/scripts/dataforseo.py keyword-ideas --keywords "ліцензія на охоронну діяльність" \
  --location-name "Ukraine" --language-name "Ukrainian" --limit 50

# What a competitor already ranks for
python3 ${CLAUDE_SKILL_DIR}/scripts/dataforseo.py ranked-keywords --target competitor.com --limit 100

# Who is on the first page for a query
python3 ${CLAUDE_SKILL_DIR}/scripts/dataforseo.py serp --keyword "how to get a security license" --depth 10

# Competitor domains for your own site
python3 ${CLAUDE_SKILL_DIR}/scripts/dataforseo.py competitors --target example.com
```

## Output

Each command prints normalized JSON to stdout: a `command`, a `count`, and a list of rows with only the fields most decisions need (keyword, search_volume, competition, cpc, keyword_difficulty, rank_absolute, url, domain, etc.). Use `--raw` when you need a field the normalized shape omits.

Read the numbers as reported. A `null` value means DataForSEO returned no figure — treat it as unknown, not zero.

## Reference

Read `references/endpoints.md` when you need a raw field, the `order_by` or limit rules, or the DataForSEO documentation behind a command.

## Notes and limits

- `search-volume` (Google Ads) is rate limited to roughly 12 requests per minute; batch keywords into one call (up to 1,000 per call).
- `keyword-ideas` takes up to 200 seeds; `--limit` is capped at 1,000 for the Labs commands.
- Every call consumes paid API credits. Prefer one batched call over many small ones, and set a sensible `--limit`.
- Location and language strongly affect results. Set them explicitly for non-US work.

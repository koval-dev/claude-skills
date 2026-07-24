---
name: dataforseo-connector
description: Pull real search data from the DataForSEO API — keyword search volume, keyword ideas, the keywords a domain already ranks for, live Google SERP results, and competitor domains. Use when the user asks for search volume, keyword difficulty, ranked keywords, SERP or top-10 results, or competitor domains for a keyword or website, or when another skill needs live demand and competitor evidence. Credentials are read from environment variables; the connector never stores or commits secrets. If credentials are missing, report that clearly instead of inventing numbers.
argument-hint: [keyword-or-domain]
---

# DataForSEO Connector

Turn a keyword or a domain into real numbers from DataForSEO: monthly search volume, keyword difficulty, ranked keywords, live SERP results, and competitor domains. Return the data; never fabricate a metric.

Use `scripts/dataforseo.py`. It depends only on the Python standard library, so it runs on any machine with Python 3 — no `pip install`.

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
- Keep them in a gitignored `.env` (see `.env.example`) or in your shell profile. Load a `.env` before running, e.g. `set -a; . ./.env; set +a`.
- The connector code contains no secrets and is safe to publish. Anyone installing it must supply their own credentials in their own environment.
- If either variable is missing, the helper stops with a clear message and sends no request. Report that to the user and, when useful, fall back to web search — but mark volume, difficulty, and similar figures as `not available` rather than guessing.

## Commands

Run from the skill directory (or give the full path to the script):

```bash
python3 scripts/dataforseo.py <command> [options]
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
python3 scripts/dataforseo.py search-volume --keywords "bathroom remodel cost, cost to renovate bathroom"

# Expand a seed into related ideas (Ukraine / Ukrainian)
python3 scripts/dataforseo.py keyword-ideas --keywords "ліцензія на охоронну діяльність" \
  --location-name "Ukraine" --language-name "Ukrainian" --limit 50

# What a competitor already ranks for
python3 scripts/dataforseo.py ranked-keywords --target competitor.com --limit 100

# Who is on the first page for a query
python3 scripts/dataforseo.py serp --keyword "how to get a security license" --depth 10

# Competitor domains for your own site
python3 scripts/dataforseo.py competitors --target example.com
```

## Output

Each command prints normalized JSON to stdout: a `command`, a `count`, and a list of rows with only the fields most decisions need (keyword, search_volume, competition, cpc, keyword_difficulty, rank_absolute, url, domain, etc.). Use `--raw` when you need a field the normalized shape omits.

Read the numbers as reported. A `null` value means DataForSEO returned no figure — treat it as unknown, not zero.

## Reference

See `references/endpoints.md` for the exact endpoints, request fields, and links to the DataForSEO documentation behind each command.

## Notes and limits

- `search-volume` (Google Ads) is rate limited to roughly 12 requests per minute; batch keywords into one call.
- Every call consumes paid API credits. Prefer one batched call over many small ones, and set a sensible `--limit`.
- Location and language strongly affect results. Set them explicitly for non-US work.

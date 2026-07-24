# DataForSEO endpoints used by this connector

All endpoints are `POST` to `https://api.dataforseo.com` with HTTP Basic auth
(`Authorization: Basic base64(login:password)`). The request body is a **top-level
JSON array** of task objects: `[{ ... }]`. The response wraps results in
`tasks[].result[]`. Success is `status_code == 20000` at both the top level and
the task level. The helper checks both.

| Command | Endpoint | Key request fields | Normalized output fields |
| --- | --- | --- | --- |
| `search-volume` | `/v3/keywords_data/google_ads/search_volume/live` | `keywords[]`, `location_name`/`location_code`, `language_name`/`language_code` | `keyword`, `search_volume`, `competition`, `competition_index`, `cpc` |
| `keyword-ideas` | `/v3/dataforseo_labs/google/keyword_ideas/live` | `keywords[]`, location, language, `limit`, `order_by` | `keyword`, `search_volume`, `competition`, `cpc`, `keyword_difficulty`, `search_intent` |
| `ranked-keywords` | `/v3/dataforseo_labs/google/ranked_keywords/live` | `target` (domain), location, language, `limit`, `order_by` | `keyword`, `search_volume`, `keyword_difficulty`, `rank_absolute`, `url` |
| `serp` | `/v3/serp/google/organic/live/advanced` | `keyword`, location, language, `depth` | `rank_absolute`, `domain`, `url`, `title`, `description` (organic items only) |
| `competitors` | `/v3/dataforseo_labs/google/competitors_domain/live` | `target` (domain), location, language, `limit`, `order_by` | `domain`, `avg_position`, `intersections`, `organic_keywords`, `organic_etv` |

## Field notes

- `search_volume` — average monthly searches. `null` means DataForSEO returned no figure; treat as unknown.
- `competition` — from Labs endpoints it is a 0–1 float; from Google Ads `search-volume` it is `LOW`/`MEDIUM`/`HIGH` with a separate `competition_index` (0–100).
- `keyword_difficulty` — 0–100, difficulty of ranking in the top 10.
- `search_intent` — `informational`, `commercial`, `transactional`, or `navigational`.
- `rank_absolute` — position across the whole SERP (organic + features), not just organic order.
- `intersections` (competitors) — number of keywords the competitor shares with the target domain.
- `organic_etv` — estimated traffic value: modeled monthly organic clicks for that domain.

## Ordering and limits

`order_by` takes `"field,desc"` strings. Defaults set by the helper:

- `keyword-ideas`: `keyword_info.search_volume,desc`
- `ranked-keywords`: `keyword_data.keyword_info.search_volume,desc`
- `competitors`: `metrics.organic.etv,desc`

Pass `--limit` to cap Labs results (max 1000) and `--depth` to set SERP depth
(default 10, max 200). Use `--raw` to inspect any field the normalized output omits.

## Documentation

- Auth: https://docs.dataforseo.com/v3/auth/
- Search volume: https://docs.dataforseo.com/v3/keywords_data/google_ads/search_volume/live/
- Keyword ideas: https://docs.dataforseo.com/v3/dataforseo_labs/google/keyword_ideas/live/
- Ranked keywords: https://docs.dataforseo.com/v3/dataforseo_labs/google/ranked_keywords/live/
- Organic SERP: https://docs.dataforseo.com/v3/serp/google/organic/live/advanced/
- Competitors domain: https://docs.dataforseo.com/v3/dataforseo_labs/google/competitors_domain/live/
- Locations and languages: https://docs.dataforseo.com/v3/dataforseo_labs/locations_and_languages/

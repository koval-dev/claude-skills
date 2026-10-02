# Opportunity model

Contents: Evidence layers · Signal strength · Content types · Intent and journey · Hard gates · Skyscraper gate · Cannibalization test · Scoring model · Candidate selection · Source record

Use this reference to classify evidence, reject weak candidates, score survivors, and choose the correct editorial action.

## Evidence layers

Keep these layers distinct:

1. **Business evidence** — services, margins, sales priorities, customer questions, operational data, expert knowledge, and conversion paths.
2. **Site evidence** — current URLs, page intent, content quality, internal links, impressions, rankings, clicks, engagement, and conversions.
3. **Search evidence** — current result pages, result formats, official sources, competitor coverage, linkable assets, and local relevance.
4. **Demand evidence** — customer language, Search Console, analytics, trends, forums, support records, sales conversations, and third-party keyword data.
5. **Authority evidence** — primary sources, firsthand experience, original data, expert reviewers, and maintainable knowledge.

Do not convert an inference from one layer into a fact in another. A competitor article proves coverage, not demand. A trend proves relative interest, not absolute search volume. A keyword-tool estimate is not a guaranteed audience.

## Signal strength

Prefer signals in roughly this order:

1. repeated customer problems tied to a valuable service;
2. Search Console impressions, clicks, and ranking pages;
3. conversions or assisted conversions from related content;
4. primary-source changes with a defined affected audience;
5. current search results with a clear, material answer gap;
6. internal experts or data that create a unique contribution;
7. reputable third-party keyword, backlink, or trend data;
8. competitor coverage;
9. brainstormed keywords.

Several weaker independent signals may justify research. One weak signal rarely justifies production.

## Content types

Choose the format after understanding the need:

| Type | Best fit |
| --- | --- |
| Skyscraper resource | Broad, durable problem with strong demand, fragmented or weak answers, and a reference-worthy contribution |
| Practical guide | Reader needs a sequence, requirements, documents, examples, or mistakes to avoid |
| Decision or comparison | Reader must choose between meaningful alternatives |
| Regulatory update | A confirmed change affects a defined audience, date, procedure, cost, or risk |
| FAQ or supporting article | One narrow question deserves a distinct informational answer |
| Original-data resource | The business can publish defensible analysis, benchmarks, or recurring observations |
| Checklist, calculator, or template | A reusable asset reduces effort or mistakes and can earn citations |
| Existing-page update | The intent already belongs to a current page |
| Consolidation | Several weak or overlapping URLs should become one stronger owner page |
| Monitor | The signal is credible but facts, timing, or impact are not settled |
| Reject | No useful, defensible, or maintainable opportunity exists |

Do not force a topic into a skyscraper resource. A focused answer can be the strongest result.

## Intent and journey

Assign one primary search intent:

- informational;
- commercial investigation;
- transactional;
- navigational;
- news or change-driven.

Assign one primary customer-journey stage:

- problem recognition;
- initial research;
- requirements;
- comparison;
- preparation;
- purchase;
- post-purchase support.

Secondary intent may be recorded, but the primary owner must be clear.

## Hard gates

Reject or reroute a candidate when any applicable gate fails:

1. **Audience problem:** No meaningful audience problem or decision is present.
2. **Business connection:** The topic has no credible link to a service, customer journey, retention need, or authority goal.
3. **Owner-page fit:** The answer belongs on an existing service, product, location, category, or help page.
4. **Authority:** The business cannot support the central claims with primary sources, firsthand experience, original data, or qualified review.
5. **Answer gap:** Current results already satisfy the need and no material contribution is available.
6. **Distinct intent:** The candidate duplicates an existing page or another proposed candidate.
7. **Maintainability:** The topic is too volatile for the business to keep accurate.
8. **Source independence:** The article would be reconstructed mainly from competitors.
9. **Risk:** Legal, safety, financial, medical, privacy, or reputational risk exceeds likely value or available review.
10. **Production value:** The realistic value does not justify research, expert, design, data, or maintenance cost.

Record the failed gate and route. Do not hide it behind a numeric score.

## Skyscraper gate

Use the `skyscraper resource` label only when every condition passes:

- The problem is broad enough to justify a durable central resource.
- Demand is supported by more than competitor publication.
- Current answers are fragmented, outdated, poorly localized, weakly sourced, or missing a useful resource.
- The business can add a material contribution: firsthand expertise, original data, clearer procedures, a maintained table, a tool, a template, a decision framework, or strong local coverage.
- The page can become a topic-cluster owner without replacing transactional service pages.
- The organization can review and maintain it.
- A realistic distribution or citation path exists.

More words, more headings, or a newer publication date do not pass this gate.

## Cannibalization test

For the candidate and each related page, compare:

- primary query and close variants;
- user intent;
- journey stage;
- promised answer;
- conversion action;
- source of authority;
- likely internal anchor text.

Use these routes:

| Finding | Route |
| --- | --- |
| Same intent and same answer | Update or merge |
| Service page owns transactional intent; candidate is informational | Keep both with a strict boundary and reciprocal links |
| Candidate is a subsection of a stronger owner page | Add the subsection |
| Several thin pages split one problem | Consolidate |
| Similar terms but different audience problem | Separate pages may be valid |

## Scoring model

Rate each positive criterion from 0 to 5. The scoring script converts the rating to its weighted points.

| Criterion key | Meaning | Weight |
| --- | --- | ---: |
| `customer_problem_severity` | Frequency, cost, urgency, confusion, or risk of the problem | 15 |
| `profitable_service_relevance` | Connection to commercially or strategically valuable services | 15 |
| `demonstrated_demand` | Strength and independence of observed demand signals | 15 |
| `existing_results_weakness` | Size of the material gap in current answers | 10 |
| `business_authority` | Firsthand expertise, data, cases, or qualified review | 10 |
| `primary_source_support` | Ability to ground central claims in authoritative sources | 10 |
| `conversion_and_internal_links` | Clear next step and useful relationship to owner pages | 10 |
| `linkability` | Likelihood that the resource, tool, data, or framework earns citations | 5 |
| `topical_authority_value` | Contribution to a coherent, non-duplicative topic cluster | 5 |
| `maintenance_feasibility` | Ability to keep the content accurate at reasonable cost | 5 |

Apply deductions from 0 to the listed maximum:

| Deduction key | Maximum |
| --- | ---: |
| `cannibalization` | 20 |
| `legal_or_reputational_risk` | 15 |
| `unclear_intent` | 10 |
| `production_cost_weak_payoff` | 10 |
| `temporary_news_value` | 10 |

Thresholds:

- 80–100: priority production;
- 65–79.99: viable after targeted research;
- 50–64.99: backlog, narrow, or combine;
- below 50: reject.

Scores support judgment. A failed gate overrides the score. A cannibalization finding may route a high-scoring idea to an existing page.

### Scoring-tool input

Pass JSON with all ratings. Deductions default to zero. Add `hard_gate_failures` and an `editorial_route` when a candidate must be rerouted.

```json
{
  "ratings": {
    "customer_problem_severity": 5,
    "profitable_service_relevance": 5,
    "demonstrated_demand": 4,
    "existing_results_weakness": 4,
    "business_authority": 5,
    "primary_source_support": 5,
    "conversion_and_internal_links": 5,
    "linkability": 4,
    "topical_authority_value": 5,
    "maintenance_feasibility": 4
  },
  "deductions": {
    "cannibalization": 0
  },
  "hard_gate_failures": [],
  "editorial_route": "create"
}
```

Allowed editorial routes are `create`, `update-existing`, `merge`, `narrow`, `monitor`, and `reject`.

## Candidate selection

Rank by final score, then apply editorial judgment:

- avoid multiple priority candidates for the same intent;
- prefer candidates with independent evidence from several layers;
- prioritize a current-page improvement when it can capture the opportunity faster and more cleanly;
- favor distinctive assets and firsthand knowledge over summarized competitor content;
- treat maintenance cost as part of production, not an afterthought;
- keep a reasoned reject list to prevent weak ideas from resurfacing without new evidence.

## Source record

For every material source, record:

- title and publisher;
- direct URL or supplied file reference;
- publication or effective date when available;
- access date for live sources;
- claim or signal supported;
- source class: official, business-provided, first-party metric, independent research, competitor, community, or inference;
- limitation or uncertainty.

For legal or regulatory topics, distinguish enacted rules, published guidance, proposals, announcements, and interpretations.

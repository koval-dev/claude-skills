# Output contract

Produce enough detail for approval and downstream writing without repeating the research.

## Business brief

Use a supplied project brief when available. When none exists, create a compact working brief using `assets/business-brief-template.md`.

State which fields are:

- user-provided;
- observed on the live site;
- supported by business data;
- inferred;
- unknown.

Do not convert the working brief into an invented brand strategy.

## Discovery report

Return sections in this order.

### 1. Research scope

- business, site, geography, language, and audience;
- services or customer journeys reviewed;
- evidence sources available and missing;
- date of the search-result and source review.

### 2. Priority decisions

Use a table:

| Priority | Working title | Decision | Content type | Audience problem | Related service | Score | Main reason |
| ---: | --- | --- | --- | --- | --- | ---: | --- |

Keep this short. Put evidence and caveats in each opportunity brief.

### 3. Opportunity briefs

Complete one brief per priority candidate using `assets/opportunity-brief-template.md`.

Every brief must state:

- why the topic deserves a URL or an update;
- observed evidence of demand;
- what current results do well;
- the material answer gap;
- the business’s unique and credible contribution;
- the owner-page and cannibalization decision;
- primary sources and evidence gaps;
- conversion path, internal links, risk, and maintenance;
- score breakdown and recommendation.

Use `not available` rather than inventing a metric.

### 4. Update, merge, monitor, and reject decisions

Use a compact table:

| Candidate | Route | Reason | New evidence needed to reconsider |
| --- | --- | --- | --- |

Include high-scoring candidates routed to an existing page.

### 5. Recommended production order

State:

1. which page to create or update first;
2. what research or expert input must be collected;
3. what page should receive or own the conversion;
4. which downstream writing skill should receive the approved brief.

Do not draft the article.

## Opportunity-brief field rules

### Evidence of demand

Separate evidence by source:

- customer evidence;
- first-party search or analytics;
- current search results;
- trend or keyword data;
- regulatory or deadline trigger.

Record actual values and date ranges when supplied. Never replace missing data with adjectives such as “high-volume” or “popular.”

### Current-results review

Name representative result pages and describe the useful coverage and material gaps. Search-result weakness must be concrete:

- dated or superseded information;
- fragmented steps;
- missing local or audience-specific rules;
- claims without primary sources;
- poor comparison or decision support;
- absent tool, template, data, example, or edge case;
- unclear ownership between informational and transactional pages.

### Unique contribution

Describe the asset the business can add, such as:

- firsthand process knowledge;
- qualified expert review;
- original cases or anonymized operational data;
- maintained requirements or deadline table;
- calculator, checklist, decision tree, or template;
- local-language or jurisdiction-specific synthesis of primary sources;
- documented mistakes and prevention steps.

“More complete” is not a contribution until the missing material is named.

### Cannibalization

Identify:

- owner URL or proposed owner;
- overlapping pages;
- primary intent of each;
- boundary between informational and transactional content;
- merge, update, or internal-link action.

### Score

Include:

- criterion ratings from 0 to 5;
- weighted base score;
- each deduction;
- final score;
- failed gates, if any;
- editorial route.

Do not score a rejected candidate as if it passed.

### Sources

List primary sources first. Place direct links next to the claims they support in narrative responses. In YAML or file outputs, preserve the source record defined in `references/opportunity-model.md`.

## Handoff

The handoff package consists of:

1. completed opportunity brief;
2. source record;
3. owner-page and cannibalization boundary;
4. open questions and required expert input;
5. recommended content type and unique contribution;
6. time-sensitive facts that must be revalidated.

The downstream writing skill owns article structure, voice, drafting, fact-checking, and final editorial QA. It must not silently widen the topic boundary.

---
name: find-content-opportunities
description: Discovers, researches, classifies, scores, and prioritizes evidence-backed content opportunities for a business before drafting begins. Use when the user asks for article ideas, skyscraper opportunities, content gaps, topic clusters, topical-authority plans, competitor or search-result gaps, regulatory content opportunities, editorial roadmaps, or a decision to create, update, merge, narrow, monitor, or reject a topic. Produce research-backed opportunity briefs that can be approved and passed to a separate article-writing skill. Do not use this skill to draft the final article.
argument-hint: [service-or-topic]
---

# Find Content Opportunities

Find topics where audience need, business value, credible authority, and a weak or missing answer intersect. Return editorial decisions and evidence-backed briefs, not a generic keyword list.

Keep discovery separate from article production. Stop after the opportunity brief unless the user explicitly asks to continue with a writing skill.

## Required resources

Read these files completely before researching:

- [references/opportunity-model.md](references/opportunity-model.md) for evidence rules, content types, gates, scoring, and decision logic.
- [references/output-contract.md](references/output-contract.md) for the business brief and final deliverable.

Use the templates when a project lacks a reusable brief:

- [assets/business-brief-template.md](assets/business-brief-template.md)
- [assets/opportunity-brief-template.md](assets/opportunity-brief-template.md)

Use `scripts/score_opportunity.py` to score surviving candidates when a run compares more than one candidate or when a reproducible score is requested.

## Working boundary

- Treat business strategy, audience problems, site inventory, search results, and source quality as separate evidence layers.
- Do not draft an article, outline prose in article voice, or inflate an announcement into evergreen content.
- Do not treat word count, traffic potential, or competitor coverage alone as a reason to publish.
- Never invent search volume, conversion rates, ranking difficulty, revenue, backlink counts, or customer demand.
- Label hypotheses and unavailable evidence.
- Prefer updating, merging, narrowing, monitoring, or rejecting a topic when a new URL is not justified.

## Workflow

### 1. Ground the business

Load a project business brief if one exists. If it is missing, build the minimum viable brief from user context, the live website, and supplied business data.

Resolve:

- profitable or strategically valuable services;
- primary audiences, geography, and language;
- events that cause customers to seek help;
- customer questions, obstacles, risks, and alternatives;
- expertise, firsthand data, and people available for review;
- conversion goals and relevant service pages;
- existing articles and other indexable pages;
- excluded subjects and legal, factual, or brand risks;
- available evidence sources and downstream writing skill.

Ask only for missing facts that would materially change the decision. Mark other gaps as unknown and continue.

### 2. Inventory the current website

Inspect the live site, sitemap, CMS export, content inventory, or supplied files. Record:

- service and commercial pages;
- articles, guides, FAQs, tools, and downloadable resources;
- duplicated or overlapping intent;
- weak pages that should be improved before creating a new URL;
- internal-link gaps;
- dated claims and maintenance liabilities.

Do not infer absence from a site-navigation menu alone. Search the domain or inspect a sitemap when possible.

### 3. Build demand chains

Start from services and customer events rather than isolated keywords.

For each valuable service, map:

`trigger → problem recognition → requirements → comparison → preparation → purchase → post-purchase`

At each stage, capture:

- questions;
- costly mistakes;
- documents, prices, timelines, and eligibility;
- decisions and alternatives;
- recurring support needs;
- credible resources the audience may save, cite, or share.

### 4. Collect opportunity signals

Use current evidence. Search the web when the task depends on live search results, competitors, laws, products, prices, or trends.

Gather the strongest available signals:

- existing-site gaps and declining or thin pages;
- Search Console queries and pages;
- analytics and conversion paths;
- current search results and result formats;
- competitor coverage and structural weaknesses;
- primary official sources and announced changes;
- customer language from calls, email, support, forms, reviews, forums, and social posts;
- trends, seasonality, and deadlines;
- backlink or citation patterns;
- internal operational data and expert experience.

Use supplied exports or connected data when available. Do not block a discovery run merely because paid SEO tools are unavailable.

### 5. Generate candidates from intersections

Create candidates only when several signals intersect:

`audience problem × business relevance × demand evidence × answer gap × credible authority`

Give each candidate a provisional:

- working title;
- audience and problem;
- search intent and journey stage;
- related service;
- content type;
- unique contribution;
- evidence still required.

Keep weak candidates in a rejected or monitor list instead of padding the main list.

### 6. Review current results

For each serious candidate:

1. Inspect representative current results, prioritizing top organic results, official sources, cited resources, and result features.
2. Identify what the results answer well.
3. Identify material gaps: outdated facts, fragmented instructions, missing edge cases, weak sourcing, poor local relevance, absent tools, or unclear action steps.
4. Define a contribution the business can credibly produce.
5. Reject the candidate if the only advantage is greater length or cosmetic restructuring.

Do not copy a competitor’s structure, wording, claims, or proprietary data.

### 7. Apply hard gates

Run every candidate through the hard gates in `references/opportunity-model.md`.

Route the outcome to one of:

- create;
- update existing page;
- merge or consolidate;
- narrow into supporting content;
- monitor for a trigger;
- reject.

Run the stricter skyscraper gate before using that label.

### 8. Check cannibalization and architecture

Compare the candidate’s primary intent with every relevant service page and article.

State:

- the page that should own the main query;
- what this candidate may answer;
- what it must not duplicate;
- required internal links;
- whether a new URL is defensible.

When a service page already owns the intent, route missing transactional facts to that page. Create supporting content only when it answers a distinct informational problem.

### 9. Score survivors

Score only candidates that pass the gates. Use the scoring tool for consistent arithmetic:

```bash
python3 scripts/score_opportunity.py candidate.json
```

Keep the criterion ratings, evidence notes, deductions, and editorial judgment visible. A high score cannot override a failed gate or a cannibalization finding.

### 10. Select the right portfolio

Rank candidates against one another. Avoid selecting several pages that serve the same intent.

Balance:

- near-term commercial relevance;
- customer-journey coverage;
- authority the business can defend;
- production and maintenance cost;
- evergreen resources and timely updates;
- new pages and improvements to existing content.

Limit the priority list to the number the evidence supports.

### 11. Produce the deliverable

Follow `references/output-contract.md`.

For each priority candidate, include:

- decision and score;
- evidence of demand;
- current-results review;
- unique contribution;
- primary sources;
- service-page boundary;
- conversion and internal-link path;
- research and expert-input gaps;
- maintenance plan and risks.

Use direct source links near the claims they support. Separate observed facts, provided business facts, metrics, and inferences.

### 12. Hand off after approval

After the user approves a candidate:

1. Pass the completed opportunity brief to the named project writing skill.
2. Preserve the topic boundary, source list, unique contribution, and cannibalization rules.
3. Tell the writing skill to recheck time-sensitive claims at drafting time.
4. Produce one article at a time when the downstream skill requires that.

Do not silently invoke the writing phase during discovery.

## Parallel research

Use parallel agents only when the user explicitly requests delegated or parallel work. Divide work by independent evidence stream, such as website inventory, current-results review, official-source verification, or customer-language research. Keep scoring, routing, synthesis, and final recommendations with the main agent.

## Quality check

Before returning:

- Verify every priority candidate has business relevance, evidence, a defensible answer gap, and a clear owner page.
- Check each source supports the nearby claim and record access dates for changeable facts.
- Remove unsupported metrics and vague claims of demand.
- Include update, merge, monitor, and reject decisions when warranted.
- Confirm that a proposed skyscraper resource is materially better and reference-worthy, not merely longer.
- Confirm the deliverable can be passed to a separate writing skill without reconstructing the research.

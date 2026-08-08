# kd-skills

Reusable [Claude Code](https://code.claude.com) skills maintained by koval.dev, distributed as a plugin marketplace so they can be installed on any machine and shared across the team.

## Install

```
/plugin marketplace add koval-dev/claude-skills
/plugin install art-directed-web-design@kd-skills
/plugin install find-content-opportunities@kd-skills
/plugin install dataforseo-connector@kd-skills
/plugin install task-management@kd-skills
/plugin install fix-mobile-ux@kd-skills
```

Restart Claude Code (or run `/plugin`) if a newly installed skill doesn't show up immediately.

## Update

```
/plugin marketplace update kd-skills
```

## Auto-enable for a project / team

Commit this to a project's `.claude/settings.json` and teammates get the marketplace and skill automatically on first trust:

```json
{
  "extraKnownMarketplaces": {
    "kd-skills": {
      "source": { "source": "github", "repo": "koval-dev/claude-skills" },
      "autoUpdate": true
    }
  },
  "enabledPlugins": {
    "art-directed-web-design@kd-skills": true
  }
}
```

## Skills

| Plugin | What it does |
| --- | --- |
| `art-directed-web-design` | Turns a working but visually plain semantic page (Astro, HTML, JSX/TSX, Vue, Svelte) into an intentional, typography-led, grid-based composition — implemented directly in place, reusing the project's existing tokens and utilities. |
| `find-content-opportunities` | Researches, scores, and prioritizes evidence-backed content opportunities (skyscraper topics, content gaps, topic clusters) for an existing project, then produces approvable opportunity briefs to hand to a writing skill. Vendor-neutral about data sources. |
| `dataforseo-connector` | A secret-free connector to the DataForSEO API: keyword search volume, keyword ideas, a domain's ranked keywords, live SERP results, and competitor domains. Useful on its own and as a data source other skills build on. |
| `task-management` | Platform-agnostic task management with schema validation, enrichment, and agent-tier routing. Use when creating, validating, enriching, or executing tasks from YAML-based task trackers. |
| `fix-mobile-ux` | Audits and repairs a scoped web UI for mobile usability and a credible iOS/Android native feel — responsive layout, safe areas, touch targets, mobile navigation, sheets, keyboard, and accessibility — inspecting the existing design system and verifying without redesigning unrelated areas. |

## Connectors and credentials

Some plugins are **connectors** — thin wrappers over an external API (for example `dataforseo-connector`). Connectors are safe to publish because they contain **no secrets**: they read credentials from environment variables at run time. To use one, set its variables in your own environment (or a gitignored `.env` you load before running):

```
export DATAFORSEO_LOGIN="your-login"
export DATAFORSEO_PASSWORD="your-api-password"   # from app.dataforseo.com/api-access
```

Never commit real credentials. Each connector ships a `.env.example` template with placeholders only, and this repo's `.gitignore` excludes `.env` files.

Skills stay independent but compose at run time: when both a data connector and a skill that can use its data are installed, the skill draws on the connector automatically — nothing is hardcoded between them. For example, `find-content-opportunities` is vendor-neutral about data sources, so it will use an available keyword/SERP connector such as `dataforseo-connector` for demand and competitor figures and otherwise fall back to web search, without ever inventing numbers.

## Repo layout

```
.claude-plugin/marketplace.json          # marketplace catalog
plugins/<plugin>/.claude-plugin/plugin.json
plugins/<plugin>/skills/<skill>/SKILL.md
```

Adding a skill: drop it under `plugins/<plugin>/skills/<skill>/`, add a `plugin.json`, and list the plugin in `marketplace.json`.

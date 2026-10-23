# kd-skills

Reusable [Claude Code](https://code.claude.com) skills maintained by koval.dev, distributed as a plugin marketplace so they can be installed on any machine and shared across the team.

Codex adaptations of `art-directed-web-design` and `fix-mobile-ux` are available in [codex/](codex/README.md), with separate plugin packages and installation instructions. The mobile skill repairs scoped usability problems while preserving the product's design and behavior. `design-audit` needs no adaptation and installs in Codex and Copilot as-is (see [Codex and Copilot](#codex-and-copilot)).

## Install

```
/plugin marketplace add koval-dev/claude-skills
/plugin install art-directed-web-design@kd-skills
/plugin install find-content-opportunities@kd-skills
/plugin install dataforseo-connector@kd-skills
/plugin install task-management@kd-skills
/plugin install fix-mobile-ux@kd-skills
/plugin install design-audit@kd-skills
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

| Plugin | What it does | Last reviewed |
| --- | --- | --- |
| `art-directed-web-design` | Turns a working but visually plain semantic page (Astro, HTML, JSX/TSX, Vue, Svelte) into an intentional, typography-led, grid-based composition — implemented directly in place, reusing the project's existing tokens and utilities. | 2026-10-02 |
| `find-content-opportunities` | Researches, scores, and prioritizes evidence-backed content opportunities (skyscraper topics, content gaps, topic clusters) for an existing project, then produces approvable opportunity briefs to hand to a writing skill. Vendor-neutral about data sources. | 2026-10-02 |
| `dataforseo-connector` | A secret-free connector to the DataForSEO API: keyword search volume, keyword ideas, a domain's ranked keywords, live SERP results, and competitor domains. Useful on its own and as a data source other skills build on. | 2026-10-02 |
| `task-management` | Validates, enriches, and routes tasks in repos that keep them in a `tasks.yaml` file. Not for GitHub Projects or other external trackers, and never writes into a generated snapshot. | 2026-10-02 |
| `fix-mobile-ux` | Audits and repairs a scoped web UI for mobile usability and a credible iOS/Android native feel — responsive layout, safe areas, touch targets, mobile navigation, sheets, keyboard, and accessibility — inspecting the existing design system and verifying without redesigning unrelated areas. | 2026-10-02 |
| `design-audit` | Reviews a screenshot, live URL, or web UI code through the 12 Gestalt principles, visual hierarchy and typography, colour and accessibility, layout and spacing, usability heuristics, and consistency, measuring the rendered page when a browser is available. Writes a teaching-oriented report with ranked findings and concrete fixes; never edits files. Also runs in Codex and Copilot. | 2026-10-22 |

## Codex and Copilot

`design-audit` uses only the shared `SKILL.md` format, so the same folder works in other agents. These install paths follow each tool's documentation but have not been tested yet.

- **Codex**: ask Codex to `Use $skill-installer to install design-audit from https://github.com/koval-dev/claude-skills/tree/main/plugins/design-audit/skills/design-audit`, or copy that folder into `~/.agents/skills/` (or a project's `.agents/skills/`).
- **Copilot CLI**: it reads this repo's `.claude-plugin/marketplace.json`:
  ```
  copilot plugin marketplace add koval-dev/claude-skills
  copilot plugin install design-audit@kd-skills
  ```
- **Copilot in VS Code and the Copilot cloud agent**: copy the folder into `~/.copilot/skills/` (also read from `~/.claude/skills/` and `~/.agents/skills/`), or into a repository's `.github/skills/`.

The other plugins are written for Claude Code. Codex versions of two of them are in [codex/](codex/README.md).

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

## License

[MIT](LICENSE). It covers every plugin in this repo, including the Codex packages in `codex/`.

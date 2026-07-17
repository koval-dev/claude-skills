# kd-skills

Reusable [Claude Code](https://code.claude.com) skills maintained by koval.dev, distributed as a plugin marketplace so they can be installed on any machine and shared across the team.

## Install

```
/plugin marketplace add koval-dev/claude-skills
/plugin install art-directed-web-design@kd-skills
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

## Repo layout

```
.claude-plugin/marketplace.json          # marketplace catalog
plugins/<plugin>/.claude-plugin/plugin.json
plugins/<plugin>/skills/<skill>/SKILL.md
```

Adding a skill: drop it under `plugins/<plugin>/skills/<skill>/`, add a `plugin.json`, and list the plugin in `marketplace.json`.

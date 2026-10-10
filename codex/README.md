# koval.dev Codex Skills

Codex adaptations of the Claude skills in the parent repository:

| Package | Version | Purpose |
| --- | --- | --- |
| `art-directed-web-design` | 1.0.0 | Recompose an existing page with typography, grid, and its current design system. |
| `fix-mobile-ux` | 1.0.0 | Repair scoped mobile usability, preserving design and behavior; supports audit-only, plan-only, and strict-scope. |

In `art-directed-web-design`, section headings are unnumbered by default. Newly introduced numbering is limited to one meaningful group per page, such as a process or ranked list. Existing ordered content and explicit user requirements take precedence; dates, statistics, and prices remain intact.

## Install locally as a plugin

From the parent repository root:

```sh
codex plugin marketplace add ./codex
```

Open `/plugins` in Codex CLI, choose `kd-codex-skills`, and install the desired package. Start a new session before using it. The packages and local marketplace follow [OpenAI's plugin packaging guidance](https://developers.openai.com/plugins/build/plugins).

## Install just the skill from GitHub

Ask Codex to install the published skill from `koval-dev/claude-skills`:

```text
Use $skill-installer to install art-directed-web-design from
https://github.com/koval-dev/claude-skills/tree/main/codex/plugins/art-directed-web-design/skills/art-directed-web-design

Use $skill-installer to install fix-mobile-ux from
https://github.com/koval-dev/claude-skills/tree/main/codex/plugins/fix-mobile-ux/skills/fix-mobile-ux
```

Then invoke it with a target route or file:

```text
Use $art-directed-web-design to redesign src/pages/index.astro in place.
Use $fix-mobile-ux on src/pages/checkout; focus on fields and the payment action.
Use $fix-mobile-ux audit-only on src/components/BookingForm.tsx.
Use $fix-mobile-ux plan-only strict-scope on src/pages/dashboard.
```

Alternatively, copy the complete skill folder into a project's `.agents/skills/` directory. Keep `agents/` and `references/` beside `SKILL.md`. See [OpenAI's skill documentation](https://learn.chatgpt.com/docs/build-skills) for discovery and invocation.

## Publish as a separate Codex repository

Use the contents of `codex/` as the new repository root. Its marketplace paths resolve from that root. Once published, users can add the marketplace with `codex plugin marketplace add owner/repo` and install through `/plugins`.

The current parent repository remains the source for the standalone GitHub installation above. If moving to a new repository, update that link to its actual owner, name, branch, and skill path.

## Layout

```text
.agents/plugins/marketplace.json
plugins/<package>/plugin.json
plugins/<package>/skills/<skill>/
  SKILL.md
  agents/openai.yaml
  references/
```

The Codex version has a concise trigger description, Codex UI metadata, and conditional design references. The original Claude packages remain in the parent `plugins/` directory.

`fix-mobile-ux` stays independent of premium design plugins and connectors. If the conversation identifies no target, it asks for one. Ordinary fixes may repair necessary shared dependencies after checking callers; strict-scope reports those required changes without editing them. Audits and plans leave project files unchanged. Responsive viewport checks are reported separately from real-device keyboard, browser chrome, and safe-area checks.

See [mobile skill evaluations](plugins/fix-mobile-ux/evals/README.md) for isolated fixture runs, execution traces, file hashes, and runtime checks. Skill instructions follow [OpenAI's authoring guidance](https://developers.openai.com/plugins/build/skills).

# koval.dev Codex Skills

Codex adaptations of the Claude skills in the parent repository. The first package is `art-directed-web-design`: redesign an existing page in place using its content, typography, grid, and design system.

Section headings are unnumbered by default. Newly introduced numbering is limited to one meaningful group per page, such as a process or ranked list. Existing ordered content and explicit user requirements take precedence; dates, statistics, and prices remain intact.

## Install locally as a plugin

From the parent repository root:

```sh
codex plugin marketplace add ./codex
```

Open `/plugins` in Codex CLI, choose `kd-codex-skills`, and install `art-directed-web-design`. Start a new session before using it. The package and local marketplace follow [OpenAI's plugin packaging guidance](https://developers.openai.com/plugins/build/plugins).

## Install just the skill from GitHub

Ask Codex to install the published skill from `koval-dev/claude-skills`:

```text
Use $skill-installer to install art-directed-web-design from
https://github.com/koval-dev/claude-skills/tree/main/codex/plugins/art-directed-web-design/skills/art-directed-web-design
```

Then invoke it with a target route or file:

```text
Use $art-directed-web-design to redesign src/pages/index.astro in place.
```

Alternatively, copy the complete skill folder into a project's `.agents/skills/` directory. Keep `agents/` and `references/` beside `SKILL.md`. See [OpenAI's skill documentation](https://learn.chatgpt.com/docs/build-skills) for discovery and invocation.

## Publish as a separate Codex repository

Use the contents of `codex/` as the new repository root. Its marketplace paths resolve from that root. Once published, users can add the marketplace with `codex plugin marketplace add owner/repo` and install through `/plugins`.

The current parent repository remains the source for the standalone GitHub installation above. If moving to a new repository, update that link to its actual owner, name, branch, and skill path.

## Layout

```text
.agents/plugins/marketplace.json
plugins/art-directed-web-design/plugin.json
plugins/art-directed-web-design/skills/art-directed-web-design/
  SKILL.md
  agents/openai.yaml
  references/
```

The Codex version has a concise trigger description, Codex UI metadata, and conditional design references. The original Claude packages remain in the parent `plugins/` directory.

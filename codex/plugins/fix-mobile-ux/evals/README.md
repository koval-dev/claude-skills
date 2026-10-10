# Codex mobile usability evaluations

The runner follows [OpenAI's skill evaluation approach](https://developers.openai.com/blog/eval-skills): execute realistic requests, retain JSONL tool traces, check observable artifacts, and grade reports against explicit rubrics. It inherits the configured Codex model and provider for both execution and report grading; it introduces no model routing.

## Run

From the repository root, with authenticated Codex CLI and Node installed:

```sh
python3 codex/plugins/fix-mobile-ux/evals/validate.py
node codex/plugins/fix-mobile-ux/evals/run.mjs --self-check
node codex/plugins/fix-mobile-ux/evals/run.mjs
```

Runtime cases need an existing Playwright installation and Chromium browser. If the module cannot be resolved normally, use `--playwright-module /absolute/path/to/playwright/index.js`. The runner does not download dependencies. The runner's outer process needs permission to launch Chromium and the CLI needs access to its configured provider. Agent sessions use the workspace-write sandbox; the report grader uses read-only. Do not bypass those sandboxes to force a passing result.

Optional arguments:

```sh
node codex/plugins/fix-mobile-ux/evals/run.mjs \
  --case audit-only-component,plan-only \
  --artifacts /tmp/mobile-evals-read-only

node codex/plugins/fix-mobile-ux/evals/run.mjs \
  --case checkout-safe-area-and-keyboard --prepare-only \
  --artifacts /tmp/mobile-evals-checkout

node codex/plugins/fix-mobile-ux/evals/run.mjs \
  --case checkout-safe-area-and-keyboard --grade-only \
  --artifacts /tmp/mobile-evals-checkout
```

`--prepare-only` creates the isolated workspaces without agent calls. To use `--grade-only`, first run Codex in the prepared workspace and save the same `trace.jsonl`, `trace.execution.json`, and `report.md` artifacts as a normal run. It reuses an execution, reruns artifact/browser checks, and calls the report grader. New executions need a fresh artifacts directory to preserve old evidence. `--timeout` sets a per-process limit in seconds (default 900).

The default artifacts directory is a fresh system temporary folder printed at startup. Each case keeps its workspace, original and final SHA-256 file maps, exact prompt, execution trace, stderr, final report, project checks, screenshots, grader input/output/trace, and result JSON. A summary is written after each case. No generated execution artifacts belong in the package. A run invokes Codex once per case and again for successful reports; this uses the configured account's normal usage allowance.

## Cases and observable checks

| Case | Checks |
| --- | --- |
| Checkout | Visible associated labels, field types/input modes/autofill, unrestricted zoom, reachable fields and payment control, form association, target size, no overflow. |
| Navigation | Named controls, touch access, modal initial focus and containment, explicit/Apply/Escape/Back dismissal, focus restoration, subsequent Back leaves the page. |
| Audit-only | Ranked form findings, unchanged complete file hashes, no fix-complete claim. |
| Desktop restyle | Actual about-page edits, no mobile skill body loaded in the trace. |
| Plan-only | Actionable ordered repairs with files and acceptance checks; all project hashes unchanged. |
| Strict scope | A deliberately broken shared payment rule is reported with its callers; shared file unchanged and no competing local workaround. |
| Missing target | Requests a target without inspecting fixture UI content or editing project files. |
| Unavailable browser | Agent obeys the unavailable-tooling condition and reports limitations; the independent harness still checks the repaired checkout. |

The first four cases reuse the original Claude fixtures and scenario intent. The new strict-scope setup adds a shared `display: none !important` payment rule and an About caller only in its temporary workspace. The browser-unavailable case is a capability simulation declared in the fixture instructions: the agent must use code checks even when the outer evaluator can launch Chromium.

The runner installs the skill into the workspace's `.agents/skills` directory. Explicit prompts and a natural-language navigation prompt test invocation. Selection checks require evidence that the skill body was loaded; a catalog mention does not count. Full-file hashes include all workspace files outside `.git`, including installed instructions, and detect additions and deletions. Only scenario-allowed page/shared-style files may change; navigation may also add dashboard test scripts under `scripts/` whose contents reference the scoped source. Those scripts receive semantic review too. Existing project checks remain protected.

Browser checks use 320 × 568 and 390 × 844 portrait, 844 × 390 landscape, and 1280 × 800 desktop viewports. They test runtime reach, focus, and history rather than CSS keyword or `<dialog>` presence. Real-device virtual keyboard, browser chrome, safe areas, native autofill, and Android system Back remain separate, unavailable checks; desktop Chromium history is not hardware validation.

The self-check verifies that the browser grader rejects the planted checkout/navigation defects at every viewport and that full-file changes and additions are detected. Report grading is semantic and may vary; retain its evidence and investigate disagreements before changing instructions. A failed or blocked check exits nonzero. If browser tooling is missing, runtime cases are **blocked**, never passed. Publishing requires all mandatory cases and package checks to pass.

## Validation on 2026-10-10

All eight scenarios passed using the configured `gpt-6.1-sol` model with Codex CLI 0.162.1. Checkout, navigation, and the independent browser-unavailable checkout checks passed in Chromium at all four viewports. Audit-only, plan-only, and missing-target preserved complete file hashes; strict-scope preserved the shared blocker and reported its callers; desktop restyling did not load the mobile skill.

Validation corrected overly strict grader assumptions about email input types, native dialog Tab wrapping, and the location of focused regression tests. The skill's report instruction was clarified to include every changed test and shared file. A navigation rerun and affected artifact regrades passed. The package validator, skill-creator validator, YAML metadata parsing, fixture checks, browser grader self-check, and `git diff --check` passed. The original Claude package was unchanged.

Sandboxed agents could not launch or connect to a browser in this environment, and accurately reported that limitation. The independent evaluator launched local Chromium with permission. Real-device keyboard, browser chrome, native autofill, physical safe areas, and Android system Back were not verified.

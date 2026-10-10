"""Check package metadata, local references, and fixture integrity without agent calls."""
import json
import re
import subprocess
from pathlib import Path

HERE = Path(__file__).resolve().parent
REPO = HERE.parents[3]
PACKAGE = HERE.parent
SKILL = PACKAGE / "skills/fix-mobile-ux"

manifest = json.loads((PACKAGE / "plugin.json").read_text())
assert manifest["name"] == "fix-mobile-ux"
assert manifest["version"] == "1.0.0"
assert not {"mcpServers", "dependencies", "hooks"}.intersection(manifest)
assert not any(str(REPO) in value for value in manifest.values() if isinstance(value, str))

marketplace = json.loads((REPO / "codex/.agents/plugins/marketplace.json").read_text())
entries = [entry for entry in marketplace["plugins"] if entry["name"] == manifest["name"]]
assert len(entries) == 1
assert (REPO / "codex" / entries[0]["source"]["path"]).resolve() == PACKAGE

instructions = (SKILL / "SKILL.md").read_text()
assert instructions.startswith("---\nname: fix-mobile-ux\ndescription: ")
assert not re.search(r"\$ARGUMENTS|/fix-mobile-ux|argument-hint:|Claude|CLAUDE\.md", instructions)
metadata = (SKILL / "agents/openai.yaml").read_text()
assert "allow_implicit_invocation: true" in metadata
assert "dependencies:" not in metadata
fields = dict(re.findall(r'^\s+(\w+): "([^"\n]+)"$', metadata, re.M))
assert 25 <= len(fields["short_description"]) <= 64
assert "$fix-mobile-ux" in fields["default_prompt"]

referenced = set()
for file in SKILL.rglob("*.md"):
    text = file.read_text()
    for target in re.findall(r"\]\(([^)]+)\)", text):
        if re.match(r"https?://", target):
            continue
        path = (file.parent / target.split("#")[0]).resolve()
        assert path.is_relative_to(SKILL), f"Nonportable reference: {file}: {target}"
        assert path.is_file(), f"Missing reference: {file}: {target}"
        referenced.add(path)
assert set((SKILL / "references").glob("*.md")) <= referenced, "Unreachable reference"

cases = json.loads((HERE / "cases.json").read_text())
assert len(cases) == len({entry["id"] for entry in cases}) == 8
original = REPO / "plugins/fix-mobile-ux/evals"
assert {folder.name for folder in original.iterdir() if (folder / "case.yaml").exists()} <= {entry["id"] for entry in cases}
for entry in cases:
    assert entry["prompt"] and entry["rubric"]
    assert not (entry.get("noEdits") and entry.get("scope"))
    assert entry.get("runtime") in (None, "checkout", "navigation")
subprocess.run(["npm", "run", "check"], cwd=original / "_fixture", check=True)
for script in ("run.mjs", "browser-checks.mjs"):
    subprocess.run(["node", "--check", str(HERE / script)], check=True)
print("Metadata, references, eight cases, fixture, and JavaScript syntax passed.")

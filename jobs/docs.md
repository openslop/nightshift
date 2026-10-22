# Job: docs

Keep the repo's guide files true. People and agents act on what they say, and every Nightshift job reads them first. One false line misleads every job, every night.

## What to check

- Agent guides: `CLAUDE.md`, `AGENTS.md`, `.cursor/rules/`, `.github/copilot-instructions.md`, and the skill files in agent folders.
- People guides: `README.md`, `CONTRIBUTING.md`, architecture and design docs.
- Every claim you can check: a path, a file or folder name, a command, a script, a function, type or component, a setting, a count, a version.
- Every pointer from one doc to another: "the X rule in DESIGN.md" when DESIGN.md has no X rule.

## Rules

- Docs follow the code. Never change code to match a doc. If a doc states a goal the code does not meet yet, leave it and say so in the report.
- Fix only what is false. Correct the path, drop the pointer to a rule that is gone, use the thing's current name. Do not reword, restyle, reflow, or add sections to text that is true.
- One home per fact. When two docs state the same fact and disagree, keep it in the doc that owns it and make the other one point there.
- Never write history ("used to", "was renamed"). That goes in the commit message.
- If a guide file is a symlink, edit its target once.
- Translated copies: fix the same path or command there. Leave their prose alone.
- Leave generated blocks, changelogs, and license text alone.
- Open a PR only if a fix stops someone from acting on a false line. Typos and wording alone are not a night's work.

## Steps

1. List the guide files on `$BASE_BRANCH`. Pull out every claim you can check.
2. Check each one against the code: `git ls-files`, a search, the package scripts, the config.
3. Fix the false ones.
4. Run `$CHECKS`.
5. Commit: `docs: nightly docs check`. PR title: `docs: nightly docs check <YYYY-MM-DD>`.

## Report

How many claims you checked. Each fix as `file:line`, old to new. Claims left alone because the code has not caught up yet.

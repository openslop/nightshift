# Job: conventions

Find where the code breaks the repo's own written rules. Fix the safe ones. Flag the rest.

## Rules

- Only fix things that change no behavior tonight. Everything else goes in the `Flagged, not fixed` list for the `conventions-followup` job.
- If the repo has no `CONVENTIONS.md` or similar, use these rules:
  1. Make bad states impossible instead of checking for them.
  2. No one-off special cases. Use a table or a list instead of a chain of `if this kind, do that`.
  3. Small helpers stay plain. The code that puts them together holds the opinions.
  4. Each piece stays small and dumb.
  5. One way to do each thing. No two helpers that do the same job.
  6. When something goes wrong, fail out loud. Never quietly swallow an error.
  7. Code should read like a list of settings.

## Steps

1. Read the repo's rule files. Walk the code. For each break note: file and line, the snippet, the rule, the fix.
2. Apply only the safe, no-behavior-change fixes.
3. Run `$CHECKS`.
4. Commit: `refactor: nightly conventions sweep`. PR title: `refactor: nightly conventions sweep <YYYY-MM-DD>`.
5. In the PR body, add a section `Flagged, not fixed (design-level or behavior change)`. One line per item: file, line, rule, what the fix would be.

## Report

Counts: found, fixed, flagged.

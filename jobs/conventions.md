# Job: conventions

Find where the code breaks the repo's own written rules. Fix the safe ones. Flag the rest.

## Rules

- Only fix things that change no behavior tonight. Everything else goes in the `Flagged, not fixed` list for the `conventions-followup` job.
- If the repo has no `CONVENTIONS.md` or similar, use these rules:
  1. Define errors out of existence. Make the bad state impossible instead of checking for it.
  2. No special-case wiring. Prefer a registry or a table over `if provider === X` chains.
  3. Keep policy out of mechanism. Low-level helpers stay plain. High-level code holds the opinions.
  4. Units stay dumb and small.
  5. One way to do each thing. No duplicate wrappers or validators.
  6. Fail loudly. No silent `catch`. No `catch` that returns `null`.
  7. Code reads like config.

## Steps

1. Read the repo's rule files. Walk the code. For each break note: file and line, the snippet, the rule, the fix.
2. Apply only the safe, no-behavior-change fixes.
3. Run `$CHECKS`.
4. Commit: `refactor: nightly conventions sweep`. PR title: `refactor: nightly conventions sweep <YYYY-MM-DD>`.
5. In the PR body, add a section `Flagged, not fixed (design-level or behavior change)`. One line per item: file, line, rule, what the fix would be.

## Report

Counts: found, fixed, flagged.

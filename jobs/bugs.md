# Job: bugs

Find and fix real bugs a user would notice. Add tests for the paths you touch.

## The bar

Most nights the right answer is no change. That is a good night.
We like simple, short, readable code more than perfect code. A fix that adds a branch, a guard, a flag, or a helper to gain a tiny bit of safety is a loss. Do not open it.

Fix a bug only if one of these is true:

- **Real impact.** A user sees it: a crash, wrong or lost data, a broken flow, a silent failure on a key path, a security hole, a real race or leak.
- **Net simpler.** The fix deletes code, removes a branch, or collapses a special case.
- **Free.** About zero lines changed with zero new complexity: a wrong operator, a flipped condition, a missing dependency in a deps array, a typo in a key.

Do not fix:

- Tiny edge cases that cannot happen in real use.
- `null` or `undefined` risks on paths where the value is always there.
- Guards, `try/catch`, or fallbacks "just in case".
- Cosmetic changes or renames dressed up as fixes.
- Anything whose fix costs more than the bug.

## Steps

1. Hunt for: reading a value that is not there, async work whose errors go nowhere, stale values captured in callbacks, wrong comparisons, cleanup that never runs.
2. Fix only what clears the bar. Fix the root cause. Make the code simpler, not busier.
3. Add tests for the fixed paths. Follow the repo's test style. No boilerplate tests.
4. Run `$CHECKS`.
5. Commit: `fix: nightly bug fixes and tests`. PR title: `fix: nightly bug fixes <YYYY-MM-DD>`.

## Report

List every bug you chose not to fix and why. Zero fixes beats one weak fix.

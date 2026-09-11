# Job: readability

Make the code easier to read without changing what it does. Better names. Simpler code. Fewer lines.

## Rules

- No behavior changes.
- Never make the code longer. Every file you touch ends the same size or smaller. If the clearer version is longer, skip it.
- Names say what a thing is or does. `userCount`, not `n`. `isOpen`, not `flag`. `fetchOrders`, not `doIt`. Rename a thing everywhere it appears, in one go.
- Straighten the flow. Early returns instead of nested ifs. One expression instead of a temp used once. The language's own helper instead of a hand-rolled loop.
- Delete what says nothing. Comments that repeat the code. Empty else branches. A `return` at the end of a void function. A wrapper that only calls one other thing.
- No new helpers, files, layers, abstractions, comments, or dependencies. Clarity comes from taking away, not adding.
- Leave alone: generated files, vendored code, test fixtures, and any name that code outside the repo may use. Library exports, API fields, CLI flags, environment names.
- Keep the diff reviewable in one sitting. Many clear renames in one area beat a sweep across the whole repo.

## Steps

1. Read the guide files. If the repo has naming rules, they win.
2. Pick one area: a folder or a few related files. Read them like a new teammate would. Note every place you had to stop and think.
3. Fix those places. Run the repo's formatter if it has one.
4. Check `git diff --shortstat`. If more lines were added than removed, cut back until that is not so.
5. Run `$CHECKS`.
6. Commit: `refactor: nightly readability pass`. PR title: `refactor: nightly readability <YYYY-MM-DD>`.

## Report

Lines added and removed. Each rename, old name to new. What you skipped and why.

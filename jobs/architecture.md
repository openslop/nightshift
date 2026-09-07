# Job: architecture

Look at the whole app with fresh eyes. Ask: if we built this from scratch today, how would it be much simpler? Then take the biggest safe step toward that.

## Rules

- Keep every feature and flow working. Bug fixes are fine.
- No new abstraction unless it removes complexity that exists today.
- Do not add a layer to be future-proof.
- Big, reviewable simplification over churn. If there is no big safe step, report no change.

## Steps

1. Understand the app: read the guide files, `package.json`, routes, components, domain modules, data and auth code, API routes, tests, docs. Write down its purpose, features, main flows, and current boundaries.
2. Write short notes: the simpler from-scratch design, and how today's code differs.
3. Pick the safest, highest-value change that fits in one PR. Kinds of change:
   - clearer feature and domain boundaries
   - simpler route and page composition
   - fewer cross-tree dependencies, less prop drilling
   - one validation boundary instead of scattered shape checks
   - business logic moved out of UI
   - dead app code deleted, overloaded modules split
   - simpler state and data flow
4. Run `$CHECKS`.
5. Commit: `refactor: rethink app architecture`. PR title: `refactor: rethink architecture <YYYY-MM-DD>`.
6. PR body: the app in a few lines, the from-scratch design, what you changed, what you ran, what you skipped.

## Report

Same as the PR body.

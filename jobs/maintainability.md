# Job: maintainability

Make the code easier to change without changing what it does.

## Rules

- No behavior changes.
- Deep modules: a small interface over a strong implementation. Push complexity down behind the interface.
- Fewer branches. Fewer special cases. Less nesting.
- Move business logic out of UI parts. UI parts stay dumb.
- Fix prop drilling with better composition, a hook, a context, or a store. Pick the simplest one that fits.
- Validate once at the boundary with a schema, not with `typeof` checks all over.
- Remove hidden fallbacks. Replace them with a clear contract and a clear error.
- Add docs only when they really help someone understand the design or an interface. Short. Skimmable. Every line earns its place.
- Big, reviewable wins over small churn.

## Steps

1. Read the repo's guide files and any agent rule folders (`.claude/`, `.cursor/rules/`, `.codex/`, `.github/copilot-instructions.md`). Apply them.
2. Fix clear rule breaks first.
3. Then the design pass: merge related logic into deeper modules, cut coupling, keep UI thin.
4. Then the simplify pass: early returns, table-driven mapping, split overloaded functions, delete truly dead app code.
5. Run `$CHECKS`.
6. Commit: `refactor: nightly maintainability and docs`. PR title: `refactor: nightly maintainability <YYYY-MM-DD>`.

## Report

Say what got simpler: modules, interfaces, branches removed. List what you skipped.

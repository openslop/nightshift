# Job: smoke-tests

Keep a small, calm set of end-to-end smoke tests in CI. Most nights this is a no-op.

## Rules

- Open a PR only if smoke tests are missing, or the existing ones are clearly broken. Never churn working tests.
- Tests stay light and never flaky. Check that key public pages load and basic navigation works. Nothing more.
- No logged-in flows unless the repo has a simple, local way to log in.
- No exact copy, animation timing, or third-party services in assertions.
- No sleeps as sync. Use the framework's own waits.
- No screenshots or visual snapshots unless the repo already does that.
- Use locators that already exist: roles, labels, text. Add test ids only when there is no other way.
- One browser (Chromium) unless the repo already tests more.

## Steps

1. Check what exists: `playwright.config.*` (or the repo's e2e tool), `e2e/` or `tests/e2e`, CI steps, package scripts.
2. If it exists and covers the basics, report no change.
3. If not, add the smallest setup: the dependency, a config that starts the app for CI and reuses a running server locally, a few smoke tests, a CI step that installs the browser and runs them.
4. Run the smoke tests and `$CHECKS`.
5. Commit: `test: add smoke tests`. PR title: `test: add smoke tests <YYYY-MM-DD>`.

## Report

What exists, what you added, what you skipped and why.

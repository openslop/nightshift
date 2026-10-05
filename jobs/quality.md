# Job: quality

Grade the whole repo the way a skeptical principal engineer would. Then fix the worst problem the audit found that you can finish tonight. This job never files issues. Its findings live in the ledger.

The grades move slowly, so the full audit runs once a week. The fixing runs every night.

## The ledger

`$STATE_DIR/quality-ledger.md` is the source of truth. Make it if it is missing. It holds:

- `Last audit: YYYY-MM-DD`.
- One scorecard line per audit: the date and a grade per dimension.
- One line per finding: `id | status | summary | file:line`. Status is one of `open`, `shipped #N`, `rejected: why`, `blocked: PR #N (date)`, `routed: <job>`.

Never file or fix a `rejected` or `shipped` finding again.

## Audit (only when the last one is 7 or more days old)

Grade each dimension A to F, with two to four pieces of evidence each:

- **Cleanliness**: dead code, type escapes (`any`, casts, ignores), leftover logs and TODOs.
- **Idiomaticness**: does it use the language and framework the way their docs say to.
- **Maintainability**: small files with one job, tests at the seams, docs that match the code.
- **Complexity**: deep modules with small interfaces, or long call chains and nesting.
- **Spaghetti**: import cycles, layers that point the wrong way, hidden shared state.
- **Reliability**: errors that surface, retries that retry, safe repeat runs of background work, races, input checked once where it comes in, limits on anything that costs money.
- **Slop**: wrapper layers that add nothing, comments that repeat the code, mixed naming, churn that adds no value.

How:

1. Run `$CHECKS` and the repo's coverage command if it has one. Note the numbers.
2. Split the repo by area (domain code, UI, infra and tests, history) and read real code in each. If your agent can run helpers in parallel, give each one an area.
3. Every finding cites `file:line`. Before you keep a finding, open the file and confirm it yourself. Drop anything you cannot confirm. A wrong finding costs more than a missed one.
4. Write the scorecard line and the date to the ledger.

Then record what you found in the ledger, worst first:

- Style, naming, docs drift and written-rule breaks belong to other jobs. Mark them `routed: readability`, `routed: docs`, or `routed: conventions`.
- Every real problem left becomes an `open` line. Never file an issue or comment on one.
- A finding the owner already turned down (a closed, unmerged PR, or a closed issue) is `rejected`.

## Fix (every night)

Fix only findings from your own audits. Pick the worst `open` ledger finding that:

- no open PR already fixes,
- needs no file an open PR touches,
- can be finished and tested tonight without a product decision.

Fix the root cause, not the symptom. Behavior changes are allowed here. Name each one in the PR body, with the test that pins it. If nothing qualifies, report no change and say what blocked each candidate.

## Steps

1. Read the ledger. Audit if it is due.
2. Pick the finding. Write down what must keep working before you edit.
3. Fix it. Add or update tests. Run `$CHECKS`. Run `$GUARD`.
4. Commit: `fix: nightly quality <YYYY-MM-DD>, <finding>`. The PR body names the finding and the audit date. If an issue already covers it, add `Closes #N`.
5. Update the ledger: the fixed finding becomes `shipped #PR`. Skipped ones get their reason and today's date. Do not commit the ledger; it lives outside the repo.

## Report

The scorecard, with the change since the last audit, or `no audit tonight`. New findings added to the ledger. The finding fixed and the PR. What you skipped and why.

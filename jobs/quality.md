# Job: quality

Grade the whole repo the way a skeptical principal engineer would. Turn each real problem into a tracked issue. Then fix the worst one you can finish tonight.

The grades move slowly, so the full audit runs once a week. The fixing runs every night.

## The ledger

`$STATE_DIR/quality-ledger.md` is the source of truth. Make it if it is missing. It holds:

- `Last audit: YYYY-MM-DD`.
- One scorecard line per audit: the date and a grade per dimension.
- One line per finding: `id | status | issue | summary | file:line`. Status is one of `open`, `shipped #N`, `rejected: why`, `blocked: PR #N (date)`, `routed: <job>`.

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

Then track what you found:

- Style, naming, docs drift and written-rule breaks belong to other jobs. Mark them `routed: readability`, `routed: docs`, or `routed: conventions`. No issue.
- For each real problem left, search open and closed issues for a duplicate. A closed, unplanned issue means `rejected`. A close match gets a comment, not a new issue.
- File at most five new issues per audit, worst first. If the repo ships an issue-filing skill or template in its agent folders, use it. Each issue says what is wrong, where (`file:line`), the fix in one paragraph, and how to check it is done.

## Fix (every night)

Pick the worst `open` finding that:

- has an issue with no open PR linked to it,
- is not labeled for newcomers (`good first issue`, or any label the guide files reserve),
- needs no file an open PR touches,
- can be finished and tested tonight without a product decision.

Fix the root cause, not the symptom. Behavior changes are allowed here. Name each one in the PR body, with the test that pins it. If nothing qualifies, report no change and say what blocked each candidate.

## Steps

1. Read the ledger. Audit if it is due.
2. Pick the finding. Write down what must keep working before you edit.
3. Fix it. Add or update tests. Run `$CHECKS`. Run `$GUARD`.
4. Commit: `fix: nightly quality <YYYY-MM-DD>, <finding>`. PR body starts with `Closes #N`.
5. Update the ledger: the fixed finding becomes `shipped #PR`. Skipped ones get their reason and today's date. Do not commit the ledger; it lives outside the repo.

## Report

The scorecard, with the change since the last audit, or `no audit tonight`. Issues filed. The finding fixed and the PR. What you skipped and why.

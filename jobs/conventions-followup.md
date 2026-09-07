# Job: conventions-followup

The `conventions` job leaves a list called `Flagged, not fixed`. This job works that list. Behavior changes are allowed here. They must be small, deliberate, tested, and named in the PR body.

## Inputs, in order

1. The ledger at `$STATE_DIR/conventions-ledger.md`. One line per flag. Status is one of `open`, `shipped #N`, `rejected: why`, `blocked: PR #N (date)`, `superseded: why`. Make the file if it is missing. Never take a `rejected` or `shipped` item again.
2. The `Flagged, not fixed` sections of past sweep PRs, newest first: `gh pr list --repo $REPO_SLUG --state all --search "nightly conventions sweep in:title" --limit 10 --json number,body`. Add any flag not in the ledger as `open`.
3. `OWNER`'s comments on the last three follow-up PRs. A closed, unmerged PR becomes `rejected` lines in the ledger.

Check every flag against today's code before you touch it. Mark stale ones `superseded`.

## What to take

Pick one theme, not a grab bag. About 3 to 6 flags. About 15 files at most. A reviewer must hold the whole PR in their head.

Order:

1. Likely live bugs: a button that does nothing, a tooltip that cannot open, an error that gets swallowed on a real path.
2. Contract tightening that deletes guards: make the field required, add the union variant, drop the sentinel.
3. Design token fixes. Read the repo's design doc first.
4. Duplication last.

Skip a flag, and record why, if:

- Its files are on the open-PR list. Mark `blocked: PR #N`.
- The fix needs a new dependency, a new layer, a cache or memo shim, or a comment to explain itself. Mark `rejected`.
- The right answer depends on product intent you cannot read from code, docs, or tests. Mark `rejected: needs product call`. Do not guess.
- It is only a rename or a re-sort. Skip it. Trivial PRs get closed.

## How to fix

- The fix is what the repo's rule files say the canonical shape is, not the literal words in the flag.
- If a guard exists only because a type is looser than every producer, tighten the type and delete the guard. Check every reference.
- Switch on a `kind` field, not on a string buried in one variant.
- Move padding, defaults, and layout opinions to the layer that owns them. Move the tests with them.
- A `.catch` that logs and carries on becomes a real error, unless a comment from `OWNER` says the fallback was on purpose.
- Update tests that pinned the old behavior. Add one that pins the new. Never delete a failing test to go green.

## Steps

1. Read the ledger, the sweep PRs, and `OWNER`'s comments.
2. Choose the batch. Write it down, with skip reasons, before you edit.
3. Fix. Run `$CHECKS`. Run `$GUARD`.
4. Commit: `refactor: nightly conventions follow-up <YYYY-MM-DD>, <theme>`. Open the PR with the body below.
5. Update the ledger. Touched flags become `shipped #N`. Skipped flags get their reason and today's date. Add new flags as `open`. Do not commit the ledger; it lives outside the repo.
6. If nothing qualifies, update the ledger anyway and report no change.

## PR body

```
Nightly conventions follow-up. Theme: <theme>.

## Behavior changes
- `<file>`: <before> to <after>. Why: <rule>. Tests: <which>.

## Contract changes
- <type or field made required, union variant added, guard deleted, references updated (count)>

## Flags resolved
- <id>: ...

## Skipped tonight
- <flag>: blocked by PR #N | rejected: <why> | needs product call: <the question>

## Checks
<what ran, all pass>

## Merge-conflict guard
<guard output>
```

# Job: drift

Find places where the repo says one thing and does another. A rule lives in code. Something else restates it: a prompt sent to a model, a tool description, an estimate that copies the real logic, a doc comment, a list typed out by hand. When the code changes, the copy does not. Then a model, a person or another part of the code acts on a rule that no longer exists.

The full audit runs once a week. A fix runs every night.

## What counts

- **Text sent to a model.** System prompts, tool descriptions, tool outputs and error hints, prompt templates. Every claim about a name, an option, a range, a default or how something behaves.
- **Code that mirrors other code.** An estimate or preview that copies what the real path computes. Two checks for the same idea ("is this speech", "where does a scene start") written two ways.
- **Lists and values typed by hand** that a constant, an enum or a schema already holds.
- **Doc comments** that describe behavior the code no longer has.
- **Tests that pin a copy** but would still pass when it disagrees with the real thing.

Guide files (`README.md`, `AGENTS.md` and the like) belong to the `docs` job. Written-rule breaks belong to `conventions`. Mark those `routed:` and leave them.

## The ledger

`$STATE_DIR/drift-ledger.md` is the source of truth. Make it if it is missing. It holds:

- `Last audit: YYYY-MM-DD`.
- One line per finding: `id | status | summary | claim file:line | truth file:line`. Status is one of `open`, `shipped #N`, `intended: why`, `rejected: why`, `blocked: PR #N (date)`, `routed: <job>`, `needs owner: question`.

Never fix a finding that is `intended`, `rejected` or `shipped`.

## Audit (only when the last one is 7 or more days old)

1. Split the search: text sent to models, code that mirrors code, comments and hand-typed lists. If your agent can run helpers in parallel, give each one a part. Each helper reads only and reports.
2. For every claim, find the code that makes it true or false. When you can, run the real function on a small input and compare it to what the copy says.
3. Every finding cites both places, `file:line`, and a concrete case where they disagree. Before you keep a finding, open both files and confirm it yourself. Drop anything you cannot confirm.
4. Write the date and the findings to the ledger, worst first. A model acting on a false rule, or a user seeing the wrong thing, is worse than a comment that is wrong.

## Fix (every night)

Pick the worst `open` finding that no open PR already fixes and that needs no product decision. Fix it at the right depth:

1. **Delete the copy** when nothing needs it.
2. **Derive it** from its source: read the constant, call the real function, generate the list from the schema.
3. **Correct it** only when it has to stay a copy, and then add a test that fails when the two disagree.

Say less rather than more. When a prompt explains a rule the code already enforces, cut the explanation instead of rewriting it.

A finding where the code is wrong and the copy is right is a bug. Fix the code if the copy states what the owner wants. Otherwise mark it `needs owner`.

Several findings with one root cause can ship in one PR. Unrelated ones go in separate nights.

## Steps

1. Read the ledger. Audit if it is due.
2. Pick the finding. Write down what must keep working before you edit.
3. Fix it. Add or update tests. Run `$CHECKS`. Run `$GUARD`.
4. Commit: `fix: nightly drift <YYYY-MM-DD>, <finding>`. The PR body names each claim, what was true, and how the copy now stays true.
5. Update the ledger: the fixed finding becomes `shipped #PR`. Skipped ones get their reason and today's date. Do not commit the ledger; it lives outside the repo.

## Report

The audit summary, or `no audit tonight`. New findings added to the ledger. The finding fixed and the PR. What you skipped and why.

# Job: issues

Take exactly one small, clear GitHub issue and finish it. If none fits, do nothing.

## Rules

- One issue per night, at most.
- Never take an issue labeled `good first issue`. Those are for new contributors.
- Never take an issue labeled `on hold` or `status: on hold`. That means "do not automate".
- Never take an issue labeled extra small (`size: XS`). Leave those for newcomers too.
- Take small or medium issues (`size: S`, `size: M`) with clear acceptance criteria or an obvious fix. Never large.
- Skip issues that need a product call, business context, pricing, policy, legal judgment, or a design direction.
- Skip issues that need secrets, production data, paid services, or another person.
- Skip issues that already have an open PR or an active branch. Check again right before you pick.
- No side refactors. Only the issue.

## Pick order

Small first, then medium. Inside each, highest priority label first (P0, P1, P2, then no label).

```
gh issue list --repo $REPO_SLUG --state open --label "size: S" --limit 30 --json number,title,labels,url
gh issue list --repo $REPO_SLUG --state open --label "size: M" --limit 30 --json number,title,labels,url
```

Label names often have a space after the colon (`size: S`, not `size:S`). Quote them exactly as the repo spells them. If the repo does not use size labels, read the open issues and judge size yourself. Read a candidate with `gh issue view N --repo $REPO_SLUG --json title,body,labels,comments`.

An issue fits if the goal is clear from the body, the code area is easy to find, and you can check it locally with tests or the build.

## Steps

1. List issues. Drop the ones the rules forbid. Read the rest.
2. Pick one. If none fits, report no change with the numbers you skipped and why.
3. Branch: `$BRANCH_PREFIX/issue-<number>-$(date +%Y%m%d-%H%M)`.
4. Make the smallest complete fix. Add a focused test if it is logic.
5. If the issue turns out bigger or fuzzier than it looked, undo your work, leave the tree clean, and report skip.
6. Run `$CHECKS`.
7. Commit with a normal message, like `fix: <what>`. PR body ends with `Closes #<number>`.

## Report

The issue you took or the ones you skipped and why. Also list the `good first issue` ones you left alone.

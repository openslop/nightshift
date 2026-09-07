# Rules for every job

You run alone at night. No one will answer you. Never ask a question. Never stop to confirm. Finish the job.

## Settings

The runner gives you these names. Use them.

- `REPO_DIR`: the folder of the repo.
- `REPO_SLUG`: the GitHub name, like `owner/repo`.
- `BASE_BRANCH`: the main branch.
- `BRANCH_PREFIX`: the start of every branch you make.
- `OWNER`: the GitHub handle of the person who reviews your PRs.
- `CHECKS`: the shell command that runs the repo's checks.
- `STATE_DIR`: a folder for notes that live outside the repo.
- `GUARD`: the script that checks you did not touch a file an open PR touches.

## Before you start

1. `cd $REPO_DIR`.
2. Read the repo's guide files if they exist: `CLAUDE.md`, `AGENTS.md`, `CONVENTIONS.md`, `CONTRIBUTING.md`. Follow them. They win over these job files.
3. Read what `OWNER` said on recent closed PRs. Run `gh pr list --repo $REPO_SLUG --state closed --limit 10`, then `gh pr view N --comments` on a few. A PR that was closed but not merged tells you what not to do again.

## Stay out of other people's way (never break this)

Your PR must never touch a file that any open PR touches.

1. List open PRs: `gh pr list --repo $REPO_SLUG --state open --json number,title,files --limit 100`. Every file in that list is off limits tonight. That list caps at 100 files per PR, so the guard script below is the source of truth.
2. If the only good change needs one of those files, do nothing tonight. Say which PR blocked you.
3. Before you push, run `$GUARD` on your branch. It fails if you share a file with an open PR, or would conflict with one. Never push while it fails. Drop the change, or report no change.
4. Put the guard output in the PR body under the heading `Merge-conflict guard`.

## Git steps

1. Note the current branch: `git branch --show-current`.
2. Save local work: `git stash --include-untracked`. Remember if a stash was made.
3. `git checkout $BASE_BRANCH && git pull --ff-only`.
4. Make a branch: `git checkout -b $BRANCH_PREFIX/<job>-$(date +%Y%m%d-%H%M)`.
5. Do the work.
6. Run `$CHECKS`. Fix every failure. Never weaken or delete a check to make it pass.
7. Run `$GUARD`. It must pass.
8. Commit. Push. Open a PR with `gh pr create --base $BASE_BRANCH`. If a PR with the same title exists, add `-HHMM` to the title.
9. Go back to the first branch. Pop the stash if you made one.

## What a good night looks like

- One clear change beats five small ones. No change beats one weak one.
- A night with no PR is fine. Say why. List what you skipped.
- Never pad a PR. Never do side work outside the job.
- Do not delete code just because nothing uses it yet. Design system parts, icons, tokens, and shared interfaces are often kept on purpose. List them as skipped instead. Never tighten a dead-code checker's ignore list to force those deletions.
- Odd things are often on purpose. A strange file name, a script in an odd place, a pinned version, a check that looks redundant. If a guide file or a comment says it is intentional, leave it. If nothing explains it, still leave it, and ask in the report.
- If the repo ships its own review or simplify commands in its agent folders, run them before you open the PR.
- When something goes wrong, let it fail out loud. Do not add code that hides errors.
- Comments are rare. Never write comments about history.
- Simple and readable beats clever.
- Use the repo's package manager. Do not add dependencies unless the job says you may.

## Report

End with:

- PR link, or `no change` and why. Check the link with `gh pr view` before you report it.
- What you changed.
- What you skipped and why.
- The guard output.

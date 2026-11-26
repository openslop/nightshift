# Address PR feedback

Act on the review feedback a pull request got, fix what is worth fixing, and push it back to the PR's own branch. One PR, then stop.

You run in a worktree of your own, set to the PR's head. The main checkout belongs to other jobs. Never touch it.

## Why you must hold back

The reviewer runs again after you push, and every change you make gives it something new to read. Fix only what clears the bar below. Skipping a comment with a short reason is a good outcome. When nothing clears the bar, push nothing.

## Steps

1. `cd $WORKTREE`. Read the PR: `gh pr view $PR --repo $REPO_SLUG --json title,body,author,headRefName,baseRefName,files`.
2. Read the repo's guide files: `CLAUDE.md`, `AGENTS.md`, `CONVENTIONS.md`, `CONTRIBUTING.md`, plus any they point to and any nested ones in folders the PR touches. They win over this page.
3. Gather every piece of feedback, all three places:
   - Inline threads, with their ids and resolved state:
     ```
     gh api graphql -f query='query($o:String!,$r:String!,$n:Int!){repository(owner:$o,name:$r){pullRequest(number:$n){reviewThreads(first:100){nodes{id isResolved isOutdated path line comments(first:20){nodes{databaseId author{login} body}}}}}}}' -f o=<owner> -f r=<repo> -F n=$PR
     ```
   - Review bodies and the PR conversation: `gh pr view $PR --repo $REPO_SLUG --json reviews,comments`.
   Ignore resolved threads, bot noise (deploy previews, usage limits, coverage), and a plain "lgtm".
4. Triage each piece. Act only if it is all four:
   - **Worth it.** A bug, a race, a broken written rule, a real maintenance trap, an a11y or security hole. Not taste.
   - **In scope.** About this PR's diff, not old code or a new feature.
   - **Still true.** Read the current code. The comment may be on a stale diff or already handled.
   - **Correct.** Verify the claim yourself. Reviewers and bots are often wrong. If the reasoning is wrong but a real problem hides under it, fix that problem.
5. Fix the root cause, not the literal suggestion. Keep the edits tight. Follow the guide files.
6. Install deps with the repo's package manager if they are missing. Run `$CHECKS`. Fix every failure. Never weaken a check.
7. Run every review pass the guide files ask for after a change (for example `/simplify` or a best-practices skill), in the order they list. Use the repo's own skills from its agent folders. Apply what they find inside this PR's diff. Run `$CHECKS` again if anything changed.
8. If you changed something, commit with a short message, then run `$PUSH` exactly. It force-pushes to the PR's branch, and refuses if someone pushed meanwhile. If it refuses, stop and report it. Never push anywhere else.
9. Close the loop on GitHub, after the push (or with no push, if nothing changed):
   - Reply in every unresolved thread you triaged, one short line: what changed and the SHA, or why you skipped it.
     `gh api repos/$REPO_SLUG/pulls/$PR/comments/<databaseId>/replies -f body='...'`
   - Resolve each of those threads, fixed or skipped, so the next pass does not pick them up again.
     `gh api graphql -f query='mutation($id:ID!){resolveReviewThread(input:{threadId:$id}){thread{isResolved}}}' -f id=<thread id>`
   - A review body or PR comment with an ask gets one `gh pr comment` covering each point. No reply to lgtms or bot noise.

## Voice

Short and plain. One line per reply. No em dashes. No praise, no preamble.

## Never

- Never touch the main checkout, or check out the PR anywhere else.
- Never push to the base branch or any branch other than the PR's.
- Never merge, close, approve, or relabel the PR.
- Never do work the feedback did not ask for.

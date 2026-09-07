#!/usr/bin/env bash
# Reviews every open PR that is new or has new commits since the last review.
set -u
. "$(dirname "$0")/lib.sh"

LEDGER="$STATE_DIR/review-ledger.json"
LOG="$STATE_DIR/review.log"

exec 9>"$STATE_DIR/review.lock"
flock -n 9 || { log "$LOG" "another review is running"; exit 0; }
exec 8>"$STATE_DIR/tree.lock"
flock -n 8 || { log "$LOG" "nightly batch is running; will try next tick"; exit 0; }

[ -f "$LEDGER" ] || echo '{}' >"$LEDGER"

OPEN=$(gh pr list --repo "$REPO_SLUG" --state open --json number,headRefOid 2>>"$LOG")
[ -n "$OPEN" ] || { log "$LOG" "ERROR: gh pr list failed"; exit 1; }

# A PR needs review if it is new, or its head commit moved since last time.
NEED=$(python3 -c '
import json, sys
open_prs = json.loads(sys.argv[1])
ledger = json.load(open(sys.argv[2]))
print(",".join(str(p["number"]) for p in open_prs if ledger.get(str(p["number"])) != p["headRefOid"]))
' "$OPEN" "$LEDGER")

[ -n "$NEED" ] || { log "$LOG" "nothing new"; exit 0; }
log "$LOG" "reviewing PRs: $NEED"

PROMPT="You are Nightshift, a PR reviewer that runs alone. No human is here. Never ask a question.
Repo: $REPO_SLUG. Local checkout: $REPO_DIR.

TREE SAFETY (hard rule): other jobs share this checkout. Look at PRs only with \`gh pr diff\`, \`gh pr view\`, and \`gh api\`. Never run \`gh pr checkout\`, \`git checkout\`, \`git switch\`, or \`git stash\`. All comments go through the GitHub API.

Review only these PRs: $NEED
The repo owner is $OWNER. Do not repeat anything they already said on a PR.

Read $NIGHTSHIFT_DIR/review/SKILL.md and follow it exactly.
End with a short report: PRs reviewed, comments posted, anything skipped and why."

run_agent "$REVIEW_TIMEOUT" "$REVIEW_AGENT" "$PROMPT" >>"$LOG" 2>&1
RC=$?
if [ "$RC" -ne 0 ]; then
  log "$LOG" "ERROR: review exited $RC (124 = timeout). ledger not updated. will retry"; exit "$RC"
fi

# Remember every open PR's head, and forget PRs that closed.
python3 -c '
import json, sys
open_prs = json.loads(sys.argv[1])
json.dump({str(p["number"]): p["headRefOid"] for p in open_prs}, open(sys.argv[2], "w"), indent=2)
' "$OPEN" "$LEDGER"
log "$LOG" "done; ledger updated"

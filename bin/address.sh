#!/usr/bin/env bash
# Addresses review feedback on open PRs, one PR at a time, in a worktree of its own.
set -u
. "$(dirname "$0")/lib.sh"

: "${ADDRESS_AGENT:=$AGENT}"
: "${ADDRESS_TIMEOUT:=$JOB_TIMEOUT}"
: "${HOLD_LABEL:=}"
LEDGER="$STATE_DIR/address-ledger.json"
LOG="$STATE_DIR/address.log"
TREE="$STATE_DIR/address-tree"

exec 9>"$STATE_DIR/address.lock"
flock -n 9 || { log "$LOG" "another address run is going"; exit 0; }
# A waiting night batch holds nightly.lock, so stepping aside here keeps it from starving.
exec 7>"$STATE_DIR/nightly.lock"
flock -n 7 || { log "$LOG" "nightly batch is running; will try next tick"; exit 0; }
flock -u 7
exec 8>"$STATE_DIR/tree.lock"
flock -s -n 8 || { log "$LOG" "nightly batch is running; will try next tick"; exit 0; }

[ -f "$LEDGER" ] || echo '{}' >"$LEDGER"
OWNER_NAME=${REPO_SLUG%/*} NAME=${REPO_SLUG#*/}

QUERY='query($o:String!,$r:String!){repository(owner:$o,name:$r){pullRequests(states:OPEN,first:50){nodes{
  number headRefName headRefOid isCrossRepository maintainerCanModify
  headRepository{nameWithOwner} labels(first:20){nodes{name}}
  reviewThreads(first:100){nodes{isResolved}}
  reviews(last:30){totalCount nodes{body submittedAt}}
  comments(last:30){nodes{body createdAt}}}}}}'
OPEN=$(gh api graphql -f query="$QUERY" -f o="$OWNER_NAME" -f r="$NAME" 2>>"$LOG")
[ -n "$OPEN" ] || { log "$LOG" "ERROR: gh api graphql failed"; exit 1; }

# A PR needs a pass if it was reviewed and has an unresolved thread, or feedback newer than our last pass.
NEED=$(python3 -c '
import json, sys
prs = json.loads(sys.argv[1])["data"]["repository"]["pullRequests"]["nodes"]
ledger, hold = json.load(open(sys.argv[2])), sys.argv[3]
for p in prs:
    if p["isCrossRepository"] and not p["maintainerCanModify"]: continue
    if hold and hold in [l["name"] for l in p["labels"]["nodes"]]: continue
    if not p["reviews"]["totalCount"] and not p["reviewThreads"]["nodes"]: continue
    since = ledger.get(str(p["number"]), "")
    unresolved = any(not t["isResolved"] for t in p["reviewThreads"]["nodes"])
    fresh = [r["submittedAt"] for r in p["reviews"]["nodes"] if r["body"].strip()]
    fresh += [c["createdAt"] for c in p["comments"]["nodes"]]
    if unresolved or any(t > since for t in fresh):
        print(p["number"], p["headRefName"], p["headRefOid"], p["headRepository"]["nameWithOwner"])
' "$OPEN" "$LEDGER" "$HOLD_LABEL")

[ -n "$NEED" ] || { log "$LOG" "nothing to address"; exit 0; }
log "$LOG" "to address: $(echo "$NEED" | cut -d' ' -f1 | tr '\n' ' ')"

cd "$REPO_DIR" || { log "$LOG" "no repo at $REPO_DIR"; exit 1; }
git worktree prune
[ -d "$TREE" ] || git worktree add --detach "$TREE" >>"$LOG" 2>&1 || { log "$LOG" "ERROR: worktree add failed"; exit 1; }
trap 'git -C "$REPO_DIR" worktree remove --force "$TREE" >>"$LOG" 2>&1' EXIT

echo "$NEED" | while read -r n ref sha head_repo; do
  if [ "$(git branch --show-current)" = "$ref" ]; then
    log "$LOG" "skip #$n: $ref is checked out in $REPO_DIR, someone is working on it"; continue
  fi
  # Only one PR at a time: the worktree is reset to the PR's head.
  if ! { git -C "$TREE" fetch -q origin "pull/$n/head" && git -C "$TREE" checkout -q -f --detach "$sha" && git -C "$TREE" clean -fdq; } >>"$LOG" 2>&1; then
    log "$LOG" "ERROR: could not check out PR #$n; skipped"; continue
  fi
  log "$LOG" "START #$n ($ref at ${sha:0:8})"
  PROMPT="You are Nightshift, addressing review feedback on a pull request. You run alone. No human is here. Never ask a question.

Settings:
- REPO_SLUG=$REPO_SLUG
- PR=$n
- WORKTREE=$TREE (the PR's head, detached. Work only here. Never touch $REPO_DIR.)
- BASE_BRANCH=$BASE_BRANCH
- CHECKS=$CHECKS
- PUSH=git push --force-with-lease=$ref:$sha https://github.com/$head_repo.git HEAD:$ref

Read $NIGHTSHIFT_DIR/address/SKILL.md and follow it exactly.
End with a short report: what you addressed, what you skipped and why, the pushed SHA or \"no push\"."
  ( cd "$TREE" && run_agent "$ADDRESS_TIMEOUT" "$ADDRESS_AGENT" "$PROMPT" "${ADDRESS_AGENT_FALLBACK:-${AGENT_FALLBACK:-}}" ) >>"$LOG" 2>&1
  RC=$?
  if [ "$RC" -ne 0 ]; then log "$LOG" "ERROR: #$n exited $RC (124 = timeout). ledger not updated. will retry"; continue; fi
  python3 -c '
import json, sys, datetime
l = json.load(open(sys.argv[1]))
l[sys.argv[2]] = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
json.dump(l, open(sys.argv[1], "w"), indent=2)
' "$LEDGER" "$n"
  log "$LOG" "END   #$n"
done

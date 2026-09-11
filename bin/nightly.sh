#!/usr/bin/env bash
# Runs every job in JOBS, one after another, once per night.
# Give it job names to run only those, from a timer of their own: nightly.sh readability
set -u
. "$(dirname "$0")/lib.sh"
JOBS=${*:-$JOBS}

DATE=$(date +%Y%m%d)
RUN_DIR="$STATE_DIR/runs/$DATE"
DONE="$STATE_DIR/done-$DATE"
mkdir -p "$RUN_DIR"
BLOG="$RUN_DIR/_batch.log"

if [ "$(date +%-H)" -ge "$WINDOW_END_HOUR" ]; then
  log "$BLOG" "it is past $WINDOW_END_HOUR:00. skipping tonight's batch"; exit 0
fi
if [ -f "$DONE" ]; then log "$BLOG" "already ran today"; exit 0; fi

exec 9>"$STATE_DIR/nightly.lock"
flock -n 9 || { log "$BLOG" "another batch is running"; exit 0; }
[ -f "$DONE" ] && { log "$BLOG" "already ran today"; exit 0; }

log "$BLOG" "waiting for the tree lock"
exec 8>"$STATE_DIR/tree.lock"
flock 8
log "$BLOG" "batch start"

cd "$REPO_DIR" || { log "$BLOG" "no repo at $REPO_DIR"; exit 1; }

prompt() {
  cat <<PROMPT
You are Nightshift, a job that runs alone at night. No human is here. Never ask a question. Never stop to confirm. Do the whole job.

Settings:
- REPO_DIR=$REPO_DIR
- REPO_SLUG=$REPO_SLUG
- BASE_BRANCH=$BASE_BRANCH
- BRANCH_PREFIX=$BRANCH_PREFIX
- OWNER=$OWNER
- CHECKS=$CHECKS
- STATE_DIR=$STATE_DIR
- GUARD=$NIGHTSHIFT_DIR/bin/guard.sh

Read $NIGHTSHIFT_DIR/jobs/_common.md first. Then read $NIGHTSHIFT_DIR/jobs/$1.md. Follow both exactly.
End with a short report: the PR link, or "no change" and why.
PROMPT
}

for job in $JOBS; do
  [ -f "$NIGHTSHIFT_DIR/jobs/$job.md" ] || { log "$BLOG" "no job named $job"; continue; }
  [ -f "$RUN_DIR/$job.log" ] && { log "$BLOG" "SKIP  $job ran earlier tonight"; continue; }
  log "$BLOG" "START $job (branch=$(git branch --show-current))"
  run_agent "$JOB_TIMEOUT" "$AGENT" "$(prompt "$job")" >"$RUN_DIR/$job.log" 2>&1
  log "$BLOG" "END   $job exit=$?"
done

[ $# = 0 ] && { touch "$DONE"; log "$BLOG" "batch done"; }

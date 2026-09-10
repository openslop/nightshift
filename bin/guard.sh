#!/usr/bin/env bash
# Fails (exit 1) if the current branch (or the ref given as $1) touches a file that any open PR
# touches, or would merge-conflict with one. Run it before you push.
# A PR that already conflicts with the base branch on its own is stale. It is skipped.
set -u
export LC_ALL=C  # sort and comm must agree on collation
. "$(dirname "$0")/lib.sh"
MINE=${1:-HEAD}
cd "$REPO_DIR" || { echo "no repo at $REPO_DIR"; exit 2; }

git rev-parse --show-toplevel >/dev/null 2>&1 || { echo "not in a git repo"; exit 2; }
PRS=$(gh pr list --repo "$REPO_SLUG" --state open --limit 100 --json number -q '.[].number') || exit 2

refspecs=("$BASE_BRANCH:refs/nightshift/base")
for n in $PRS; do refspecs+=("+refs/pull/$n/head:refs/nightshift/pr-$n"); done
timeout 120 git fetch -q origin "${refspecs[@]}" || { echo "fetch failed"; exit 2; }

BASE=refs/nightshift/base
FILES=$(git diff --name-only "$BASE...$MINE" | sort)
status=0
if [ -z "$FILES" ]; then echo "no changes vs $BASE_BRANCH"; else
  for n in $PRS; do
    ref="refs/nightshift/pr-$n"
    shared=$(comm -12 <(echo "$FILES") <(git diff --name-only "$(git merge-base "$BASE" "$ref")" "$ref" | sort))
    if [ -n "$shared" ]; then
      echo "PR #$n: shares files"; echo "$shared" | sed 's/^/    /'; status=1
    elif ! timeout 60 git merge-tree --write-tree --no-messages "$BASE" "$ref" >/dev/null 2>&1; then
      echo "PR #$n: stale (conflicts with $BASE_BRANCH on its own); skipped"
    elif ! timeout 60 git merge-tree --write-tree --no-messages "$MINE" "$ref" >/dev/null 2>&1; then
      echo "PR #$n: merge conflict"; status=1
    else
      echo "PR #$n: clean"
    fi
  done
fi
git for-each-ref --format='%(refname)' refs/nightshift | xargs -r -n1 git update-ref -d
[ $status -eq 0 ] && [ -n "$FILES" ] && echo "OK: no shared files or merge conflicts with any open PR"
exit $status

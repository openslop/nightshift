# Shared by every script. Source me.
NIGHTSHIFT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
CONF="$NIGHTSHIFT_DIR/nightshift.conf"
[ -f "$CONF" ] || { echo "missing $CONF. Copy nightshift.conf.example and fill it in." >&2; exit 1; }
# shellcheck source=/dev/null
. "$CONF"
export PATH="$HOME/.local/bin:/usr/local/bin:/opt/homebrew/bin:$PATH"
mkdir -p "$STATE_DIR"
log() { local f=$1; shift; echo "[$(date '+%F %T')] $*" >>"$f"; }

: "${REVIEW_AGENT:=$AGENT}"
: "${AGENT_STDIN:=0}"
# run_agent <timeout> <agent command> <prompt>
# /tmp is RAM on many systems, and agents leave whole repo copies in it, so each run gets scratch space on disk.
run_agent() {
  local t=$1 cmd=$2 prompt=$3 scratch rc
  mkdir -p "$STATE_DIR/tmp"
  find "$STATE_DIR/tmp" -mindepth 1 -maxdepth 1 -mmin +1440 -exec rm -rf {} +
  scratch=$(mktemp -d "$STATE_DIR/tmp/run.XXXXXX")
  # shellcheck disable=SC2086
  if [ "$AGENT_STDIN" = 1 ]; then printf '%s' "$prompt" | TMPDIR=$scratch CLAUDE_CODE_TMPDIR=$scratch timeout "$t" $cmd
  else TMPDIR=$scratch CLAUDE_CODE_TMPDIR=$scratch timeout "$t" $cmd "$prompt" </dev/null; fi
  rc=$?
  rm -rf "$scratch"
  return "$rc"
}

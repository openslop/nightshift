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
run_agent() {
  local t=$1 cmd=$2 prompt=$3
  # shellcheck disable=SC2086
  if [ "$AGENT_STDIN" = 1 ]; then printf '%s' "$prompt" | timeout "$t" $cmd
  else timeout "$t" $cmd "$prompt" </dev/null; fi
}

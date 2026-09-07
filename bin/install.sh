#!/usr/bin/env bash
# Sets up the two timers on this machine. Run `bin/install.sh remove` to take them off.
# Set NIGHTSHIFT_DRY_RUN=1 to print system commands instead of running them.
set -eu
DIR=$(cd "$(dirname "$0")/.." && pwd)
MODE=${1:-install}
run() { if [ "${NIGHTSHIFT_DRY_RUN:-}" ]; then echo "+ $*"; else "$@"; fi; }
fill() { sed "s|__DIR__|$DIR|g" "$1" >"$2"; echo "wrote $2"; }

if [ "$MODE" = install ] && [ ! -f "$DIR/nightshift.conf" ]; then
  cp "$DIR/nightshift.conf.example" "$DIR/nightshift.conf"; echo "wrote nightshift.conf. Fill it in, then run me again."; exit 0
fi

case "$(uname -s)" in
Linux)
  UNITS=${XDG_CONFIG_HOME:-$HOME/.config}/systemd/user
  if [ "$MODE" = remove ]; then
    run systemctl --user disable --now nightshift-nightly.timer nightshift-review.timer || true
    for f in "$DIR"/install/systemd/*; do rm -f "$UNITS/$(basename "$f")"; done
    run systemctl --user daemon-reload; exit 0
  fi
  mkdir -p "$UNITS"
  for f in "$DIR"/install/systemd/*; do fill "$f" "$UNITS/$(basename "$f")"; done
  run systemctl --user daemon-reload
  run systemctl --user enable --now nightshift-nightly.timer nightshift-review.timer
  run systemctl --user list-timers nightshift-nightly.timer nightshift-review.timer
  ;;
Darwin)
  AGENTS=$HOME/Library/LaunchAgents
  if [ "$MODE" = remove ]; then
    for f in "$DIR"/install/launchd/*; do
      name=$(basename "$f" .plist); run launchctl bootout "gui/$(id -u)/$name" || true; rm -f "$AGENTS/$name.plist"
    done; exit 0
  fi
  mkdir -p "$AGENTS"
  for f in "$DIR"/install/launchd/*; do
    out="$AGENTS/$(basename "$f")"; fill "$f" "$out"; run launchctl bootstrap "gui/$(id -u)" "$out"
  done
  run launchctl list | grep nightshift || true
  ;;
*)
  echo "Not Linux or macOS. Use install/cron/crontab.txt, or install/windows/install.ps1 on Windows."; exit 1 ;;
esac

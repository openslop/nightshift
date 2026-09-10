#!/usr/bin/env bash
# Gives the bridge its look on GNOME + Ptyxis: a sci-fi monospace font and a blurred,
# translucent terminal window (via the Blur my Shell extension, if installed).
# Everything it changes is written to ~/.config/nightshift-tui/gnome-backup.env so
#   scripts/setup-gnome.sh --revert
# puts it all back.
set -u
CFG="$HOME/.config/nightshift-tui"; BK="$CFG/gnome-backup.env"; mkdir -p "$CFG"
FONT=${NIGHTSHIFT_FONT:-"Share Tech Mono 13"}
BMS_SCHEMA=$(ls -d "$HOME"/.local/share/gnome-shell/extensions/blur-my-shell@aunetx/schemas /usr/share/gnome-shell/extensions/blur-my-shell@aunetx/schemas 2>/dev/null | head -1)
bms() { gsettings --schemadir "$BMS_SCHEMA" "$@"; }
APPS=org.gnome.shell.extensions.blur-my-shell.applications

if [ "${1:-}" = "--revert" ]; then
  [ -f "$BK" ] || { echo "nothing to revert"; exit 0; }
  # shellcheck source=/dev/null
  . "$BK"
  gsettings set org.gnome.Ptyxis use-system-font "$PTYXIS_USE_SYSTEM_FONT"
  gsettings set org.gnome.Ptyxis font-name "$PTYXIS_FONT"
  [ -n "$BMS_SCHEMA" ] && [ -n "${BMS_OPACITY:-}" ] && bms set $APPS opacity "$BMS_OPACITY"
  rm -f "$BK"; echo "reverted"; exit 0
fi

command -v gsettings >/dev/null || { echo "gsettings not found; nothing to do"; exit 0; }
if [ ! -f "$BK" ]; then
  {
    echo "PTYXIS_USE_SYSTEM_FONT=$(gsettings get org.gnome.Ptyxis use-system-font 2>/dev/null || echo true)"
    echo "PTYXIS_FONT=$(gsettings get org.gnome.Ptyxis font-name 2>/dev/null || echo "'Monospace 10'")"
    [ -n "$BMS_SCHEMA" ] && echo "BMS_OPACITY=$(bms get $APPS opacity)"
  } >"$BK"
fi

# 1. Font. Share Tech Mono is the archetypal sci-fi console face (OFL). Install it if missing.
if ! fc-list | grep -qi "Share Tech Mono"; then
  mkdir -p "$HOME/.local/share/fonts/nightshift"
  curl -sfL -o "$HOME/.local/share/fonts/nightshift/ShareTechMono-Regular.ttf" \
    https://raw.githubusercontent.com/google/fonts/main/ofl/sharetechmono/ShareTechMono-Regular.ttf && fc-cache -f >/dev/null
fi
gsettings set org.gnome.Ptyxis use-system-font false 2>/dev/null && gsettings set org.gnome.Ptyxis font-name "$FONT" && echo "ptyxis font → $FONT"

# 2. Blur + transparency. Ptyxis already draws with its profile opacity; Blur my Shell blurs what is behind it.
if [ -n "$BMS_SCHEMA" ]; then
  bms set $APPS blur true
  WL=$(bms get $APPS whitelist)
  case "$WL" in *Ptyxis*) ;; *) bms set $APPS whitelist "$(echo "$WL" | sed "s/]$/, 'org.gnome.Ptyxis', 'ptyxis']/")";; esac
  bms set $APPS opacity "${NIGHTSHIFT_OPACITY:-220}"
  echo "blur my shell → applications blur on, ptyxis whitelisted, opacity ${NIGHTSHIFT_OPACITY:-220}/255"
else
  echo "Blur my Shell not installed; window transparency comes from the Ptyxis profile opacity only"
fi
echo "done. revert with: $0 --revert"

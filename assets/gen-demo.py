#!/usr/bin/env python3
"""Emits assets/nightshift-demo.svg. Timings are seconds on a LOOP-second loop."""
import html
import pathlib

LOOP = 32.0
W, H = 1280, 720
BG, PANEL, PANEL2, LINE = "#140e11", "#1c1619", "#231e21", "#2e282b"
MUTED, TEXT, DIM = "#9d8b93", "#ded6da", "#6f6167"
ACCENT, GREEN, INK = "#8f8fe6", "#5fbf8a", "#f3eef0"
MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace"
SANS = "Inter, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"

css, body = [], []
n = 0


def pct(t):
    return f"{t / LOOP * 100:.2f}%"


def appear(t, dy=6, fade=0.5):
    """Class that fades a node in at t seconds and keeps it until the loop ends."""
    global n
    n += 1
    c = f"a{n}"
    t0, t1 = max(t - 0.01, 0), min(t + fade, LOOP)
    css.append(
        f".{c}{{animation:kf-{c} {LOOP}s infinite both}}"
        f"@keyframes kf-{c}{{0%,{pct(t0)}{{opacity:0;transform:translate(0,{dy}px)}}"
        f"{pct(t1)},100%{{opacity:1;transform:translate(0,0)}}}}"
    )
    return c


def span(t, until, fade=0.3):
    """Class visible from t until `until` seconds."""
    global n
    n += 1
    c = f"s{n}"
    css.append(
        f".{c}{{animation:kf-{c} {LOOP}s infinite both}}"
        f"@keyframes kf-{c}{{0%,{pct(max(t-0.01,0))}{{opacity:0}}{pct(t+fade)},{pct(until)}{{opacity:1}}"
        f"{pct(min(until+fade,LOOP))},100%{{opacity:0}}}}"
    )
    return c


def text(x, y, s, size=15, fill=TEXT, font=SANS, cls="", weight=400, anchor="start", extra=""):
    body.append(
        f'<text x="{x}" y="{y}" font-family="{font}" font-size="{size}" font-weight="{weight}" fill="{fill}" '
        f'text-anchor="{anchor}" class="{cls}" style="white-space:pre" {extra}>{html.escape(s)}</text>'
    )


# ---- backdrop: night, then dawn
body.append(f'<rect width="{W}" height="{H}" fill="{BG}"/>')
body.append(
    '<defs><linearGradient id="dawn" x1="0" y1="1" x2="0" y2="0">'
    '<stop offset="0" stop-color="#3a2a3a"/><stop offset=".6" stop-color="#241a26"/><stop offset="1" stop-color="#140e11"/></linearGradient>'
    '<clipPath id="moonclip"><circle cx="0" cy="0" r="12"/></clipPath></defs>'
)
css.append(
    f".dawn{{animation:kf-dawn {LOOP}s infinite both}}"
    f"@keyframes kf-dawn{{0%,{pct(25.5)}{{opacity:0}}{pct(29.5)},{pct(31)}{{opacity:1}}100%{{opacity:0}}}}"
)
body.append(f'<rect width="{W}" height="{H}" fill="url(#dawn)" class="dawn"/>')

# ---- top bar
body.append(f'<rect x="0" y="0" width="{W}" height="52" fill="{PANEL}"/><line x1="0" y1="52.5" x2="{W}" y2="52.5" stroke="{LINE}"/>')
body.append(
    f'<g transform="translate(34,26)"><circle r="11" fill="none" stroke="{INK}" stroke-width="2.5"/>'
    f'<circle r="11" fill="{INK}" clip-path="url(#moonclip)" transform="translate(-7,0)"/></g>'
)
text(56, 32, "nightshift", 17, INK, weight=600)
text(150, 31, "runs while you sleep", 13, DIM)

# clock: a set of times that swap
times = [(0, "23:41"), (3.2, "05:12"), (7.5, "05:19"), (11, "05:43"), (14.5, "06:14"), (18, "06:41"), (21.5, "07:02"), (25, "07:31"), (28.5, "08:00")]
for i, (t, s) in enumerate(times):
    end = times[i + 1][0] if i + 1 < len(times) else LOOP
    c = span(t, end, fade=0.2)
    text(W - 34, 33, s, 16, TEXT, MONO, cls=c, anchor="end")

# ---- left panel: the batch log
LX, LY, LW, LH = 40, 84, 600, 520
body.append(f'<rect x="{LX}" y="{LY}" width="{LW}" height="{LH}" rx="12" fill="{PANEL}" stroke="{LINE}"/>')
text(LX + 20, LY + 30, "~/.local/state/nightshift/runs/20260907/_batch.log", 12.5, MUTED, MONO)
body.append(f'<line x1="{LX}" y1="{LY + 44}" x2="{LX + LW}" y2="{LY + 44}" stroke="{LINE}"/>')

log = [
    (3.2, "05:12:00", "batch start", MUTED),
    (3.9, "05:12:01", "START security", TEXT),
    (7.5, "05:19:41", "END   security          no change", DIM),
    (7.9, "05:19:42", "START maintainability", TEXT),
    (11.0, "05:43:10", "END   maintainability   PR #212", ACCENT),
    (11.4, "05:43:11", "START performance", TEXT),
    (13.6, "05:58:02", "END   performance       no change", DIM),
    (14.0, "05:58:03", "START conventions", TEXT),
    (14.5, "06:14:55", "END   conventions       PR #213", ACCENT),
    (14.9, "06:14:56", "START architecture", TEXT),
    (18.0, "06:41:30", "END   architecture      PR #214", ACCENT),
    (18.4, "06:41:31", "START smoke-tests", TEXT),
    (19.6, "06:44:12", "END   smoke-tests       no change", DIM),
    (20.0, "06:44:13", "START issues", TEXT),
    (21.5, "07:02:48", "END   issues            PR #215  closes #198", ACCENT),
    (22.0, "07:02:49", "batch done", MUTED),
]
y = LY + 76
for t, ts, msg, col in log:
    c = appear(t)
    text(LX + 20, y, ts, 13.5, DIM, MONO, cls=c)
    text(LX + 104, y, msg, 13.5, col, MONO, cls=c)
    y += 26

# cursor blink while running
css.append(".blink{animation:kf-blink 1s steps(1) infinite}@keyframes kf-blink{0%,49%{opacity:1}50%,100%{opacity:0}}")
cur = span(3.2, 22.0, fade=0.1)
body.append(f'<g class="{cur}"><rect x="{LX + 20}" y="{y - 12}" width="8" height="15" fill="{MUTED}" class="blink"/></g>')

# ---- right panel: pull requests
RX, RY, RW, RH = 680, 84, 560, 520
body.append(f'<rect x="{RX}" y="{RY}" width="{RW}" height="{RH}" rx="12" fill="{PANEL}" stroke="{LINE}"/>')
text(RX + 20, RY + 30, "Pull requests", 14, TEXT, weight=600)
text(RX + RW - 20, RY + 30, "github.com/you/your-app", 12.5, MUTED, MONO, anchor="end")
body.append(f'<line x1="{RX}" y1="{RY + 44}" x2="{RX + RW}" y2="{RY + 44}" stroke="{LINE}"/>')

empty = span(0, 10.8, fade=0.3)
text(RX + RW / 2, RY + 200, "Nothing yet.", 14, DIM, cls=empty, anchor="middle")
text(RX + RW / 2, RY + 224, "Go to sleep.", 14, DIM, cls=empty, anchor="middle")

prs = [
    (11.0, "#212", "refactor: nightly maintainability 2026-09-07", "+41  -163", "nightly/maintainability-20260907-0519"),
    (14.5, "#213", "refactor: nightly conventions sweep 2026-09-07", "+28  -57", "nightly/conventions-20260907-0558"),
    (18.0, "#214", "refactor: rethink architecture 2026-09-07", "+96  -240", "nightly/architecture-20260907-0614"),
    (21.5, "#215", "fix: export toast opens the right panel", "+19  -4", "nightly/issue-198-20260907-0644"),
]
cy = RY + 62
for i, (t, num, title, diff, branch) in enumerate(prs):
    c = appear(t, dy=8)
    body.append(f'<g class="{c}">')
    body.append(f'<rect x="{RX + 16}" y="{cy}" width="{RW - 32}" height="92" rx="10" fill="{PANEL2}" stroke="{LINE}"/>')
    body.append(f'<circle cx="{RX + 38}" cy="{cy + 26}" r="6" fill="{GREEN}"/>')
    text(RX + 54, cy + 31, title, 14, TEXT, weight=500)
    text(RX + RW - 36, cy + 31, num, 13, MUTED, MONO, anchor="end")
    text(RX + 54, cy + 54, branch, 12, DIM, MONO)
    text(RX + 54, cy + 76, diff, 12.5, MUTED, MONO)
    # checks pass a bit later
    ck = appear(t + 1.6, dy=0)
    text(RX + 150, cy + 76, "checks passed", 12.5, GREEN, cls=ck)
    # the review job leaves a note 2h later on the first PR
    if i == 0:
        rv = appear(25.0, dy=0)
        text(RX + RW - 36, cy + 76, "nightshift review: lgtm", 12.5, ACCENT, MONO, cls=rv, anchor="end")
    body.append("</g>")
    cy += 104

# ---- bottom strip: you
by = 640
sleep = span(0, 28.3, fade=0.3)
text(LX, by, "you", 14, MUTED, cls=sleep)
css.append(".z{animation:kf-z 2.4s ease-in-out infinite}@keyframes kf-z{0%,100%{opacity:.25}50%{opacity:1}}")
body.append(
    f'<g class="{sleep}"><text x="{LX + 40}" y="{by}" font-family="{SANS}" font-size="14" fill="{DIM}" class="z">z</text>'
    f'<text x="{LX + 52}" y="{by - 6}" font-family="{SANS}" font-size="16" fill="{DIM}" class="z" style="animation-delay:-.8s">z</text>'
    f'<text x="{LX + 66}" y="{by - 13}" font-family="{SANS}" font-size="18" fill="{DIM}" class="z" style="animation-delay:-1.6s">z</text></g>'
)
morning = span(28.5, LOOP, fade=0.4)
text(LX, by, "good morning. four PRs are waiting.", 14, TEXT, cls=morning)

# timeline
tx0, tx1, ty = LX, W - 40, by + 34
body.append(f'<line x1="{tx0}" y1="{ty}" x2="{tx1}" y2="{ty}" stroke="{LINE}" stroke-width="2"/>')
for frac, label in [(0, "23:00"), (0.34, "05:12"), (0.66, "08:00"), (1, "noon")]:
    x = tx0 + (tx1 - tx0) * frac
    body.append(f'<line x1="{x}" y1="{ty - 5}" x2="{x}" y2="{ty + 5}" stroke="{MUTED}"/>')
    text(x, ty + 24, label, 11.5, DIM, MONO, anchor="middle")
# the active window
wx0, wx1 = tx0 + (tx1 - tx0) * 0.34, tx0 + (tx1 - tx0) * 0.66
body.append(f'<line x1="{wx0}" y1="{ty}" x2="{wx1}" y2="{ty}" stroke="{ACCENT}" stroke-width="3" stroke-linecap="round"/>')
# moving dot: 23:00 at t=0 to noon at t=LOOP, linear
css.append(
    f".dot{{animation:kf-dot {LOOP}s linear infinite}}@keyframes kf-dot{{0%{{transform:translateX(0)}}100%{{transform:translateX({tx1 - tx0}px)}}}}"
)
body.append(f'<circle cx="{tx0}" cy="{ty}" r="6" fill="{INK}" class="dot"/>')

svg = (
    f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" role="img" aria-label="Nightshift demo" xml:space="preserve">\n'
    "<title>Nightshift</title>\n"
    "<desc>At 05:12 Nightshift runs its jobs one by one. Four pull requests are ready by morning.</desc>\n"
    "<style>\n" + "\n".join(css) + "\n"
    "@media (prefers-reduced-motion: reduce) { * { animation-duration: .001s !important; animation-iteration-count: 1 !important; animation-fill-mode: forwards !important; } }\n"
    "</style>\n" + "\n".join(body) + "\n</svg>\n"
)
(pathlib.Path(__file__).parent / "nightshift-demo.svg").write_text(svg)
print(len(svg), "bytes")

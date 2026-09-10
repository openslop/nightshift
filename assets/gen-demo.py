#!/usr/bin/env python3
"""Emits assets/nightshift-demo.svg: one night as seen on the Nightshift console. Timings are seconds on a LOOP-second loop."""
import html
import math
import pathlib

LOOP = 32.0
W, H = 1280, 640
BG, LINE, LINEHI = "#140e11", "#2e282b", "#4a4046"
DIM, MUTED, FG2, TEXT, INK = "#4f454a", "#6f6167", "#9d8b93", "#ded6da", "#f3eef0"
ACCENT, ACCENT2, GREEN, ROSE, WARN = "#9d9df0", "#6b6bcf", "#5fbf8a", "#d29cb8", "#b57e38"
SELBAR = "#2c2329"
MONO = "'Share Tech Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace"

css, body = [], []
n = 0


def pct(t):
    return f"{t / LOOP * 100:.2f}%"


def appear(t, dy=4, fade=0.4):
    global n
    n += 1
    c = f"a{n}"
    css.append(f".{c}{{animation:kf-{c} {LOOP}s infinite both}}@keyframes kf-{c}{{0%,{pct(max(t-0.01,0))}{{opacity:0;transform:translate(0,{dy}px)}}{pct(min(t+fade,LOOP))},100%{{opacity:1;transform:translate(0,0)}}}}")
    return c


def span(t, until, fade=0.25):
    global n
    n += 1
    c = f"s{n}"
    tail = "" if until >= LOOP else f"{pct(min(until+fade,LOOP))},100%{{opacity:0}}"
    css.append(f".{c}{{animation:kf-{c} {LOOP}s infinite both}}@keyframes kf-{c}{{0%,{pct(max(t-0.01,0))}{{opacity:0}}{pct(t+fade)},{pct(until)}{{opacity:1}}{tail}}}")
    return c


def grow(t0, t1):
    """Class that scales x from 0 to 1 between t0 and t1 (set transform-origin on the node)."""
    global n
    n += 1
    c = f"g{n}"
    css.append(f".{c}{{animation:kf-{c} {LOOP}s linear infinite both}}@keyframes kf-{c}{{0%,{pct(max(t0-0.01,0))}{{transform:scaleX(0)}}{pct(t1)},100%{{transform:scaleX(1)}}}}")
    return c


def text(x, y, s, size=13, fill=TEXT, cls="", anchor="start", weight=400):
    body.append(f'<text x="{x}" y="{y}" font-family="{MONO}" font-size="{size}" font-weight="{weight}" fill="{fill}" text-anchor="{anchor}" class="{cls}" style="white-space:pre">{html.escape(s)}</text>')


def caption(x, y, w, left, right):
    text(x, y, left, 12, FG2)
    text(x + w, y, right, 12, DIM, anchor="end")
    body.append(f'<line x1="{x}" y1="{y + 8}" x2="{x + w}" y2="{y + 8}" stroke="{LINE}"/>')


def box(x, y, w, h, left, right):
    body.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="none" stroke="{LINEHI}"/>')
    body.append(f'<rect x="{x + 10}" y="{y - 8}" width="{len(left) * 8 + 10}" height="16" fill="{BG}"/>')
    text(x + 15, y + 4, left, 12, FG2)
    body.append(f'<rect x="{x + w - len(right) * 8 - 22}" y="{y - 8}" width="{len(right) * 8 + 12}" height="16" fill="{BG}"/>')
    text(x + w - 16, y + 4, right, 12, DIM, anchor="end")


# ---- seven-segment digits
SEG = {"0": "abcdef", "1": "bc", "2": "abdeg", "3": "abcdg", "4": "bcfg", "5": "acdfg", "6": "acdefg", "7": "abc", "8": "abcdefg", "9": "abcdfg"}


def digit(x, y, d, w=18, h=34, col=INK, cls=""):
    s = SEG.get(d, "")
    m = y + h / 2
    segs = {"a": (x, y, x + w, y), "b": (x + w, y, x + w, m), "c": (x + w, m, x + w, y + h), "d": (x, y + h, x + w, y + h), "e": (x, m, x, y + h), "f": (x, y, x, m), "g": (x, m, x + w, m)}
    body.append(f'<g class="{cls}" stroke="{col}" stroke-width="2" stroke-linecap="round">')
    for k in s:
        x1, y1, x2, y2 = segs[k]
        body.append(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}"/>')
    body.append("</g>")


def bignum(x, y, s, col=INK, cls="", w=18, h=34, gap=10):
    for ch in s:
        if ch == ":":
            body.append(f'<g class="{cls}"><circle cx="{x + 4}" cy="{y + h * 0.3}" r="2" fill="{col}"/><circle cx="{x + 4}" cy="{y + h * 0.7}" r="2" fill="{col}"/></g>')
            x += 14
        else:
            digit(x, y, ch, w, h, col, cls)
            x += w + gap
    return x


# ---- backdrop with the dot field
body.append(f'<rect width="{W}" height="{H}" fill="{BG}"/>')
body.append(f'<defs><pattern id="dots" width="40" height="28" patternUnits="userSpaceOnUse"><circle cx="20" cy="14" r="1" fill="{LINE}"/></pattern></defs>')
body.append(f'<rect width="{W}" height="{H}" fill="url(#dots)"/>')

# ---- left column: chronometer
LX, LW = 28, 240
caption(LX, 34, LW, "SHIFT", "CHRONOMETER")
times = [(0, "23:41"), (3.2, "05:12"), (7.5, "05:19"), (11, "05:43"), (14.5, "06:14"), (18, "06:41"), (21.5, "07:02"), (25, "07:31"), (28.5, "08:00")]
for i, (t, s) in enumerate(times):
    end = times[i + 1][0] if i + 1 < len(times) else LOOP
    bignum(LX + 4, 58, s, INK, span(t, end, fade=0.15), w=26, h=44, gap=14)
text(LX, 130, "2026", 11, DIM); text(LX, 146, "SEP 07", 12, FG2)
text(LX + 80, 130, "UPTIME", 11, DIM); text(LX + 80, 146, "0:04:12", 12, FG2)
text(LX + 160, 130, "SHIFT", 11, DIM)
for t, until, s, col in [(0, 3.2, "IDLE", FG2), (3.2, 22.0, "RUNNING", ACCENT), (22.0, LOOP, "DONE", GREEN)]:
    text(LX + 160, 146, s, 12, col, span(t, until, fade=0.15))

# deep field: an isometric mesh, one row lit
caption(LX, 176, LW, "DEEP FIELD", "NIGHTS × JOBS")
R, C = 9, 8
cx, cy = LX + LW / 2, 262
heights = [[0.25 + 0.5 * abs(math.sin(r * 1.7 + c * 0.9)) for c in range(C)] for r in range(R)]


def iso(r, c, z):
    return cx + (c - r) * 13, cy + (c + r) * 5.5 - z * 38


body.append(f'<g stroke="{MUTED}" stroke-width="1" fill="none" opacity=".9">')
for r in range(R):
    pts = " ".join(f"{x:.1f},{y:.1f}" for x, y in (iso(r, c, heights[r][c]) for c in range(C)))
    body.append(f'<polyline points="{pts}" stroke="{ACCENT if r == R - 1 else MUTED}" stroke-width="{2 if r == R - 1 else 1}"/>')
for c in range(C):
    pts = " ".join(f"{x:.1f},{y:.1f}" for x, y in (iso(r, c, heights[r][c]) for r in range(R)))
    body.append(f'<polyline points="{pts}" stroke="{ROSE if c == 1 else DIM}" stroke-width="{1.5 if c == 1 else 1}"/>')
body.append("</g>")
px, py = iso(R - 1, 1, heights[R - 1][1])
css.append(".bob{animation:kf-bob 2.4s ease-in-out infinite}@keyframes kf-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}")
body.append(f'<g class="bob"><line x1="{px}" y1="{py - 6}" x2="{px}" y2="{py - 22}" stroke="{INK}" stroke-width="2"/><circle cx="{px}" cy="{py - 24}" r="2.5" fill="{INK}"/></g>')
text(LX, 356, "ROT  67°", 11, DIM); text(LX + LW, 356, "28N × 8J", 11, DIM, anchor="end")

# system map: dots, tonight's turns green when done
caption(LX, 386, LW, "SYSTEM MAP", "NIGHT GRID")
for i in range(60):
    x = LX + 6 + (i % 20) * 12
    y = 408 + (i // 20) * 16
    if i == 59:
        body.append(f'<circle cx="{x}" cy="{y}" r="3.5" fill="{FG2}" class="{span(0, 22.0)}"/>')
        body.append(f'<circle cx="{x}" cy="{y}" r="3.5" fill="{GREEN}" class="{appear(22.0, dy=0)}"/>')
    else:
        col = GREEN if (i * 7) % 5 else FG2
        body.append(f'<circle cx="{x}" cy="{y}" r="{3.5 if col == GREEN else 2}" fill="{col}" opacity=".85"/>')
text(LX, 470, "NIGHT", 11, DIM); text(LX + LW, 470, "NORMAL", 11, DIM, anchor="end")

# ---- centre: the terminal panel
TX, TY, TW, TH = 300, 34, 640, 440
box(TX, TY, TW, TH, "TERMINAL", "MAIN")
text(TX + 16, TY + 26, "shift SUN 05:12  ·  review every 2h  ·  github.com/you/your-app", 12, FG2)

# timeline
gx0, gx1 = TX + 150, TX + TW - 60
def gx(clock):  # minutes after 05:12 → x, axis covers 05:12 → 07:12
    return gx0 + (gx1 - gx0) * clock / 120
text(TX + 16, TY + 52, "┼ NIGHT TIMELINE · 2026-09-07", 12, FG2)
body.append(f'<line x1="{TX + 16}" y1="{TY + 62}" x2="{TX + TW - 16}" y2="{TY + 62}" stroke="{LINE}"/>')
for m in range(0, 121, 20):
    x = gx(m)
    text(x, TY + 78, f"{5 + (12 + m) // 60:02d}:{(12 + m) % 60:02d}", 10.5, DIM, anchor="middle")
    body.append(f'<line x1="{x}" y1="{TY + 84}" x2="{x}" y2="{TY + 84 + 7 * 20}" stroke="{LINE}" stroke-dasharray="1 3"/>')

jobs = [  # name, t start, t end, clock start, clock end, result, pr
    ("security", 3.9, 7.5, 0, 7, "NO-OP", None),
    ("maintainability", 7.9, 11.0, 7, 31, "PR OPEN", "#212"),
    ("performance", 11.4, 13.6, 31, 46, "NO-OP", None),
    ("conventions", 14.0, 14.5, 46, 62, "PR OPEN", "#213"),
    ("architecture", 14.9, 18.0, 62, 89, "PR OPEN", "#214"),
    ("smoke-tests", 18.4, 19.6, 89, 92, "NO-OP", None),
    ("issues", 20.0, 21.5, 92, 110, "PR OPEN", "#215"),
]
y = TY + 98
for i, (name, t0, t1, c0, c1, res, pr) in enumerate(jobs):
    text(TX + 16, y + 4, name, 12, FG2)
    x0, x1 = gx(c0), gx(c1)
    col = GREEN if pr else FG2
    body.append(f'<rect x="{x0}" y="{y - 6}" width="{x1 - x0}" height="12" fill="{col}" opacity=".85" class="{grow(t0, t1)}" style="transform-origin:{x0}px {y}px"/>')
    text(x1 + 8, y + 4, f"{c1 - c0}m" + (f"  {pr}" if pr else ""), 11, GREEN if pr else DIM, appear(t1, dy=0))
    y += 20

# job table
ty = TY + 258
body.append(f'<rect x="{TX + 12}" y="{ty - 12}" width="{TW - 24}" height="18" fill="{SELBAR}"/>')
for x, s in [(TX + 16, "JOB"), (TX + 190, "STATUS"), (TX + 300, "START"), (TX + 360, "DUR"), (TX + 420, "PR"), (TX + 480, "REPORT")]:
    text(x, ty + 1, s, 11.5, FG2)
text(TX + 16, ty + 22, "nightly 2026-09-07", 12, TEXT)
for t, until, s in [(3.2, 22.0, "running"), (22.0, LOOP, "complete")]:
    text(TX + 190, ty + 22, s, 12, WARN if s == "running" else FG2, span(t, until, fade=0.1))
y = ty + 42
for i, (name, t0, t1, c0, c1, res, pr) in enumerate(jobs):
    row = appear(t0, dy=0)
    body.append(f'<g class="{row}">')
    text(TX + 16, y, ("└─ " if i == len(jobs) - 1 else "├─ ") + name, 12, TEXT)
    text(TX + 300, y, f"{5 + (12 + c0) // 60:02d}:{(12 + c0) % 60:02d}", 12, FG2)
    body.append("</g>")
    running = span(t0, t1, fade=0.1)
    body.append(f'<g class="{running}"><text x="{TX + 190}" y="{y}" font-family="{MONO}" font-size="12" fill="{ACCENT}" class="blink">◉ RUNNING</text></g>')
    done = appear(t1, dy=0)
    body.append(f'<g class="{done}">')
    text(TX + 190, y, ("● " if pr else "○ ") + res, 12, GREEN if pr else FG2)
    text(TX + 360, y, f"{c1 - c0}m", 12, FG2)
    text(TX + 420, y, pr or "—", 12, GREEN if pr else DIM)
    text(TX + 480, y, {"security": "No exploitable issue.", "maintainability": "Three guards → one helper.", "performance": "Nothing users would feel.", "conventions": "Four rule breaks fixed.", "architecture": "Provider seam made total.", "smoke-tests": "Still opens. No test needed.", "issues": "Toast opens the right panel."}[name], 12, MUTED)
    body.append("</g>")
    y += 18
css.append(".blink{animation:kf-blink 1s steps(1) infinite}@keyframes kf-blink{0%,49%{opacity:1}50%,100%{opacity:.3}}")

# key bar
text(TX + 16, TY + TH + 4, "↑↓Job  ←→Night  ↵Report  dDeep field  mMetrics  cContinue  rReviews  oOpen PR  ?Help  qQuit", 11, FG2)

# ---- right column: radar + analytics
RX, RW = 972, 280
caption(RX, 34, RW, "SIGNALS", "RADAR")
rcx, rcy, rr = RX + RW / 2, 126, 66
for k in range(1, 5):
    body.append(f'<circle cx="{rcx}" cy="{rcy}" r="{rr * k / 4}" fill="none" stroke="{LINE}"/>')
body.append(f'<line x1="{rcx - rr}" y1="{rcy}" x2="{rcx + rr}" y2="{rcy}" stroke="{LINE}"/><line x1="{rcx}" y1="{rcy - rr}" x2="{rcx}" y2="{rcy + rr}" stroke="{LINE}"/>')
css.append(".sweep{animation:kf-sweep 6s linear infinite}@keyframes kf-sweep{to{transform:rotate(360deg)}}")
body.append(f'<defs><linearGradient id="wedge" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="{ACCENT}" stop-opacity="0"/><stop offset="1" stop-color="{ACCENT}" stop-opacity=".45"/></linearGradient></defs>')
body.append(f'<g class="sweep" style="transform-origin:{rcx}px {rcy}px"><path d="M{rcx},{rcy} L{rcx + rr * math.cos(-0.6)},{rcy + rr * math.sin(-0.6)} A{rr},{rr} 0 0 1 {rcx + rr},{rcy} Z" fill="url(#wedge)"/><line x1="{rcx}" y1="{rcy}" x2="{rcx + rr}" y2="{rcy}" stroke="{INK}" stroke-width="1.5"/></g>')
for i in range(40):
    a = i / 40 * math.tau - 1.6
    d = rr * (0.3 + 0.65 * ((i * 13) % 7) / 7)
    hot = (i * 7) % 3 == 0
    body.append(f'<circle cx="{rcx + d * math.cos(a)}" cy="{rcy + d * math.sin(a)}" r="{2.2 if hot else 1.2}" fill="{ACCENT if hot else MUTED}"/>')
tonight = f'<circle cx="{rcx + rr * 0.92 * math.cos(-1.6)}" cy="{rcy + rr * 0.92 * math.sin(-1.6)}" r="3" fill="{INK}" class="{appear(22.0, dy=0)}"/>'
body.append(tonight)
text(RX, 214, "INSPECTION OF", 11, DIM); text(RX, 228, "LAST 40 NIGHTS", 11, DIM); text(RX + RW, 228, "35 HOT", 11, ACCENT, anchor="end")

caption(RX, 262, RW, "ANALYTICS", "TONIGHT")
counts = [(0, "0"), (11.0, "1"), (14.5, "2"), (18.0, "3"), (21.5, "4")]
for i, (t, s) in enumerate(counts):
    end = counts[i + 1][0] if i + 1 < len(counts) else LOOP
    bignum(RX + 4, 282, s, GREEN, span(t, end, fade=0.15), w=22, h=38)
text(RX, 340, "PRS OPENED", 11, DIM)
bignum(RX + 100, 282, "57", ACCENT, "", w=22, h=38)
text(RX + 168, 320, "%", 12, FG2)
text(RX + 100, 340, "PR YIELD", 11, DIM)
bignum(RX + 200, 282, "6", ROSE, "", w=22, h=38)
text(RX + 200, 340, "STREAK", 11, DIM)

text(RX, 372, "┼ PR YIELD BY JOB", 12, FG2)
body.append(f'<line x1="{RX}" y1="{380}" x2="{RX + RW}" y2="{380}" stroke="{LINE}"/>')
yields = [("security", 0.15), ("maintainability", 0.7), ("performance", 0.35), ("conventions", 0.55), ("architecture", 0.4), ("smoke-tests", 0.1), ("issues", 0.45)]
y = 398
for name, v in yields:
    text(RX, y + 4, name, 11, FG2)
    bw = 120
    body.append(f'<rect x="{RX + 128}" y="{y - 5}" width="{bw}" height="9" fill="{LINE}"/>')
    body.append(f'<rect x="{RX + 128}" y="{y - 5}" width="{bw * v}" height="9" fill="{GREEN}" class="{grow(0.5, 2.5)}" style="transform-origin:{RX + 128}px {y}px"/>')
    text(RX + RW, y + 4, f"{int(v * 100)}%", 11, TEXT, anchor="end")
    y += 17

# ---- status line + timeline
sy = 548
text(28, sy, "›", 13, ACCENT)
sleep = span(0, 28.3, fade=0.3)
text(44, sy, "~/.local/state/nightshift  ·  ~/code/your-app", 12.5, MUTED, sleep)
css.append(".z{animation:kf-z 2.4s ease-in-out infinite}@keyframes kf-z{0%,100%{opacity:.25}50%{opacity:1}}")
body.append(f'<g class="{sleep}"><text x="{W - 120}" y="{sy}" font-family="{MONO}" font-size="13" fill="{DIM}" class="z">z</text><text x="{W - 106}" y="{sy - 6}" font-family="{MONO}" font-size="15" fill="{DIM}" class="z" style="animation-delay:-.8s">z</text><text x="{W - 90}" y="{sy - 13}" font-family="{MONO}" font-size="17" fill="{DIM}" class="z" style="animation-delay:-1.6s">z</text></g>')
morning = span(28.5, LOOP, fade=0.4)
text(44, sy, "good morning. four PRs are waiting. press c to talk about any of them.", 12.5, INK, morning)

tx0, tx1, ty = 28, W - 28, 600
body.append(f'<line x1="{tx0}" y1="{ty}" x2="{tx1}" y2="{ty}" stroke="{LINE}" stroke-width="2"/>')
for frac, label in [(0, "23:00"), (0.34, "05:12"), (0.66, "08:00"), (1, "noon")]:
    x = tx0 + (tx1 - tx0) * frac
    body.append(f'<line x1="{x}" y1="{ty - 5}" x2="{x}" y2="{ty + 5}" stroke="{MUTED}"/>')
    text(x, ty + 22, label, 11, DIM, anchor="middle")
wx0, wx1 = tx0 + (tx1 - tx0) * 0.34, tx0 + (tx1 - tx0) * 0.66
body.append(f'<line x1="{wx0}" y1="{ty}" x2="{wx1}" y2="{ty}" stroke="{ACCENT}" stroke-width="3" stroke-linecap="round"/>')
css.append(f".dot{{animation:kf-dot {LOOP}s linear infinite}}@keyframes kf-dot{{0%{{transform:translateX(0)}}100%{{transform:translateX({tx1 - tx0}px)}}}}")
body.append(f'<circle cx="{tx0}" cy="{ty}" r="6" fill="{INK}" class="dot"/>')

# scanline
css.append(f".scan{{animation:kf-scan 7s linear infinite}}@keyframes kf-scan{{0%{{transform:translateY(-20px)}}100%{{transform:translateY({H + 20}px)}}}}")
body.append(f'<rect x="0" y="0" width="{W}" height="14" fill="{INK}" opacity=".035" class="scan"/>')

svg = (
    f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" role="img" aria-label="Nightshift demo" xml:space="preserve">\n'
    "<title>Nightshift</title>\n"
    "<desc>The Nightshift console. At 05:12 the jobs run one by one; four pull requests are ready by morning.</desc>\n"
    "<style>\n" + "\n".join(css) + "\n"
    "@media (prefers-reduced-motion: reduce) { * { animation-duration: .001s !important; animation-iteration-count: 1 !important; animation-fill-mode: forwards !important; } }\n"
    "</style>\n" + "\n".join(body) + "\n</svg>\n"
)
(pathlib.Path(__file__).parent / "nightshift-demo.svg").write_text(svg)
print(len(svg), "bytes")

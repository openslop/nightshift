#!/usr/bin/env python3
"""Emits assets/features/*.svg: one short animated card per feature, drawn in the console's own palette.

Each card is a LOOP-second loop of plain SVG and CSS, so it plays on GitHub with no script and no GIF.
Run from anywhere: python3 assets/gen-features.py
"""
import html
import pathlib

OUT = pathlib.Path(__file__).parent / "features"
W, H = 640, 360
BG, PANEL, LINE, LINEHI = "#140e11", "#1a1316", "#2e282b", "#4a4046"
DIM, MUTED, FG2, TEXT, INK = "#4f454a", "#6f6167", "#9d8b93", "#ded6da", "#f3eef0"
ACCENT, ACCENT2, GREEN, ROSE, WARN, RED = "#9d9df0", "#6b6bcf", "#5fbf8a", "#d29cb8", "#b57e38", "#e0605a"
SELBAR = "#2c2329"
MONO = "'Share Tech Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace"


class Card:
    def __init__(self, name, title, desc, loop):
        self.name, self.title, self.desc, self.loop = name, title, desc, loop
        self.css, self.body, self.n = [], [], 0

    # ---- timing helpers. Every class is a keyframe on the card's own loop.
    def pct(self, t):
        return f"{max(0.0, min(t, self.loop)) / self.loop * 100:.2f}%"

    def cls(self, prefix):
        self.n += 1
        return f"{prefix}{self.n}"

    def appear(self, t, dy=4, fade=0.35):
        c = self.cls("a")
        self.css.append(
            f".{c}{{animation:kf-{c} {self.loop}s infinite both}}@keyframes kf-{c}{{0%,{self.pct(t - 0.01)}{{opacity:0;transform:translate(0,{dy}px)}}{self.pct(t + fade)},100%{{opacity:1;transform:translate(0,0)}}}}"
        )
        return c

    def span(self, t, until, fade=0.2):
        c = self.cls("s")
        tail = "" if until >= self.loop else f"{self.pct(until + fade)},100%{{opacity:0}}"
        self.css.append(
            f".{c}{{animation:kf-{c} {self.loop}s infinite both}}@keyframes kf-{c}{{0%,{self.pct(t - 0.01)}{{opacity:0}}{self.pct(t + fade)},{self.pct(until)}{{opacity:1}}{tail}}}"
        )
        return c

    def grow(self, t0, t1):
        c = self.cls("g")
        self.css.append(
            f".{c}{{animation:kf-{c} {self.loop}s linear infinite both;transform-box:fill-box;transform-origin:left center}}@keyframes kf-{c}{{0%,{self.pct(t0 - 0.01)}{{transform:scaleX(0)}}{self.pct(t1)},100%{{transform:scaleX(1)}}}}"
        )
        return c

    def blink(self, period=1.0):
        c = self.cls("b")
        self.css.append(f".{c}{{animation:kf-{c} {period}s steps(1) infinite}}@keyframes kf-{c}{{0%{{opacity:1}}50%{{opacity:0}}}}")
        return c

    def spin(self, period):
        c = self.cls("r")
        self.css.append(
            f".{c}{{animation:kf-{c} {period}s linear infinite;transform-box:fill-box;transform-origin:center}}@keyframes kf-{c}{{to{{transform:rotate(360deg)}}}}"
        )
        return c

    # ---- drawing helpers
    def text(self, x, y, s, size=13, fill=TEXT, cls="", anchor="start", weight=400):
        self.body.append(
            f'<text x="{x}" y="{y}" font-family="{MONO}" font-size="{size}" font-weight="{weight}" fill="{fill}" text-anchor="{anchor}" class="{cls}" style="white-space:pre">{html.escape(s)}</text>'
        )

    def raw(self, s):
        self.body.append(s)

    def caption(self, x, y, w, left, right):
        self.text(x, y, left, 12, FG2)
        self.text(x + w, y, right, 12, DIM, anchor="end")
        self.raw(f'<line x1="{x}" y1="{y + 8}" x2="{x + w}" y2="{y + 8}" stroke="{LINE}"/>')

    def chrome(self):
        self.raw(f'<rect width="{W}" height="{H}" fill="{BG}"/>')
        self.raw(
            f'<defs><pattern id="dots" width="40" height="28" patternUnits="userSpaceOnUse"><circle cx="20" cy="14" r="1" fill="{LINE}"/></pattern>'
            f'<clipPath id="moonclip"><circle cx="0" cy="0" r="9"/></clipPath></defs>'
        )
        self.raw(f'<rect width="{W}" height="{H}" fill="url(#dots)"/>')
        self.raw(f'<rect x="0" y="0" width="{W}" height="34" fill="{PANEL}"/><line x1="0" y1="34.5" x2="{W}" y2="34.5" stroke="{LINE}"/>')
        self.raw(f'<g transform="translate(24,17)"><circle r="7" fill="none" stroke="{INK}" stroke-width="2"/><circle r="7" fill="{INK}" clip-path="url(#moonclip)" transform="translate(-4.5,0)"/></g>')
        self.text(40, 22, "nightshift", 13, INK, weight=600)
        self.text(W - 20, 22, self.title, 12, FG2, anchor="end")

    def digit(self, x, y, d, w, h, col, cls):
        seg = {"0": "abcdef", "1": "bc", "2": "abdeg", "3": "abcdg", "4": "bcfg", "5": "acdfg", "6": "acdefg", "7": "abc", "8": "abcdefg", "9": "abcdfg"}[d]
        m = y + h / 2
        segs = {"a": (x, y, x + w, y), "b": (x + w, y, x + w, m), "c": (x + w, m, x + w, y + h), "d": (x, y + h, x + w, y + h), "e": (x, m, x, y + h), "f": (x, y, x, m), "g": (x, m, x + w, m)}
        self.raw(f'<g class="{cls}" stroke="{col}" stroke-width="2" stroke-linecap="round">')
        for k in seg:
            x1, y1, x2, y2 = segs[k]
            self.raw(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}"/>')
        self.raw("</g>")

    def bignum(self, x, y, s, col=INK, cls="", w=18, h=34, gap=10):
        for ch in s:
            if ch == ":":
                self.raw(f'<g class="{cls}"><circle cx="{x + 4}" cy="{y + h * 0.3}" r="2" fill="{col}"/><circle cx="{x + 4}" cy="{y + h * 0.7}" r="2" fill="{col}"/></g>')
                x += 14
            else:
                self.digit(x, y, ch, w, h, col, cls)
                x += w + gap
        return x

    def write(self):
        OUT.mkdir(exist_ok=True)
        svg = (
            f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" role="img" aria-label="{html.escape(self.title)}">\n'
            f"<title>{html.escape(self.title)}</title>\n<desc>{html.escape(self.desc)}</desc>\n"
            "<style>\n" + "\n".join(self.css) + "\n</style>\n" + "\n".join(self.body) + "\n</svg>\n"
        )
        (OUT / f"{self.name}.svg").write_text(svg)
        print(f"{self.name}.svg  {len(svg):,} bytes")


JOBS = [
    ("security", "NO-OP", None, 0.9),
    ("maintainability", "PR OPEN", "#313", 1.0),
    ("performance", "PR OPEN", "#314", 0.8),
    ("conventions-followup", "NO-OP", None, 0.7),
    ("conventions", "PR OPEN", "#315", 0.6),
    ("architecture", "PR OPEN", "#316", 1.2),
    ("smoke-tests", "NO-OP", None, 0.4),
    ("issues", "PR OPEN", "#317", 0.9),
]


# ---------------------------------------------------------------- 1. one small job at a time
def card_jobs():
    c = Card("jobs", "one job at a time", "Eight jobs run one after another. Each bar grows while its job runs, then the row says PR OPEN or NO-OP.", 20.0)
    c.chrome()
    c.caption(28, 58, W - 56, "TONIGHT", "05:12 → 07:31")
    c.text(28, 84, "JOB", 12, FG2); c.text(300, 84, "STATUS", 12, FG2); c.text(392, 84, "DUR", 12, FG2); c.text(470, 84, "PR", 12, FG2)
    t = 1.0
    for i, (job, status, pr, d) in enumerate(JOBS):
        y = 108 + i * 28
        dur = 1.1 + d
        sel = c.span(t, t + dur, fade=0.1)
        c.raw(f'<rect x="20" y="{y - 14}" width="{W - 40}" height="22" fill="{SELBAR}" class="{sel}"/>')
        c.text(24, y + 2, "▸", 12, ACCENT, sel)
        c.text(40, y + 2, job, 13, TEXT)
        c.raw(f'<rect x="200" y="{y - 6}" width="88" height="8" fill="{LINEHI}" class="{c.grow(t, t + dur)}"/>')
        col = GREEN if pr else FG2
        c.text(300, y + 2, status, 12, col, c.appear(t + dur))
        c.text(392, y + 2, f"{int(6 + d * 6)}m", 12, MUTED, c.appear(t + dur))
        if pr:
            c.text(470, y + 2, pr, 12, GREEN, c.appear(t + dur))
        else:
            c.text(470, y + 2, "–", 12, DIM, c.appear(t + dur))
        c.raw(f'<circle cx="290" cy="{y - 2}" r="3" fill="{col}" class="{c.appear(t + dur, dy=0)}"/>')
        t += dur + 0.15
    done = c.appear(t + 0.2)
    c.text(28, H - 22, "shift done · 4 pull requests · 4 quiet nights", 12, GREEN, done)
    c.text(W - 28, H - 22, "nothing is better than a bad change", 12, DIM, done, anchor="end")
    c.write()


# ---------------------------------------------------------------- 2. pull requests by morning
def card_morning():
    c = Card("morning", "pull requests by morning", "A clock runs from 05:12 to 08:00 while four pull requests appear, each with a short plain title.", 14.0)
    c.chrome()
    c.caption(28, 58, 220, "SHIFT", "CHRONOMETER")
    times = [(0, "05:12"), (2.5, "05:23"), (5.0, "05:51"), (7.5, "06:04"), (10.0, "06:41"), (12.0, "07:31")]
    for i, (t, s) in enumerate(times):
        end = times[i + 1][0] if i + 1 < len(times) else c.loop
        c.bignum(30, 78, s, INK, c.span(t, end, fade=0.12), w=24, h=42, gap=12)
    c.text(28, 150, "2026", 11, DIM); c.text(28, 166, "SEP 08", 12, FG2)
    c.text(100, 150, "SHIFT", 11, DIM)
    c.text(100, 166, "RUNNING", 12, ACCENT, c.span(0, 12.0, fade=0.1))
    c.text(100, 166, "DONE", 12, GREEN, c.appear(12.0, dy=0))
    # the moon fills up as morning gets close
    c.raw(f'<g transform="translate(220,158)"><circle r="12" fill="none" stroke="{MUTED}" stroke-width="1.5"/>')
    for i, w in enumerate([2, 6, 10, 14, 18, 24]):
        t = times[i][0]
        end = times[i + 1][0] if i + 1 < len(times) else c.loop
        c.raw(f'<clipPath id="m{i}"><rect x="{-12}" y="-12" width="{w}" height="24"/></clipPath><circle r="12" fill="{ACCENT}" clip-path="url(#m{i})" class="{c.span(t, end, fade=0.1)}"/>')
    c.raw("</g>")
    c.text(28, 200, "you are asleep.", 12, MUTED)
    c.text(28, 218, "nothing pushes to main.", 12, MUTED)
    c.text(28, 236, "nothing merges by itself.", 12, MUTED)

    c.caption(290, 58, W - 318, "PULL REQUESTS", "BY MORNING")
    prs = [
        (2.5, "#313", "maintainability", "Split the 900-line router into three files"),
        (5.0, "#314", "performance", "Cache the settings query; it ran on every request"),
        (7.5, "#315", "conventions", "Use the shared logger in the six places that print"),
        (10.0, "#316", "architecture", "Move retry logic into one helper"),
    ]
    for i, (t, num, job, title) in enumerate(prs):
        y = 84 + i * 62
        a = c.appear(t, dy=8)
        c.raw(f'<rect x="290" y="{y}" width="{W - 318}" height="50" fill="{PANEL}" stroke="{LINE}" class="{a}"/>')
        c.raw(f'<rect x="290" y="{y}" width="3" height="50" fill="{GREEN}" class="{a}"/>')
        c.text(304, y + 20, num, 13, GREEN, a, weight=600)
        c.text(350, y + 20, job, 12, ACCENT, a)
        c.text(W - 40, y + 20, "open", 11, MUTED, a, anchor="end")
        c.text(304, y + 38, title, 12, TEXT, a)
    c.text(290, H - 22, "read them with coffee. merge what you like.", 12, DIM, c.appear(12.3))
    c.write()


# ---------------------------------------------------------------- 3. the reviewer
def card_review():
    c = Card("review", "a reviewer every two hours", "A day-long timeline ticks every two hours. Most ticks say quiet; one leaves a short review on a pull request.", 14.0)
    c.chrome()
    c.caption(28, 58, W - 56, "REVIEW LEDGER", "EVERY 2 HOURS · :07 PAST")
    y0 = 96
    c.raw(f'<line x1="40" y1="{y0}" x2="{W - 40}" y2="{y0}" stroke="{LINEHI}"/>')
    hours = ["07:07", "09:07", "11:07", "13:07", "15:07", "17:07", "19:07", "21:07"]
    step = (W - 80) / (len(hours) - 1)
    notes = {1: ("#314", "the cache key misses the tenant id. one line."), 5: ("#321", "tests cover the happy path only. add the empty case.")}
    for i, h in enumerate(hours):
        x = 40 + i * step
        t = 0.8 + i * 1.5
        c.raw(f'<line x1="{x}" y1="{y0 - 5}" x2="{x}" y2="{y0 + 5}" stroke="{MUTED}"/>')
        c.text(x, y0 + 22, h, 11, DIM, anchor="middle")
        if i in notes:
            a = c.appear(t, dy=0)
            c.raw(f'<circle cx="{x}" cy="{y0}" r="6" fill="{ROSE}" class="{a}"/>')
            c.text(x, y0 - 14, "note", 11, ROSE, a, anchor="middle")
        else:
            a = c.appear(t, dy=0)
            c.raw(f'<circle cx="{x}" cy="{y0}" r="4" fill="none" stroke="{GREEN}" stroke-width="1.5" class="{a}"/>')
            c.text(x, y0 - 14, "quiet", 11, MUTED, a, anchor="middle")
    # the sweep head
    head = c.cls("h")
    c.css.append(f".{head}{{animation:kf-{head} {c.loop}s linear infinite both}}@keyframes kf-{head}{{0%{{transform:translate(0,0)}}{c.pct(11.5)},100%{{transform:translate({(len(hours) - 1) * step:.0f}px,0)}}}}")
    c.raw(f'<line x1="40" y1="{y0 - 22}" x2="40" y2="{y0 + 10}" stroke="{ACCENT}" stroke-width="1.5" class="{head}"/>')
    # the two reviews, as cards
    for k, (i, (num, body)) in enumerate(notes.items()):
        t = 0.8 + i * 1.5 + 0.3
        y = 150 + k * 92
        a = c.appear(t, dy=8)
        c.raw(f'<rect x="40" y="{y}" width="{W - 80}" height="74" fill="{PANEL}" stroke="{LINE}" class="{a}"/>')
        c.raw(f'<rect x="40" y="{y}" width="3" height="74" fill="{ROSE}" class="{a}"/>')
        c.text(56, y + 22, num, 13, ROSE, a, weight=600)
        c.text(104, y + 22, "review · one comment", 12, FG2, a)
        c.text(W - 56, y + 22, "2 min", 11, DIM, a, anchor="end")
        c.text(56, y + 46, body, 12, TEXT, a)
        c.text(56, y + 64, "left as a normal PR review. quiet unless it finds something.", 11, MUTED, a)
    c.write()


# ---------------------------------------------------------------- 4. the console
def card_console():
    c = Card("console", "the console", "Three console panels: a seven-segment clock, a radar sweep over the last nights, and a job-by-night dot matrix filling in.", 12.0)
    c.chrome()
    c.caption(28, 58, 220, "SHIFT", "CHRONOMETER")
    for i, s in enumerate(["23:07:41", "23:07:42", "23:07:43", "23:07:44"]):
        c.bignum(30, 76, s, INK, c.span(i * 3.0, (i + 1) * 3.0, fade=0.05), w=16, h=30, gap=8)
    c.text(28, 134, "2026", 11, DIM); c.text(28, 150, "SEP 09", 12, FG2)
    c.text(100, 134, "UPTIME", 11, DIM); c.text(100, 150, "0:04:12", 12, FG2)
    c.text(170, 134, "SHIFT", 11, DIM); c.text(170, 150, "IDLE", 12, FG2)

    c.caption(280, 58, W - 308, "SIGNALS", "RADAR")
    cx, cy = 460, 140
    for r in (16, 34, 52, 70):
        c.raw(f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="none" stroke="{LINE}"/>')
    c.raw(f'<line x1="{cx - 74}" y1="{cy}" x2="{cx + 74}" y2="{cy}" stroke="{LINE}"/><line x1="{cx}" y1="{cy - 74}" x2="{cx}" y2="{cy + 74}" stroke="{LINE}"/>')
    import math
    for k in range(40):
        ang = k / 40 * 2 * math.pi
        rr = 20 + (k * 37 % 50)
        x, y = cx + math.cos(ang) * rr, cy + math.sin(ang) * rr
        col = GREEN if k % 5 else ROSE
        c.raw(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="1.6" fill="{col}"/>')
    c.raw(f'<defs><linearGradient id="sw" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="{ACCENT}" stop-opacity="0"/><stop offset="1" stop-color="{ACCENT}" stop-opacity="0.9"/></linearGradient></defs>')
    c.raw(f'<g transform="translate({cx},{cy})"><g class="{c.spin(4.0)}"><path d="M0 0 L74 0 A74 74 0 0 0 {74 * math.cos(-0.7):.1f} {74 * math.sin(-0.7):.1f} Z" fill="url(#sw)" opacity="0.6"/><line x1="0" y1="0" x2="74" y2="0" stroke="{ACCENT}" stroke-width="1.5"/></g></g>')
    c.text(280, 232, "LAST 40 NIGHTS", 11, DIM); c.text(W - 28, 232, "38 HOT", 12, ACCENT, anchor="end")

    c.caption(28, 178, 220, "DEEP FIELD", "NIGHTS × JOBS")
    # a little ridge line, drawn once and swept
    pts = []
    for i in range(30):
        x = 30 + i * 7.2
        y = 220 - (abs(((i * 7) % 11) - 5) * 3) - (6 if 8 < i < 20 else 0)
        pts.append(f"{x:.0f},{y}")
    for j in range(4):
        c.raw(f'<polyline points="{" ".join(p.split(",")[0] + "," + str(int(p.split(",")[1]) + j * 9) for p in pts)}" fill="none" stroke="{[ACCENT, ACCENT2, MUTED, DIM][j]}" stroke-width="1" stroke-dasharray="0.01 3" stroke-linecap="round" class="{c.appear(0.4 + j * 0.3, dy=0)}"/>')

    c.caption(28, 270, W - 56, "JOB × NIGHT MATRIX", "● pr  ○ quiet")
    rows = ["security", "maintainab", "performanc", "conventio"]
    for r, name in enumerate(rows):
        y = 292 + r * 16
        c.text(28, y + 4, name, 11, TEXT)
        for k in range(38):
            x = 130 + k * 13
            t = 0.3 + k * 0.22 + r * 0.05
            filled = (k * 7 + r * 3) % 5 in (0, 2)
            a = c.appear(t, dy=0, fade=0.15)
            if filled:
                c.raw(f'<circle cx="{x}" cy="{y}" r="2.6" fill="{GREEN}" class="{a}"/>')
            else:
                c.raw(f'<circle cx="{x}" cy="{y}" r="2.6" fill="none" stroke="{MUTED}" class="{a}"/>')
    c.write()


# ---------------------------------------------------------------- 5. pick up the conversation
def card_resume():
    c = Card("resume", "pick up the conversation", "In the console, the cursor rests on a job. A c key is pressed, a terminal opens with claude --resume, and the agent picks up where it stopped.", 14.0)
    c.chrome()
    c.caption(28, 58, W - 56, "JOB", "SESSION")
    rows = [("security", "NO-OP", "–"), ("maintainability", "PR OPEN #313", "42cc59c"), ("performance", "PR OPEN #314", "de65abc")]
    for i, (job, st, sess) in enumerate(rows):
        y = 84 + i * 24
        if i == 1:
            c.raw(f'<rect x="20" y="{y - 14}" width="{W - 40}" height="22" fill="{SELBAR}" class="{c.span(0, 3.6, fade=0.05)}"/>')
            c.text(24, y + 2, "▸", 12, ACCENT, c.span(0, 3.6, fade=0.05))
        c.text(40, y + 2, job, 13, TEXT)
        c.text(260, y + 2, st, 12, GREEN if "PR" in st else FG2)
        c.text(470, y + 2, sess, 12, ACCENT if sess != "–" else DIM)
    # the key press
    k = c.span(2.0, 3.4, fade=0.1)
    c.raw(f'<rect x="{W - 120}" y="60" width="22" height="22" rx="3" fill="{PANEL}" stroke="{INK}" class="{k}"/>')
    c.text(W - 109, 76, "c", 13, INK, k, anchor="middle", weight=600)
    c.text(W - 92, 76, "continue", 12, FG2, k)
    # the terminal
    ty = 158
    a = c.appear(3.6, dy=10)
    c.raw(f'<rect x="28" y="{ty}" width="{W - 56}" height="{H - ty - 30}" fill="{PANEL}" stroke="{LINEHI}" class="{a}"/>')
    c.raw(f'<rect x="28" y="{ty}" width="{W - 56}" height="20" fill="{SELBAR}" class="{a}"/>')
    c.text(40, ty + 14, "night 2026-09-08 · maintainability · a copy of the transcript", 11, MUTED, a)
    lines = [
        (4.0, "$ claude --resume 42cc59c", INK),
        (5.2, "▐ Picking up the maintainability job from last night.", FG2),
        (6.0, "▐ I split the router into three files and opened #313.", FG2),
        (7.4, "> why did you leave the auth routes in one file?", ACCENT),
        (9.0, "▐ Open PR #298 touches src/auth.ts, so it was off limits", FG2),
        (9.8, "▐ tonight. The guard would have blocked the push.", FG2),
        (10.8, "▐ Want me to do that half once #298 merges?", FG2),
        (12.0, "> yes, and keep the same layout", ACCENT),
    ]
    for i, (t, s, col) in enumerate(lines):
        c.text(40, ty + 40 + i * 17, s, 12, col, c.appear(t, dy=0, fade=0.2))
    c.raw(f'<rect x="{40 + 32 * 7.2:.0f}" y="{ty + 40 + 7 * 17 - 11}" width="7" height="14" fill="{ACCENT}" fill-opacity="0.8" class="{c.blink()}"/>')
    c.write()


# ---------------------------------------------------------------- 6. the guard
def card_guard():
    c = Card("guard", "stays out of your way", "A job wants to change three files. One is touched by a teammate's open pull request, so the guard marks it off limits and the job leaves it alone.", 14.0)
    c.chrome()
    c.caption(28, 58, 280, "TONIGHT'S CHANGE", "performance")
    files = [("src/db/settings.ts", None), ("src/auth.ts", "#298"), ("src/cache/keys.ts", None)]
    for i, (f, pr) in enumerate(files):
        y = 86 + i * 26
        c.text(40, y + 2, f, 13, TEXT, c.appear(0.6 + i * 0.4))
        c.raw(f'<circle cx="30" cy="{y - 2}" r="3" fill="{MUTED}" class="{c.appear(0.6 + i * 0.4, dy=0)}"/>')
    c.caption(340, 58, W - 368, "OPEN PULL REQUESTS", "yours and your team's")
    prs = [("#298", "a teammate", "src/auth.ts, src/login.ts"), ("#301", "a teammate", "docs/api.md")]
    for i, (num, who, fl) in enumerate(prs):
        y = 86 + i * 40
        a = c.appear(1.2 + i * 0.4)
        c.text(352, y + 2, num, 13, ROSE, a, weight=600)
        c.text(400, y + 2, who, 12, MUTED, a)
        c.text(352, y + 20, fl, 11, FG2, a)
    # the guard runs
    gy = 190
    c.caption(28, gy, W - 56, "MERGE-CONFLICT GUARD", "bin/guard.sh")
    run = c.appear(3.0)
    c.text(40, gy + 26, "$ guard.sh nightshift/performance-20260908-0532", 12, INK, run)
    c.raw(f'<rect x="40" y="{gy + 36}" width="{W - 80}" height="6" fill="{LINEHI}" class="{c.grow(3.2, 5.0)}"/>')
    hit = c.appear(5.2)
    # the red strike across src/auth.ts
    c.raw(f'<rect x="20" y="{86 + 26 - 14}" width="300" height="22" fill="{RED}" fill-opacity="0.14" class="{hit}"/>')
    c.raw(f'<circle cx="30" cy="{86 + 26 - 2}" r="3" fill="{RED}" class="{hit}"/>')
    c.text(300, 86 + 26 + 2, "#298", 12, RED, hit, anchor="end")
    c.text(40, gy + 62, "✗ src/auth.ts is in open PR #298 · off limits tonight", 12, RED, hit)
    drop = c.appear(6.8)
    c.text(40, gy + 82, "→ change dropped from tonight's branch", 12, WARN, drop)
    c.raw(f'<line x1="40" y1="{86 + 26 - 2}" x2="130" y2="{86 + 26 - 2}" stroke="{TEXT}" stroke-width="1.2" class="{drop}"/>')
    ok = c.appear(8.4)
    c.text(40, gy + 108, "✓ no shared files with any open PR · guard ok · pushed", 12, GREEN, ok)
    c.text(40, gy + 128, "the guard output goes in the PR body. never push while it fails.", 11, MUTED, c.appear(9.4))
    c.text(28, H - 22, "you decide what merges. it only ever opens pull requests.", 12, DIM, c.appear(10.4))
    c.write()


if __name__ == "__main__":
    card_jobs()
    card_morning()
    card_review()
    card_console()
    card_resume()
    card_guard()

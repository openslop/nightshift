// The bridge: layout, views, input, and the hand-off into Claude Code.
"use strict";

const os = require("node:os");
const { spawnSync, spawn } = require("node:child_process");
const { Screen, enter, leave, decodeKeys, mix } = require("./term");
const { themes } = require("./theme");
const data = require("./data");
const W = require("./widgets");
const FX = require("./fx");
const CH = require("./charts");
const M = require("./metrics");

const VERSION = require("../package.json").version;
const HOME = os.homedir();
const tilde = (p) => (p && p.startsWith(HOME) ? "~" + p.slice(HOME.length) : p || "");

// ---------- formatting ----------
const pad = (s, n) => String(s).padEnd(n).slice(0, n);
const rpad = (s, n) => String(s).padStart(n).slice(-n);
function fmtDur(ms) {
  if (ms == null || Number.isNaN(ms)) return "—";
  const s = Math.max(0, Math.round(ms / 1000));
  if (s < 60) return s + "s";
  const m = Math.floor(s / 60);
  if (m < 60) return m + "m" + String(s % 60).padStart(2, "0");
  return Math.floor(m / 60) + "h" + String(m % 60).padStart(2, "0");
}
function fmtRel(ms) {
  const s = Math.abs(ms) / 1000;
  const f = s < 3600 ? Math.round(s / 60) + "m" : s < 86400 * 2 ? Math.round(s / 3600) + "h" : Math.round(s / 86400) + "d";
  return ms >= 0 ? "in " + f : f + " ago";
}
const hhmm = (t) => (t ? new Date(t).toTimeString().slice(0, 5) : "—");
const hhmmss = (t) => new Date(t).toTimeString().slice(0, 8);
const MON = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const DAY = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

function wrap(text, w) {
  const out = [];
  for (const para of String(text).replace(/\r/g, "").split("\n")) {
    if (!para.trim()) { out.push(""); continue; }
    const indent = (para.match(/^\s*(?:[-*•]\s+)?/) || [""])[0].replace(/\S/g, " ");
    let line = "";
    for (const word of para.split(/\s+/)) {
      if (!word) continue;
      if (line && line.length + 1 + word.length > w) { out.push(line); line = indent + word; }
      else line = line ? line + " " + word : word;
    }
    if (line) out.push(line);
  }
  return out;
}

const STATUS = {
  pr: { ch: "●", label: "PR OPEN", color: "ok" },
  noop: { ch: "○", label: "NO-OP", color: "fg2" },
  done: { ch: "◌", label: "DONE", color: "fg2" },
  empty: { ch: "·", label: "EMPTY", color: "dim" },
  running: { ch: "◉", label: "RUNNING", color: "accent" },
  timeout: { ch: "◔", label: "TIMEOUT", color: "warn" },
  error: { ch: "×", label: "ERROR", color: "bad" },
};

// ---------- banner font ----------
const FONT = {
  N: ["█▄  █", "█ ▀▄█", "█   █"], I: [" ▀█▀ ", "  █  ", " ▄█▄ "], G: ["▄▀▀▀▄", "█  ▄▄", "▀▄▄▄▀"],
  H: ["█   █", "█▀▀▀█", "█   █"], T: ["▀▀█▀▀", "  █  ", "  █  "], S: ["▄▀▀▀▄", "▀▀▀▀▄", "▀▄▄▄▀"],
  F: ["█▀▀▀▀", "█▀▀▀ ", "█    "], B: ["█▀▀▀▄", "█▀▀▀▄", "█▄▄▄▀"], R: ["█▀▀▀▄", "█▀▀▀▄", "█   █"],
  D: ["█▀▀▀▄", "█   █", "█▄▄▄▀"], E: ["█▀▀▀▀", "█▀▀▀ ", "█▄▄▄▄"], " ": ["  ", "  ", "  "],
};
function banner(scr, x, y, word, th, t = 0) {
  let cx = x;
  const n = word.length;
  [...word].forEach((ch, i) => {
    const g = FONT[ch] || FONT[" "];
    const c = mix(th.accent2, th.accent, (i / n + t * 0.15) % 1);
    for (let r = 0; r < 3; r++) scr.text(cx, y + r, g[r], { fg: c });
    cx += g[0].length + 1;
  });
  return cx - x;
}

// ---------- app ----------
class App {
  constructor(opts) {
    this.opts = opts;
    this.themeName = opts.theme || "night";
    this.th = themes[this.themeName] || themes.night;
    this.scr = new Screen(opts.out || process.stdout);
    this.t0 = Date.now();
    this.nightIdx = 0; this.jobIdx = 0; this.reviewIdx = 0;
    this.view = "main"; // main | review
    this.overlay = null; // null | report | help
    this.scroll = 0;
    this.msg = ""; this.msgT = 0;
    this.booted = !!opts.noBoot;
    this.stream = [];
    this.streamT = 0;
    this.warpState = null;
    this.cam = { speed: 0.26, angle: 0, tilt: 0.62, zoom: 1, paused: false };
    this.fieldStyle = opts.field || "ridge"; // ridge | mesh (f toggles)
    this.selF = { row: null, col: null };
    this.lastT = 0;
    this.reload();
  }

  reload() {
    try {
      this.data = data.load(this.opts);
      this.err = null;
    } catch (e) {
      this.err = e.message; this.data = { nights: [], review: { ticks: [], ledger: {} }, timers: [], sessions: [], stateDir: "", repoDir: "", jobsOrder: [] };
    }
    this.nightIdx = Math.min(this.nightIdx, Math.max(0, this.data.nights.length - 1));
    this.lastLoad = Date.now();
    const d = this.data;
    this.pool = [...Object.values(d.review.ledger), ...d.sessions.map((s) => s.id.replace(/-/g, "")), ...Object.keys(d.review.ledger).map((n) => "#" + n)];
    this.order = this.jobOrder();
    this.metrics = M.compute(this.data, this.order);
    while (this.stream.length < 8) this.stream.push(FX.streamLine(this.pool));
  }

  get night() { return this.data.nights[this.nightIdx]; }
  get job() { return this.night && this.night.jobs[Math.min(this.jobIdx, this.night.jobs.length - 1)]; }
  get reviews() { return this.data.review.ticks.filter((k) => k.kind === "review").reverse(); }
  get tick() { return this.reviews[this.reviewIdx]; }
  get bg() { return this.opts.opaque ? this.th.bg : null; }

  say(m) { this.msg = m; this.msgT = Date.now(); }

  jobOrder() {
    const seen = new Map();
    for (const n of this.data.nights) for (const j of n.jobs) seen.set(j.name, (seen.get(j.name) || 0) + 1);
    const cfg = (this.data.jobsOrder || []).filter((n) => seen.has(n));
    if (this.data.nights[0]) for (const j of this.data.nights[0].jobs) if (!cfg.includes(j.name)) cfg.push(j.name);
    for (const [n] of [...seen].sort((a, b) => b[1] - a[1])) if (!cfg.includes(n)) cfg.push(n);
    return cfg;
  }

  // ---- input ----
  key(k) {
    if (!this.booted) { this.booted = true; return; }
    if (k === "q" || k === "ctrl-c") return this.quit();
    if (k === "ctrl-l") { this.scr.front = null; return; }
    if (k === "t") { this.themeName = this.themeName === "night" ? "phosphor" : "night"; this.th = themes[this.themeName]; this.scr.front = null; return; }
    if (this.overlay === "help") { this.overlay = null; return; }
    if (k === "?") { this.overlay = "help"; return; }
    if (k === "R") { this.reload(); this.say("state reloaded"); return; }
    if (k === "d") { this.overlay = this.overlay === "deep" ? null : "deep"; return; }
    if (k === "f") { this.fieldStyle = this.fieldStyle === "ridge" ? "mesh" : "ridge"; this.say("deep field: " + this.fieldStyle); return; }
    if (k === "m") { this.overlay = this.overlay === "metrics" ? null : "metrics"; this.overlayT = Date.now(); return; }
    if (k === "<" || k === ",") { this.cam.speed = Math.max(-1.2, this.cam.speed - 0.1); return; }
    if (k === ">" || k === ".") { this.cam.speed = Math.min(1.2, this.cam.speed + 0.1); return; }
    if (k === "+" || k === "=") { this.cam.zoom = Math.min(2.2, this.cam.zoom + 0.1); return; }
    if (k === "-" || k === "_") { this.cam.zoom = Math.max(0.5, this.cam.zoom - 0.1); return; }
    if (k === " " && this.overlay !== "report") { this.cam.paused = !this.cam.paused; return; }
    if (k === "[" ) { this.cam.tilt = Math.max(0.15, this.cam.tilt - 0.08); return; }
    if (k === "]" ) { this.cam.tilt = Math.min(1.4, this.cam.tilt + 0.08); return; }
    if (k === "c") return this.continueConversation();
    if (k === "o") return this.openPR();
    if (k === "esc") { if (this.overlay) this.overlay = null; else if (this.view !== "main") this.view = "main"; return; }
    if (k === "enter") { this.overlay = this.overlay === "report" ? null : "report"; this.scroll = 0; this.overlayT = Date.now(); return; }
    if (k === "r") { this.view = this.view === "review" ? "main" : "review"; this.overlay = null; this.scroll = 0; return; }

    if (this.overlay === "report") {
      if (k === "up" || k === "k") this.scroll = Math.max(0, this.scroll - 1);
      if (k === "down" || k === "j") this.scroll++;
      if (k === "pgup") this.scroll = Math.max(0, this.scroll - 10);
      if (k === "pgdn" || k === " ") this.scroll += 10;
      if (k === "home") this.scroll = 0;
      return;
    }
    const listNav = (len, idxKey) => {
      if (k === "up" || k === "k") this[idxKey] = Math.max(0, this[idxKey] - 1);
      if (k === "down" || k === "j") this[idxKey] = Math.min(Math.max(0, len - 1), this[idxKey] + 1);
      if (k === "home") this[idxKey] = 0;
      if (k === "end") this[idxKey] = Math.max(0, len - 1);
      this.scroll = 0;
    };
    if (this.view === "review") return listNav(this.reviews.length, "reviewIdx");
    const nights = this.data.nights.length;
    if (k === "left" || k === "h") { this.nightIdx = Math.min(nights - 1, this.nightIdx + 1); this.clampJob(); this.nightT = Date.now(); return; }
    if (k === "right" || k === "l") { this.nightIdx = Math.max(0, this.nightIdx - 1); this.clampJob(); this.nightT = Date.now(); return; }
    if (k === "pgup") { this.nightIdx = Math.min(nights - 1, this.nightIdx + 7); this.clampJob(); this.nightT = Date.now(); return; }
    if (k === "pgdn") { this.nightIdx = Math.max(0, this.nightIdx - 7); this.clampJob(); this.nightT = Date.now(); return; }
    listNav(this.night ? this.night.jobs.length : 0, "jobIdx");
  }
  clampJob() { this.jobIdx = Math.max(0, Math.min(this.jobIdx, (this.night ? this.night.jobs.length : 1) - 1)); this.scroll = 0; }

  openPR() {
    const j = this.view === "review" ? null : this.job;
    const url = j && j.prs[0] && j.prs[0].url;
    if (!url) return this.say("no pull request on this row");
    const cmd = process.platform === "darwin" ? "open" : "xdg-open";
    try { spawn(cmd, [url], { detached: true, stdio: "ignore" }).unref(); this.say("opened " + url); }
    catch { this.say("could not open a browser for " + url); }
  }

  continueConversation() {
    let session, title, report, tag;
    if (this.view === "review") {
      const tk = this.tick; if (!tk) return this.say("no review to continue");
      session = tk.session; title = "PR review tick at " + new Date(tk.t).toLocaleString() + " (PRs " + tk.prs.join(", ") + ")"; report = tk.report;
      tag = "review " + hhmm(tk.t);
    } else {
      const j = this.job; if (!j) return this.say("no job selected");
      session = j.session; title = "the `" + j.name + "` job on night " + this.night.label; report = j.log;
      tag = j.name + " · " + this.night.label;
    }
    if (!report && !session) return this.say("nothing to continue: no session and no report");
    const args = session ? ["--resume", session, "--fork-session"]
      : ["You are continuing a Nightshift conversation with the repo owner. Context: " + title + " in " + this.data.repoDir +
        ". The original session transcript is not on this machine, so its final report is pasted below. Read it, then wait for my instructions.\n\n" + report];
    // hyperspace, then hand the terminal to claude
    this.warpState = FX.makeWarp();
    this.warpLabel = "  HANDOFF ▸ " + tag + (session ? "  ▸ session " + session.slice(0, 8) : "  ▸ seeded from report") + "  ";
    const go = () => {
      this.warpState = null;
      this.suspend(() => {
        process.stdout.write("\x1b[2m» nightshift bridge: claude " + (session ? "--resume " + session + " --fork-session" : "(fresh session seeded with the report)") + "\x1b[0m\n\n");
        const r = spawnSync("claude", args, { stdio: "inherit", cwd: this.data.repoDir || process.cwd() });
        if (r.error) process.stdout.write("\x1b[31mcould not start claude: " + r.error.message + "\x1b[0m\n");
      });
      this.reload();
      this.say(session ? "returned from forked session " + session.slice(0, 8) : "returned from seeded session");
    };
    if (this.opts.noWarp) go(); else setTimeout(go, 1100);
  }

  suspend(fn) {
    leave(this.scr.out);
    clearInterval(this.timer);
    process.stdin.pause();
    try { fn(); } finally {
      enter(this.scr.out);
      this.scr.resize();
      this.start();
    }
  }

  quit() {
    clearInterval(this.timer);
    leave(this.scr.out);
    process.exit(0);
  }

  // ---- render ----
  render() {
    const scr = this.scr, th = this.th;
    const t = (Date.now() - this.t0) / 1000;
    const dt = Math.min(0.2, t - this.lastT); this.lastT = t;
    if (!this.cam.paused) this.cam.angle += this.cam.speed * dt;
    scr.clear(this.bg);
    if (!this.booted) { this.renderBoot(t); scr.flush(); return; }
    if (this.warpState) { FX.warp(scr, 0, 0, scr.w, scr.h, this.warpState, th, this.warpLabel); scr.flush(); return; }
    const w = scr.w, h = scr.h;
    const wide = w >= 140 && h >= 30, mid = w >= 104 && h >= 24;
    const side = wide ? 34 : 0, left = mid ? 34 : 0;
    const gap = 2;
    const cx = left ? left + gap : 1, cwAll = w - cx - (side ? side + gap : 1);
    const an = cwAll >= 166 ? Math.min(100, cwAll - 106) : 0; // analytics column beside the terminal
    this.wide = an > 0;
    const cw = cwAll - (an ? an + gap : 0);
    const top = 1, bottom = h - 2;
    if (left) this.renderLeft(1, top, left - 1, bottom - top, t);
    this.renderCenter(cx, top, cw, bottom - top, t);
    if (an) this.renderAnalytics(cx + cw + gap, top, an, bottom - top, t);
    if (side) this.renderRight(w - side, top, side - 1, bottom - top, t);
    this.renderStatus(h - 1, t);
    if (this.overlay === "help") this.renderHelp(t);
    FX.dotField(scr, th);
    FX.scanline(scr, th, t);
    scr.flush();
  }

  renderBoot(t) {
    const scr = this.scr, th = this.th, d = this.data;
    const lines = [
      ["state", tilde(d.stateDir) || this.err || "none"],
      ["repo", tilde(d.repoDir) || "unknown"],
      ["nights", d.nights.length + " indexed · " + d.nights.reduce((n, x) => n + x.jobs.length, 0) + " jobs · " + d.nights.reduce((n, x) => n + x.prs, 0) + " pull requests"],
      ["sessions", d.sessions.length + " on disk · " + d.nights.reduce((n, x) => n + x.jobs.filter((j) => j.session).length, 0) + " linked to jobs"],
      ["timers", d.timers.length ? d.timers.map((x) => x.unit.replace(/\.timer$/, "") + " " + hhmm(x.next)).join(" · ") : "none detected"],
      ["bridge", "online"],
    ];
    const bw = 84, bh = 14;
    const x = Math.max(1, (scr.w - bw) >> 1), y = Math.max(1, (scr.h - bh) >> 1);
    banner(scr, x, y, "NIGHTSHIFT", th, t);
    scr.text(x + 57, y + 2, "v" + VERSION, { fg: th.dim });
    FX.wireframe(scr, x + 64, y, 20, 13, t, th);
    const shown = Math.min(lines.length, Math.floor(t * 6));
    for (let i = 0; i < shown; i++) {
      const [k, v] = lines[i];
      scr.text(x, y + 5 + i, "▸ " + pad(k, 9), { fg: th.fg2 });
      const typed = i === shown - 1 ? Math.floor((t * 6 - i) * 40) : 1e9;
      scr.text(x + 11, y + 5 + i, v.slice(0, typed), { fg: k === "bridge" ? th.ok : th.fg }, 50);
    }
    const p = Math.min(1, t / 1.6);
    for (let i = 0; i < 62; i++) scr.put(x + i, y + 12, i / 62 < p ? "━" : "─", { fg: i / 62 < p ? th.accent : th.line });
    scr.text(x, y + 13, p < 1 ? "initialising bridge" : "press any key", { fg: th.dim });
    FX.dotField(scr, th);
    if (t > 2.6) this.booted = true;
  }

  // Left column: clock, moon, 3D terrain, per-job scopes, night grid.
  renderLeft(x, y, w, h, t) {
    const scr = this.scr, th = this.th, d = this.data;
    W.caption(scr, x, y, w, "shift", "chronometer", th, (t * 0.07) % 1);
    const now = new Date();
    W.bigClock(scr, x, y + 3, hhmmss(now), th, now.getMilliseconds() > 150);
    const nextShift = d.timers.find((k) => /night/i.test(k.unit));
    const running = d.running;
    const todayKey = now.toISOString().slice(0, 10).replace(/-/g, "");
    const today = d.nights[0] && d.nights[0].date === todayKey ? d.nights[0] : null;
    const shift = running ? "RUNNING" : today && today.complete ? "DONE" : "IDLE";
    const cells = [
      [String(now.getFullYear()), MON[now.getMonth()] + " " + String(now.getDate()).padStart(2, "0")],
      ["UPTIME", fmtDur(Date.now() - this.t0)],
      ["SHIFT", shift],
    ];
    cells.forEach(([a, b], i) => {
      const fg = a === "SHIFT" ? (shift === "RUNNING" ? th.accent : shift === "DONE" ? th.ok : th.fg2) : th.fg2;
      scr.text(x + 1 + i * 9, y + 9, a, { fg: th.dim }); scr.text(x + 1 + i * 9, y + 10, b, { fg }, 8);
    });
    // moon gauge: waxes as the next shift approaches
    const phase = nextShift && nextShift.next ? 1 - Math.max(0, Math.min(1, (nextShift.next - Date.now()) / 86400e3)) : 0;
    FX.moon(scr, x + w - 6, y + 8, 5, 3, phase, th);
    scr.text(x + w - 12, y + 11, rpad(nextShift && nextShift.next ? "▲ " + hhmm(nextShift.next) : "▲ —", 12), { fg: th.fg2 });

    let yy = y + 13;
    // 3D terrain of nights × jobs
    W.caption(scr, x, yy, w, "deep field", "nights × jobs", th);
    const th3 = this.wide ? Math.max(9, Math.min(20, Math.floor(h * 0.42))) : Math.max(7, Math.min(13, Math.floor(h * 0.28)));
    const df = this.deepField(x + 1, yy + 3, w - 2, th3, t, this.wide ? 12 : 10, false);
    scr.text(x + 1, yy + 3 + th3, "ROT " + rpad(Math.round(((this.cam.angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2) * 57.3) + "°", 4), { fg: th.dim });
    scr.text(x + w - 14, yy + 3 + th3, rpad(df.rows + "N × " + df.cols + "J", 13), { fg: th.dim });
    yy += th3 + 5;

    // per-job scopes
    const budget = y + h - yy - 6;
    const nScopes = Math.max(0, Math.min(4, Math.floor(budget / 4)));
    const series28 = d.nights.slice(0, 28).reverse();
    for (let i = 0; i < nScopes; i++) {
      const name = this.order[i]; if (!name) break;
      const series = series28.map((n) => { const j = n.jobs.find((k) => k.name === name); return j ? j.dur / 60000 : 0; });
      const cur = this.night && this.night.jobs.find((k) => k.name === name);
      const sel = this.job && this.job.name === name;
      scr.text(x, yy, "JOB L" + (i + 1) + "  " + name.toUpperCase(), { fg: sel ? th.bright : th.fg2 }, w - 8);
      scr.text(x + w - 7, yy, rpad(cur ? fmtDur(cur.dur) : "—", 7), { fg: th.dim });
      W.scope(scr, x + 8, yy + 1, w - 8, 2, series, t + i * 0.7, th, cur && cur.status === "pr" ? th.ok : sel ? th.accent : th.fg);
      scr.text(x, yy + 1, "L M H", { fg: th.line });
      for (let k = 0; k < w; k++) scr.put(x + k, yy + 3, "╌", { fg: th.line });
      yy += 4;
    }
    if (yy + 5 < y + h) {
      W.caption(scr, x, yy, w, "system map", "night grid", th);
      const gh = Math.max(1, y + h - yy - 4);
      W.nightGrid(scr, x + 1, yy + 3, w - 2, gh, d.nights, this.night, th, t);
    }
    scr.text(x + w - 6, y + h - 1, "NORMAL", { fg: th.dim });
    scr.text(x, y + h - 1, this.themeName.toUpperCase(), { fg: th.dim });
  }

  // Draws the nights × jobs field into a rect and returns its anchors. Selection is tweened.
  deepField(x, y, w, h, t, maxRows, labels) {
    const scr = this.scr, th = this.th, d = this.data;
    const rows = Math.min(maxRows, d.nights.length);
    const nights = d.nights.slice(0, rows).reverse();
    const order = this.order.slice(0, 9);
    const grid = nights.map((n) => order.map((name) => { const j = n.jobs.find((k) => k.name === name); return j ? Math.min(1, j.dur / (30 * 60000)) : null; }));
    const pulse = new Set(), sparks = new Set();
    nights.forEach((n, r) => n.jobs.forEach((j) => { const c = order.indexOf(j.name); if (c < 0) return; if (j.status === "running") pulse.add(r + "," + c); if (j.status === "pr") sparks.add(r + "," + c); }));
    const selRow = nights.indexOf(this.night), selCol = this.job ? order.indexOf(this.job.name) : -1;
    const tw = (cur, target) => (cur == null || target < 0 ? (target < 0 ? null : target) : cur + (target - cur) * 0.18);
    this.selF.row = tw(this.selF.row, selRow); this.selF.col = tw(this.selF.col, selCol);
    if (!grid.length) return { rows: 0, cols: 0 };
    const cam = { angle: this.cam.angle, tilt: this.cam.tilt, zoom: this.cam.zoom };
    const draw = this.fieldStyle === "mesh" ? FX.terrain : FX.ridges;
    const a = draw(scr, x, y, w, h, t, th, grid, { row: this.selF.row, col: this.selF.col }, { cam, pulse, sparks, big: labels });
    if (labels) {
      const put = (pt, s, fg, dx = 1) => { if (!pt) return; const px = Math.max(x, Math.min(x + w - s.length, pt[0] + dx)), py = Math.max(y, Math.min(y + h - 1, pt[1])); scr.text(px, py, s, { fg }); };
      put(a.old, nights[0] ? "◂ " + nights[0].label.slice(5) : "", th.dim, -8);
      put(a.new, nights[rows - 1] ? nights[rows - 1].label.slice(5) + " ▸" : "", th.dim, 1);
      if (this.job) put(a.pin, " " + this.night.label.slice(5) + " · " + this.job.name + " · " + fmtDur(this.job.dur) + (this.job.prs.length ? " · #" + this.job.prs[0].n : ""), th.bright, 2);
      if (a.colEnd && this.job) put(a.colEnd, this.job.name.toUpperCase(), th.tert, 1);
    }
    return { rows, cols: order.length, anchors: a };
  }

  renderDeep(ix, yy, iw, h, t) {
    const scr = this.scr, th = this.th;
    const night = this.night;
    FX.ruler(scr, ix, yy, iw, th);
    scr.text(ix + 1, yy, " DEEP FIELD · NIGHTS × JOBS · height = duration ", { fg: th.bright });
    const cam = " rot " + rpad((this.cam.speed >= 0 ? "+" : "") + this.cam.speed.toFixed(1), 5) + " · tilt " + this.cam.tilt.toFixed(2) + " · zoom " + this.cam.zoom.toFixed(1) + (this.cam.paused ? " · PAUSED" : "") + " ";
    scr.text(ix + iw - cam.length - 1, yy, cam, { fg: th.dim });
    const fh = h - 5;
    const df = this.deepField(ix, yy + 2, iw, fh, t, 28, true);
    const legend = [["━", th.accent, "selected night"], ["━", th.tert, "selected job"], ["·", th.accent, "PR sparks"], ["◉", th.accent, "running"]];
    let lx = ix;
    for (const [g, c, l] of legend) { scr.text(lx, yy + h - 3, g + " " + l, { fg: c }); lx += l.length + 4; }
    scr.text(ix + iw - 22, yy + h - 3, rpad(df.rows + " nights × " + df.cols + " jobs", 22), { fg: th.dim });
    if (night && this.job) {
      const j = this.job, st = STATUS[j.status];
      scr.text(ix, yy + h - 2, night.label + "  " + j.name, { fg: th.fg });
      scr.text(ix + 30, yy + h - 2, st.ch + " " + st.label + "  " + fmtDur(j.dur) + (j.prs.length ? "  #" + j.prs[0].n : "") + (j.session ? "  session " + j.session.slice(0, 8) : ""), { fg: th[st.color] });
    }
    this.renderKeys(ix, yy + h - 1, iw, [["↑↓", "Job"], ["←→", "Night"], ["< >", "Spin"], ["[ ]", "Tilt"], ["+ -", "Zoom"], ["␣", "Pause"], ["↵", "Report"], ["c", "Continue"], ["d", "Back"]]);
  }

  renderMetrics(ix, yy, iw, h, t) {
    const scr = this.scr, th = this.th, m = this.metrics;
    const reveal = Math.min(1, (Date.now() - (this.overlayT || 0)) / 900);
    FX.ruler(scr, ix, yy, iw, th);
    scr.text(ix + 1, yy, " METRICS · " + m.nights + " nights · " + m.totalJobs + " jobs ", { fg: th.bright });
    this.metricsBody(ix, yy + 2, iw, h - 3, t, reveal);
    this.renderKeys(ix, yy + h - 1, iw, [["↑↓", "Job"], ["m", "Back"], ["d", "Deep field"], ["t", "Theme"], ["q", "Quit"]]);
  }

  renderAnalytics(x, y, w, h, t) {
    const scr = this.scr, th = this.th, m = this.metrics;
    W.box(scr, x, y, w, h, "analytics", m.nights + " nights", th, false);
    FX.glitch(scr, x + 2, y, 14, t + 4.5);
    const reveal = Math.min(1, (Date.now() - this.t0 - 2600) / 900);
    this.metricsBody(x + 2, y + 1, w - 4, h - 2, t, Math.max(0, reveal));
  }

  metricsBody(ix, yy, iw, h, t, reveal) {
    const scr = this.scr, th = this.th, m = this.metrics;
    let y = yy;
    // tiles
    let tx = ix;
    tx += CH.tile(scr, tx, y, m.totalPRs, "", "PRs opened", th, reveal, th.ok) + 4;
    tx += CH.tile(scr, tx, y, Math.round(m.yield * 100), "%", "PR yield", th, reveal, th.accent) + 4;
    tx += CH.tile(scr, tx, y, Math.round(m.medianBatch), "m", "median batch", th, reveal) + 4;
    tx += CH.tile(scr, tx, y, m.streak, "", "night streak", th, reveal, th.tert) + 4;
    const tot = Math.max(1, m.statusMix.pr + m.statusMix.noop + m.statusMix.fail);
    const rw = Math.min(16, ix + iw - tx - 1);
    if (rw >= 10) {
      CH.ring(scr, ix + iw - rw, y, rw, 7, [{ frac: m.statusMix.pr / tot, color: th.ok }, { frac: m.statusMix.noop / tot, color: th.fg2 }, { frac: m.statusMix.fail / tot, color: th.bad }], th, t, { reveal, label: Math.round((m.statusMix.pr / tot) * 100) + "%", sub: "PR" });
      scr.text(ix + iw - rw, y + 7, "STATUS MIX", { fg: th.dim });
    }
    y += 8;
    // batch duration area
    const ah = Math.max(5, Math.min(12, Math.floor((h - 24) * 0.5)));
    FX.ruler(scr, ix, y, iw, th);
    scr.text(ix + 1, y, " BATCH DURATION · minutes per night ", { fg: th.fg2 });
    scr.text(ix + iw - 22, y, " ━ 7-night average ", { fg: th.accent });
    const n = Math.min(m.batchDur.length, iw - 2);
    CH.area(scr, ix, y + 1, iw, ah, m.batchDur.slice(-n), m.avg7.slice(-n), th, t, { reveal, labels: m.labels.slice(-n), unit: "m" });
    y += ah + 3;
    // two columns: yield by job, duration range by job
    const half = Math.floor(iw / 2) - 1;
    FX.ruler(scr, ix, y, half, th); scr.text(ix + 1, y, " PR YIELD BY JOB ", { fg: th.fg2 });
    FX.ruler(scr, ix + half + 2, y, iw - half - 2, th); scr.text(ix + half + 3, y, " DURATION RANGE BY JOB · min ├ median █ max ┤ ", { fg: th.fg2 });
    const jobs = m.perJob.slice(0, Math.max(1, Math.min(9, yy + h - y - 8)));
    jobs.forEach((j, i) => {
      const ry = y + 1 + i, sel = this.job && this.job.name === j.name;
      scr.text(ix, ry, j.name.slice(0, 16), { fg: sel ? th.bright : th.fg2 });
      const bw = half - 32, fill = Math.round(j.yield * bw * reveal);
      for (let k = 0; k < bw; k++) scr.put(ix + 17 + k, ry, k < fill ? "█" : "░", { fg: k < fill ? mix(th.ok, th.bright, k / bw * 0.5) : th.line });
      scr.text(ix + 18 + bw, ry, rpad(Math.round(j.yield * 100) + "%", 4) + " " + rpad(j.prs + "/" + j.n, 6), { fg: th.fg });
    });
    CH.rangeBars(scr, ix + half + 2, y + 1, iw - half - 2, jobs.map((j) => ({ label: j.name, min: j.min, max: j.max, mid: j.median, color: this.job && this.job.name === j.name ? th.accent : th.fg2, sel: this.job && this.job.name === j.name })), th, t, { reveal });
    y += jobs.length + 2;
    // review cadence
    const ch = yy + h - y - 1;
    if (ch >= 5) {
      FX.ruler(scr, ix, y, iw, th);
      scr.text(ix + 1, y, " REVIEW CADENCE · last 14 days · " + m.reviewComments + " comments ", { fg: th.fg2 });
      const todayKey = new Date().toISOString().slice(0, 10);
      CH.columns(scr, ix, y + 2, Math.min(iw, 14 * 6), ch - 1, m.days.map((d) => ({ label: d.label, values: [d.passes, d.comments], today: d.key === todayKey })), th, t, { reveal, names: ["passes", "comments"] });
    }
  }

  // Centre: the "terminal" panel. Stats, timeline, job table, matrix; report as an overlay.
  renderCenter(x, y, w, h, t) {
    const scr = this.scr, th = this.th, d = this.data;
    W.box(scr, x, y, w, h, "terminal", this.view === "review" ? "review shifts" : "main", th, true);
    FX.glitch(scr, x + 2, y, 14, t);
    const ix = x + 2, iw = w - 4;
    let yy = y + 1;
    if (this.err) { scr.text(ix, yy + 1, this.err, { fg: th.bad }, iw); return; }
    if (this.view === "review") return this.renderReview(ix, yy, iw, h - 2, t);
    if (this.overlay === "report") return this.renderReport(ix, yy, iw, h - 2, t);
    if (this.overlay === "deep") return this.renderDeep(ix, yy, iw, h - 2, t);
    if (this.overlay === "metrics") return this.renderMetrics(ix, yy, iw, h - 2, t);

    const night = this.night;
    const jobs = night ? night.jobs : [];
    const ih = h - 2;
    const need = { table: jobs.length + 2, gantt: jobs.length + 3, matrix: Math.min(this.order.length, 9) + 2, meters: Math.max(jobs.length, 4) + 1, keys: 1 };
    const base = need.table + need.gantt + need.keys + 4; // stats line, ruler rows, spacing
    const showMatrix = ih >= base + need.matrix;
    const showMeters = ih >= base + (showMatrix ? need.matrix : 0) + need.meters;

    // ---- stats
    const totalJobs = d.nights.reduce((n, k) => n + k.jobs.length, 0), totalPRs = d.nights.reduce((n, k) => n + k.prs, 0);
    const ns = d.timers.find((k) => /night/i.test(k.unit)), rv = d.timers.find((k) => /review/i.test(k.unit));
    const lastTick = d.review.ticks[d.review.ticks.length - 1];
    const stats = [
      ["Nights  ", d.nights.length + " indexed · " + totalJobs + " jobs · " + totalPRs + " PRs opened"],
      ["Batch   ", night ? night.label + " · " + fmtDur(night.dur) + " · " + night.prs + " PR" + (night.prs === 1 ? "" : "s") + " · " + (night.complete ? "complete" : d.running === night ? "running" : night.dropped ? "dropped" : "partial") : "—"],
      ["Next    ", (ns && ns.next ? "shift " + DAY[new Date(ns.next).getDay()] + " " + hhmm(ns.next) + " (" + fmtRel(ns.next - Date.now()) + ")" : "shift —") + (rv && rv.next ? " · review " + hhmm(rv.next) : "")],
      ["Review  ", Object.keys(d.review.ledger).length + " PRs in ledger" + (lastTick ? " · last tick " + hhmm(lastTick.t) + " " + (lastTick.kind === "noop" ? "quiet" : lastTick.kind) : "")],
    ];
    if (showMeters) {
      const meterW = Math.min(40, Math.floor(iw * 0.42));
      const maxDur = Math.max(1, ...jobs.map((j) => j.dur));
      const statX = ix + meterW + 3;
      for (let i = 0; i < Math.max(jobs.length, stats.length); i++) {
        if (jobs[i]) W.meter(scr, ix, yy + 1 + i, meterW, jobs[i].dur / maxDur, rpad(i + 1, 2) + " ", fmtDur(jobs[i].dur).padStart(6), th, th[STATUS[jobs[i].status].color], (Date.now() - (this.nightT || this.t0)) / 600 - i * 0.05);
        if (stats[i] && statX + 10 < ix + iw) { scr.text(statX, yy + 1 + i, stats[i][0], { fg: th.fg2 }); scr.text(statX + 8, yy + 1 + i, stats[i][1], { fg: th.fg }, ix + iw - statX - 8); }
      }
      yy += Math.max(jobs.length, stats.length) + 2;
    } else {
      scr.text(ix, yy, stats[0][1] + "   ·   " + stats[2][1], { fg: th.fg2 }, iw);
      yy += 2;
    }

    if (!night) { scr.text(ix, yy, "no nights indexed in " + tilde(d.stateDir), { fg: th.muted }); return; }

    // ---- timeline
    FX.ruler(scr, ix, yy, iw, th);
    scr.text(ix + 1, yy, " NIGHT TIMELINE · " + night.label + " ", { fg: th.fg2 });
    scr.text(ix + iw - 17, yy, " " + hhmm(night.start) + " → " + hhmm(night.end || Date.now()) + " ", { fg: th.dim });
    yy += 2;
    FX.gantt(scr, ix, yy, iw, jobs.length + 1, night, this.jobIdx, th, t);
    yy += jobs.length + 2;

    // ---- table
    const cols = [["JOB", 25], ["STATUS", 11], ["START", 6], ["DUR", 7], ["EXIT", 5], ["PR", 6], ["SESSION", 9]];
    let hx = ix;
    scr.fill(ix, yy, iw, 1, " ", { bg: th.selBar });
    for (const [name, cw] of cols) { scr.text(hx, yy, name, { fg: th.fg2, bg: th.selBar }); hx += cw; }
    scr.text(hx, yy, "REPORT", { fg: th.fg2, bg: th.selBar });
    yy++;
    const tableH = Math.min(jobs.length, Math.max(3, y + h - yy - 2 - (showMatrix ? need.matrix : 0)));
    const first = Math.max(0, Math.min(this.jobIdx - tableH + 1, jobs.length - tableH));
    for (let i = first; i < Math.min(jobs.length, first + tableH); i++) {
      const j = jobs[i];
      const sel = i === this.jobIdx;
      const st = STATUS[j.status];
      const bg = sel ? th.selBar : undefined;
      if (sel) scr.fill(ix, yy, iw, 1, " ", { bg });
      scr.text(ix, yy, sel ? (((t * 2) | 0) % 2 ? "▶ " : "▷ ") : (i === jobs.length - 1 ? "└─" : "├─"), { fg: sel ? th.accent : th.line, bg });
      scr.text(ix + 3, yy, pad(j.name, 22), { fg: sel ? th.bright : th.fg, bg });
      const blink = j.status === "running" && ((t * 2) | 0) % 2;
      scr.text(ix + 25, yy, (blink ? "○" : st.ch) + " " + pad(st.label, 9), { fg: th[st.color], bg });
      scr.text(ix + 36, yy, hhmm(j.start), { fg: th.fg2, bg });
      scr.text(ix + 42, yy, pad(fmtDur(j.dur), 7), { fg: th.fg2, bg });
      scr.text(ix + 49, yy, pad(j.exit == null ? "—" : j.exit, 5), { fg: j.exit ? th.bad : th.fg2, bg });
      scr.text(ix + 54, yy, pad(j.prs.length ? "#" + j.prs[0].n : "—", 6), { fg: j.prs.length ? th.ok : th.dim, bg });
      scr.text(ix + 60, yy, pad(j.session ? j.session.slice(0, 8) : "—", 9), { fg: j.session ? th.accent : th.dim, bg });
      scr.text(ix + 69, yy, j.summary, { fg: sel ? th.fg : th.muted, bg }, iw - 69);
      if (sel) { const sw = Math.floor(((t * 0.5) % 1) * iw); for (let k = 0; k < 3; k++) { const c = scr.back[yy][ix + sw + k]; if (c && ix + sw + k < ix + iw) c.bg = mix(th.selBar, th.accent2, 0.35 - k * 0.1); } }
      yy++;
    }
    if (jobs.length > tableH) scr.text(ix + iw - 12, yy - 1, rpad("+" + (jobs.length - first - tableH) + " more", 11), { fg: th.dim });
    yy++;

    // ---- matrix
    if (showMatrix && yy + need.matrix <= y + h - 1) {
      FX.ruler(scr, ix, yy, iw, th);
      scr.text(ix + 1, yy, " JOB × NIGHT MATRIX ", { fg: th.fg2 });
      scr.text(ix + iw - 34, yy, " ● pr  ○ quiet  × fail  ◔ timeout ", { fg: th.dim });
      FX.matrix(scr, ix, yy + 1, iw, need.matrix, d.nights, this.order, night, this.job && this.job.name, th, t);
    }
    this.renderKeys(ix, y + h - 1, iw, [["↑↓", "Job"], ["←→", "Night"], ["↵", "Report"], ["d", "Deep field"], ["m", "Metrics"], ["c", "Continue"], ["r", "Reviews"], ["o", "Open PR"], ["t", "Theme"], ["?", "Help"], ["q", "Quit"]]);
  }

  renderReport(ix, yy, iw, h, t) {
    const scr = this.scr, th = this.th;
    const rev = this.view === "review";
    const j = rev ? this.tick : this.job;
    if (!j) return;
    const title = rev ? " REVIEW · " + new Date(j.t).toLocaleString() + " " : " REPORT · " + j.name + " · " + this.night.label + " ";
    const session = j.session;
    FX.ruler(scr, ix, yy, iw, th);
    scr.text(ix + 1, yy, title, { fg: th.bright });
    const tail = session ? " session " + session + " " : " no session on disk · c seeds a new one from the report ";
    scr.text(ix + iw - tail.length - 1, yy, tail, { fg: session ? th.accent : th.dim });
    const text = rev ? j.report : j.log;
    const lines = wrap(text || "(empty)", iw - 1);
    const rh = h - 3;
    this.scroll = Math.max(0, Math.min(this.scroll, Math.max(0, lines.length - rh)));
    const reveal = Math.floor((Date.now() - (this.overlayT || 0)) / 1000 * 2400); // typewriter
    let budget = reveal;
    for (let i = 0; i < rh; i++) {
      const l = lines[this.scroll + i];
      if (l == null || budget <= 0) break;
      const shown = l.slice(0, budget); budget -= l.length + 1;
      const isHead = /^(\*\*|#)/.test(l.trim());
      const isPR = /pull\/\d+/.test(l);
      scr.text(ix, yy + 2 + i, shown.replace(/\*\*/g, ""), { fg: isHead ? th.bright : isPR ? th.ok : th.fg }, iw);
      if (budget <= 0 && ((t * 4) | 0) % 2) scr.put(ix + Math.min(iw - 1, shown.length), yy + 2 + i, "▌", { fg: th.accent });
    }
    if (lines.length > rh) scr.text(ix + iw - 9, yy + h - 2, rpad("↓ " + Math.round((this.scroll / Math.max(1, lines.length - rh)) * 100) + "%", 7), { fg: th.dim });
    this.renderKeys(ix, yy + h - 1, iw, [["↑↓", "Scroll"], ["esc", "Back"], ["c", "Continue"], ["o", "Open PR"], ["q", "Quit"]]);
  }

  renderReview(ix, yy, iw, h, t) {
    const scr = this.scr, th = this.th, d = this.data;
    const y0 = yy;
    const revs = this.reviews;
    if (this.overlay === "report") return this.renderReport(ix, yy, iw, h, t);
    const quiet = d.review.ticks.filter((k) => k.kind === "noop").length;
    scr.text(ix, yy + 1, "PR REVIEW SHIFTS", { fg: th.bright });
    scr.text(ix + 18, yy + 1, "· every 2h · " + Object.keys(d.review.ledger).length + " PRs in ledger · " + revs.length + " passes · " + quiet + " quiet ticks", { fg: th.fg2 }, iw - 18);
    // activity strip: last 48 ticks
    const strip = d.review.ticks.slice(-Math.min(iw - 2, 72));
    strip.forEach((k, i) => scr.put(ix + i, yy + 2, k.kind === "review" ? "▮" : k.kind === "error" ? "×" : "▁", { fg: k.kind === "review" ? th.accent : k.kind === "error" ? th.bad : th.line }));
    yy += 4;
    scr.fill(ix, yy, iw, 1, " ", { bg: th.selBar });
    scr.text(ix, yy, pad("WHEN", 20) + pad("DUR", 7) + pad("PRS", 34) + pad("SESSION", 10) + "RESULT", { fg: th.fg2, bg: th.selBar }, iw);
    yy++;
    const tableH = Math.max(3, h - 7);
    const first = Math.max(0, Math.min(this.reviewIdx - tableH + 1, revs.length - tableH));
    for (let i = first; i < Math.min(revs.length, first + tableH); i++) {
      const k = revs[i], sel = i === this.reviewIdx;
      const bg = sel ? th.selBar : undefined;
      if (sel) scr.fill(ix, yy, iw, 1, " ", { bg });
      const dt = new Date(k.t);
      scr.text(ix, yy, (sel ? "▶ " : "  ") + pad(dt.toISOString().slice(0, 10) + " " + hhmm(k.t), 18), { fg: sel ? th.bright : th.fg, bg });
      scr.text(ix + 20, yy, pad(k.end ? fmtDur(k.end - k.t) : "—", 7), { fg: th.fg2, bg });
      scr.text(ix + 27, yy, pad(k.prs.map((n) => "#" + n).join(" "), 33), { fg: th.ok, bg });
      scr.text(ix + 61, yy, pad(k.session ? k.session.slice(0, 8) : "—", 10), { fg: k.session ? th.accent : th.dim, bg });
      const m = (k.report || "").match(/Comments posted:\*?\*?\s*(\d+)/i);
      scr.text(ix + 71, yy, m ? m[1] + " comment" + (m[1] === "1" ? "" : "s") : (k.report ? "see report" : "no report"), { fg: th.fg2, bg }, iw - 71);
      yy++;
    }
    this.renderKeys(ix, y0 + h - 1, iw, [["↑↓", "Pass"], ["↵", "Report"], ["c", "Continue"], ["r", "Back"], ["t", "Theme"], ["?", "Help"], ["q", "Quit"]]);
  }

  renderKeys(x, y, w, keys) {
    const scr = this.scr, th = this.th;
    let cx = x;
    for (const [k, label] of keys) {
      if (cx + k.length + label.length + 2 > x + w) break;
      scr.text(cx, y, k, { fg: th.bright, bg: th.selBar }); cx += k.length;
      scr.text(cx, y, label + " ", { fg: th.fg2 }); cx += label.length + 1;
    }
  }

  // Right column: radar, ledger, datastream, error log, PR spikes.
  renderRight(x, y, w, h, t) {
    const scr = this.scr, th = this.th, d = this.data;
    W.caption(scr, x, y, w, "signals", "radar", th, (t * 0.05 + 0.5) % 1);
    scr.text(x, y + 2, "NIGHTS", { fg: th.dim }); scr.text(x + w - 19, y + 2, "RADAR VISUALIZATION", { fg: th.dim });
    const rh = Math.max(7, Math.min(12, Math.floor(h * 0.27)));
    const nights = d.nights.slice(0, 40);
    const blips = nights.map((n, i) => ({ a: (i / 40 + 0.75) % 1, r: 0.25 + 0.7 * Math.min(1, n.dur / (90 * 60000)), hot: n.prs > 0 || n === this.night }));
    W.radar(scr, x + 1, y + 3, w - 2, rh, t, th, blips);
    scr.text(x, y + 4 + rh, "INSPECTION OF", { fg: th.dim }); scr.text(x, y + 5 + rh, "LAST 40 NIGHTS", { fg: th.dim });
    scr.text(x + w - 8, y + 5 + rh, rpad(nights.filter((n) => n.prs).length + " HOT", 8), { fg: th.accent });
    let yy = y + rh + 7;

    W.caption(scr, x, yy, w, "review ledger", Object.keys(d.review.ledger).length + " prs", th);
    yy += 3;
    const led = Object.entries(d.review.ledger).sort((a, b) => +b[0] - +a[0]);
    const per = Math.max(1, Math.min(3, Math.floor(h * 0.08)));
    for (let i = 0; i < Math.min(led.length, 2 * per); i++) {
      const [n, sha] = led[i];
      const cx = x + (i % 2) * Math.floor(w / 2), cy = yy + Math.floor(i / 2);
      scr.text(cx, cy, "#" + n, { fg: th.fg }); scr.text(cx + 5, cy, String(sha).slice(0, 7), { fg: th.muted });
    }
    if (!led.length) scr.text(x, yy, "EMPTY", { fg: th.dim });
    yy += per + 1;

    // datastream
    if (Date.now() - this.streamT > 220) { this.stream.push(FX.streamLine(this.pool)); this.streamT = Date.now(); if (this.stream.length > 40) this.stream.shift(); }
    const remaining = y + h - yy;
    const sh = Math.max(3, Math.min(6, Math.floor(remaining * 0.2)));
    W.caption(scr, x, yy, w, "datastream", "ledger · sessions", th);
    FX.hexStream(scr, x + 1, yy + 3, w - 2, sh, this.stream, th);
    yy += sh + 4;

    W.caption(scr, x, yy, w, "error log", "", th);
    yy += 3;
    const errs = [];
    for (const n of d.nights) for (const j of n.jobs) if (j.status === "error" || j.status === "timeout") errs.push({ t: j.start, s: n.label.slice(5) + " " + j.name + " exit " + j.exit });
    for (const k of d.review.ticks) if (k.kind === "error") errs.push({ t: k.t, s: new Date(k.t).toISOString().slice(5, 10) + " " + k.msg.replace(/^ERROR:?\s*/i, "").replace(/\(124=timeout\).*/, "") });
    errs.sort((a, b) => b.t - a.t);
    const eh = Math.max(1, Math.min(3, Math.floor(h * 0.08)));
    if (!errs.length) scr.text(x + Math.floor((w - 4) / 2), yy, "NONE", { fg: th.dim });
    else for (let i = 0; i < Math.min(errs.length, eh); i++) scr.text(x, yy + i, errs[i].s, { fg: i ? th.warn : th.bad }, w);
    yy += eh + 2;

    if (yy + 6 < y + h) {
      W.caption(scr, x, yy, w, "pr activity", "prs / night", th);
      const sh2 = y + h - yy - 5;
      const series = d.nights.slice(0, ((w - 2) * 2) / 3 | 0).reverse().map((n) => n.prs);
      W.spikes(scr, x + 1, yy + 3, w - 2, Math.max(3, sh2), series, th);
    }
    scr.text(x, y + h - 1, "NIGHTSHIFT", { fg: th.dim });
    scr.text(x + w - 6, y + h - 1, "v" + VERSION, { fg: th.dim });
  }

  renderStatus(y, t) {
    const scr = this.scr, th = this.th, d = this.data;
    const w = scr.w;
    const fresh = Date.now() - this.msgT < 6000;
    const left = fresh ? this.msg : tilde(d.stateDir) + (d.repoDir ? "  ·  " + tilde(d.repoDir) : "");
    scr.text(1, y, "› ", { fg: th.accent });
    scr.text(3, y, left, { fg: fresh ? th.bright : th.muted }, w - 24);
    const cur = ((t * 2) | 0) % 2 ? "▌" : " ";
    scr.text(3 + Math.min(left.length, w - 24) + 1, y, cur, { fg: th.accent });
    const right = (d.running ? "◉ SHIFT RUNNING  " : "") + hhmmss(Date.now());
    scr.text(w - right.length - 1, y, right, { fg: d.running ? th.accent : th.dim });
  }

  renderHelp(t) {
    const scr = this.scr, th = this.th, d = this.data;
    const bw = Math.min(scr.w - 4, 78), bh = 26;
    const x = (scr.w - bw) >> 1, y = (scr.h - bh) >> 1;
    scr.fill(x, y, bw, bh, " ", { bg: th.panel });
    W.box(scr, x, y, bw, bh, "help", "esc closes", th, true);
    banner(scr, x + 3, y + 2, "NIGHTSHIFT", th, t);
    const rows = [
      ["↑ ↓  j k", "move between jobs (or review passes)"],
      ["← →  h l", "older / newer night      PgUp PgDn jumps a week"],
      ["↵", "open the report; ↑↓ PgUp PgDn scroll it; esc closes"],
      ["c", "continue the shift's conversation in Claude Code"],
      ["", "  linked session → claude --resume <id> --fork-session"],
      ["", "  no session    → new claude seeded with the report"],
      ["d", "fullscreen deep field; < > spin, [ ] tilt, + - zoom, space pause"],
      ["f", "deep field style: ridge lines / wire mesh"],
      ["m", "metrics: yield, durations, review cadence, status mix"],
      ["r", "PR review shifts (every 2h)"],
      ["o", "open the job's pull request in the browser"],
      ["t", "toggle palette: night / phosphor"],
      ["R", "reload state from disk"],
      ["q", "quit"],
    ];
    rows.forEach(([k, v], i) => {
      scr.text(x + 3, y + 6 + i, k, { fg: th.bright, bg: th.panel });
      scr.text(x + 14, y + 6 + i, v, { fg: k ? th.fg : th.fg2, bg: th.panel }, bw - 17);
    });
    scr.text(x + 3, y + bh - 4, "state  " + tilde(d.stateDir), { fg: th.muted, bg: th.panel }, bw - 6);
    scr.text(x + 3, y + bh - 3, "repo   " + tilde(d.repoDir), { fg: th.muted, bg: th.panel }, bw - 6);
    scr.text(x + 3, y + bh - 2, "conf   " + (tilde(d.confFile) || "none (state dir autodetected)"), { fg: th.muted, bg: th.panel }, bw - 6);
  }

  // ---- loop ----
  start() {
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      if (Date.now() - this.lastLoad > (this.data.running ? 5000 : 30000)) this.reload();
      this.render();
    }, 66);
  }

  run() {
    enter(this.scr.out);
    process.stdin.on("data", (buf) => { for (const k of decodeKeys(buf)) this.key(k); });
    process.stdout.on("resize", () => { this.scr.resize(); this.render(); });
    process.on("SIGINT", () => this.quit());
    process.on("SIGTERM", () => this.quit());
    this.render();
    this.start();
  }
}

module.exports = { App, VERSION };

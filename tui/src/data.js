// Reads Nightshift state from disk:
//   $STATE_DIR/runs/YYYYMMDD/_batch.log   START/END lines written by bin/nightly.sh
//   $STATE_DIR/runs/YYYYMMDD/<job>.log    the agent's output for that job
//   $STATE_DIR/done-YYYYMMDD              the night finished
//   $STATE_DIR/review-ledger.json         PR number -> head SHA last reviewed
//   $STATE_DIR/review.log                 bin/review.sh log, with each pass's report
// Settings come from nightshift.conf (STATE_DIR, REPO_DIR, JOBS).
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const { execFileSync } = require("node:child_process");

const HOME = os.homedir();

// State files are written by other processes while we read them. A file that is missing,
// unreadable, or not a file reads as empty rather than taking the bridge down.
function readText(file) {
  try { return fs.readFileSync(file, "utf8"); } catch { return ""; }
}
function listDir(dir) {
  try { return fs.readdirSync(dir); } catch { return []; }
}
function isDir(p) {
  try { return fs.statSync(p).isDirectory(); } catch { return false; }
}
function mtime(file) {
  try { return fs.statSync(file).mtimeMs; } catch { return 0; }
}

// Local calendar day, YYYY-MM-DD. Nights are named by local date, so never bucket by UTC.
function dayKey(t) {
  const d = new Date(t);
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}

// timeout(1) durations as nightshift.conf writes them: "45m", "2h", "90s", "600". 0 if unknown.
function durationMs(s) {
  const m = String(s || "").trim().match(/^(\d+(?:\.\d+)?)([smhd]?)$/);
  return m ? +m[1] * { "": 1, s: 1, m: 60, h: 3600, d: 86400 }[m[2]] * 1000 : 0;
}

function readConf(file) {
  const conf = {};
  if (!file) return conf;
  for (const raw of readText(file).split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const m = line.match(/^([A-Z_]+)=(.*)$/);
    if (!m) continue;
    let v = m[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    conf[m[1]] = v.replace(/\$HOME|^~/g, HOME);
  }
  return conf;
}

function findConf(explicit) {
  const cands = [explicit, process.env.NIGHTSHIFT_CONF,
    path.join(__dirname, "..", "..", "nightshift.conf"), // this checkout
    path.join(HOME, "nightshift", "nightshift.conf")].filter(Boolean);
  return cands.find((f) => fs.existsSync(f)) || null;
}

function findStateDir(explicit, conf) {
  const cands = [explicit, process.env.NIGHTSHIFT_STATE, conf.STATE_DIR, path.join(HOME, ".local", "state", "nightshift")].filter(Boolean);
  return cands.find((d) => fs.existsSync(d)) || null;
}

function parseStamp(s) {
  const m = s.match(/^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2})$/);
  if (m) return new Date(m[1] + "T" + m[2]).getTime();
  return Date.parse(s.replace(/\s+/g, " ").replace(/ [A-Z]{2,5} (\d{4})$/, " $1"));
}

// "[stamp] message" → {t, msg}, or null when the brackets hold no date (e.g. "[nightshift] retrying").
function stamped(line) {
  const m = line.match(/^\[(.+?)\]\s+(.*)$/);
  if (!m) return null;
  const t = parseStamp(m[1]);
  return Number.isFinite(t) ? { t, msg: m[2] } : null;
}

const PR_RE = /https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/pull\/(\d+)/g;

function classify(log, exit, ended) {
  if (!ended) return "running";
  if (exit === 124) return "timeout";
  if (exit && exit !== 0) return "error";
  if ([...(log || "").matchAll(PR_RE)].length) return "pr";
  if (/no[- ]op|no change|no changes|nothing to|left the repo clean|no PR/i.test(log || "")) return "noop";
  return log && log.trim() ? "done" : "empty";
}

function firstLine(log) {
  return (log || "").split("\n").map((s) => s.replace(/[*#`_]/g, "").trim()).find((s) => s.length > 20) || "";
}

function loadNight(dir, date, opts = {}) {
  const blog = readText(path.join(dir, "_batch.log"));
  const jobs = new Map();
  const events = [];
  let dropped = null;
  for (const line of blog.split("\n")) {
    const s = stamped(line);
    if (!s) continue;
    const { t, msg } = s;
    events.push({ t, msg });
    let mm;
    if ((mm = msg.match(/^START\s+(\S+)(?:\s+\(branch=([^)]*)\))?/))) jobs.set(mm[1], { name: mm[1], start: t, end: null, exit: null, branch: mm[2] || "" });
    else if ((mm = msg.match(/^END\s+(\S+)\s+exit=(\d+)/))) { const j = jobs.get(mm[1]); if (j) { j.end = t; j.exit = +mm[2]; } }
    else if (/skipping|past \d+:00|outside/i.test(msg)) dropped = msg;
  }
  const complete = /batch done|BATCH COMPLETE/i.test(blog);
  // A job with no END is running only while it still could be: the newest job of the newest night,
  // batch not done, younger than the job timeout. Otherwise the batch died under it (reboot, kill).
  const newest = [...jobs.values()].reduce((a, j) => (!a || j.start >= a.start ? j : a), null);
  const limit = (opts.jobLimit || 12 * 3600e3) + 10 * 60e3;
  const list = [];
  for (const j of jobs.values()) {
    const lf = path.join(dir, j.name + ".log");
    j.log = readText(lf);
    j.prs = [...new Map([...j.log.matchAll(PR_RE)].map((m) => [+m[1], { url: m[0], n: +m[1] }])).values()];
    const ended = j.end != null;
    const live = !ended && opts.latest && !complete && j === newest && Date.now() - j.start < limit;
    j.status = ended || live ? classify(j.log, j.exit, ended) : "stopped";
    j.dur = ended ? j.end - j.start : live ? Date.now() - j.start : Math.max(0, mtime(lf) - j.start);
    j.summary = firstLine(j.log);
    j.session = null;
    list.push(j);
  }
  list.sort((a, b) => a.start - b.start);
  return {
    date, dir, jobs: list, events, dropped, complete,
    start: list.length ? list[0].start : events.length ? events[0].t : NaN,
    end: list.length ? list[list.length - 1].end || null : null,
    prs: list.reduce((n, j) => n + j.prs.length, 0),
    dur: list.reduce((n, j) => n + j.dur, 0),
    label: date.slice(0, 4) + "-" + date.slice(4, 6) + "-" + date.slice(6, 8),
  };
}

function loadNights(stateDir, conf = {}) {
  const runsDir = path.join(stateDir, "runs");
  const dates = listDir(runsDir).filter((n) => /^\d{8}$/.test(n) && isDir(path.join(runsDir, n))).sort().reverse();
  const jobLimit = durationMs(conf.JOB_TIMEOUT);
  return dates.map((n, i) => loadNight(path.join(runsDir, n), n, { latest: i === 0, jobLimit }));
}

function loadReview(stateDir) {
  const ledgerFile = path.join(stateDir, "review-ledger.json"), logFile = path.join(stateDir, "review.log");
  let ledger = {};
  try { ledger = JSON.parse(readText(ledgerFile)); } catch { /* none yet */ }
  // PR number -> head SHA. Anything else in the file is not ours to show.
  ledger = ledger && typeof ledger === "object" && !Array.isArray(ledger) ? Object.fromEntries(Object.entries(ledger).filter(([, v]) => typeof v === "string")) : {};
  const lines = readText(logFile).split("\n");
  const ticks = [];
  for (let i = 0; i < lines.length; i++) {
    const s = stamped(lines[i]);
    if (!s) continue; // untimed lines, like "[nightshift] retrying", belong to the report above them
    const { t, msg } = s;
    let kind = "noop", prs = [];
    if (/reviewing PRs?:/i.test(msg)) { kind = "review"; prs = (msg.match(/\d+/g) || []).map(Number); }
    else if (/ERROR/i.test(msg)) kind = "error";
    else if (/done|complete|ledger updated/i.test(msg)) kind = "done";
    else if (/another review|batch is running/i.test(msg)) kind = "skip";
    ticks.push({ t, msg, kind, prs, line: i });
  }
  for (let k = 0; k < ticks.length; k++) {
    if (ticks[k].kind !== "review") continue;
    const to = k + 1 < ticks.length ? ticks[k + 1].line : lines.length;
    ticks[k].report = lines.slice(ticks[k].line + 1, to).join("\n").trim();
    ticks[k].end = k + 1 < ticks.length ? ticks[k + 1].t : null;
  }
  return { ledger, ticks, logFile, ledgerFile };
}

// The two timers SETUP.md asks for: nightshift-nightly and nightshift-review. Best effort.
function loadTimers() {
  try {
    if (process.platform === "linux") {
      const out = execFileSync("systemctl", ["--user", "list-timers", "--all", "--output=json"], { encoding: "utf8", timeout: 2000 });
      return JSON.parse(out).filter((t) => /nightshift/i.test(t.unit)).map((t) => ({ unit: t.unit.replace(/\.timer$/, ""), next: t.next ? t.next / 1000 : null, last: t.last ? t.last / 1000 : null }));
    }
    if (process.platform === "darwin") {
      const out = execFileSync("launchctl", ["list"], { encoding: "utf8", timeout: 2000 });
      return out.split("\n").filter((l) => /nightshift/i.test(l)).map((l) => ({ unit: l.trim().split(/\s+/).pop(), next: null, last: null }));
    }
  } catch { /* no timer tool */ }
  return [];
}

// Claude Code keeps one transcript per session under ~/.claude/projects/<repo path>/.
// Other agents do not leave a resumable transcript; those shifts are continued from the report.
function loadSessions(repoDir) {
  if (!repoDir) return [];
  const pdir = path.join(HOME, ".claude", "projects", repoDir.replace(/[^a-zA-Z0-9]/g, "-"));
  const out = [];
  for (const f of listDir(pdir)) {
    if (!f.endsWith(".jsonl")) continue;
    try {
      const fd = fs.openSync(path.join(pdir, f), "r");
      const buf = Buffer.alloc(16384);
      const n = fs.readSync(fd, buf, 0, buf.length, 0);
      fs.closeSync(fd);
      let t = null, prompt = "";
      for (const line of buf.toString("utf8", 0, n).split("\n")) {
        if (!line.startsWith("{")) continue;
        let o; try { o = JSON.parse(line); } catch { continue; }
        if (!t && o.timestamp) t = Date.parse(o.timestamp);
        if (o.type === "user" && o.message && typeof o.message.content === "string") { prompt = o.message.content; break; }
        if (o.type === "queue-operation" && o.content && !prompt) prompt = o.content;
      }
      if (t) out.push({ id: f.replace(/\.jsonl$/, ""), t, prompt });
    } catch { /* skip */ }
  }
  return out;
}

function linkSessions(nights, review, sessions) {
  const slack = 3 * 60 * 1000;
  for (const night of nights)
    for (const j of night.jobs) {
      const end = j.end || Date.now();
      const cands = sessions.filter((s) => s.t >= j.start - slack && s.t <= end + slack);
      const name = new RegExp("\\b" + j.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b", "i");
      const byName = cands.filter((s) => name.test(s.prompt));
      const pick = (byName.length ? byName : cands).sort((a, b) => a.t - b.t)[0];
      if (pick) j.session = pick.id;
    }
  for (const tk of review.ticks) {
    if (tk.kind !== "review") continue;
    const end = tk.end || tk.t + 60 * 60 * 1000;
    const pick = sessions.filter((s) => s.t >= tk.t - slack && s.t <= end && /review/i.test(s.prompt)).sort((a, b) => a.t - b.t)[0];
    if (pick) tk.session = pick.id;
  }
}

function load(opts = {}) {
  const confFile = findConf(opts.conf);
  const conf = readConf(confFile);
  const stateDir = findStateDir(opts.state, conf);
  if (!stateDir) throw new Error("No Nightshift state found. Set STATE_DIR in nightshift.conf, or pass --state <dir>, or try --demo.");
  const repoDir = opts.repo || process.env.NIGHTSHIFT_REPO || conf.REPO_DIR || null;
  const nights = loadNights(stateDir, conf);
  const review = loadReview(stateDir);
  const sessions = loadSessions(repoDir);
  linkSessions(nights, review, sessions);
  return {
    conf, confFile, stateDir, repoDir, nights, review, sessions, timers: loadTimers(),
    running: nights.find((n) => n.jobs.some((j) => j.status === "running")),
    jobsOrder: (conf.JOBS || "").split(/\s+/).filter(Boolean),
  };
}

module.exports = { load, dayKey, PR_RE };

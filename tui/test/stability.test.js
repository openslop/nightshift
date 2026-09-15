// The bridge must never crash or hang, whatever is on disk. Each case builds a state dir,
// then drives every view and key at many sizes in a child process with a time limit.
"use strict";

const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const data = require("../src/data");

const DRIVE = path.join(__dirname, "drive.js");
const REPO = "/home/you/code/app";

function build(files) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "nightshift-tui-test-"));
  const state = path.join(root, "state"), home = path.join(root, "home");
  fs.mkdirSync(state, { recursive: true });
  fs.mkdirSync(home, { recursive: true });
  for (const [rel, body] of Object.entries(files)) {
    const f = path.join(state, rel);
    if (body === null) { fs.mkdirSync(f, { recursive: true }); continue; }
    fs.mkdirSync(path.dirname(f), { recursive: true });
    fs.writeFileSync(f, body);
  }
  const conf = path.join(root, "nightshift.conf");
  fs.writeFileSync(conf, "JOBS=\"security readability c++[x\"\n");
  return { root, state, home, conf };
}

function drive(files, { sessions = [] } = {}) {
  const env = build(files);
  const pdir = path.join(env.home, ".claude", "projects", REPO.replace(/[^a-zA-Z0-9]/g, "-"));
  fs.mkdirSync(pdir, { recursive: true });
  sessions.forEach((s, i) => fs.writeFileSync(path.join(pdir, "s" + i + ".jsonl"), s));
  const r = spawnSync(process.execPath, [DRIVE, env.state, env.conf, REPO], { encoding: "utf8", timeout: 60000, env: { ...process.env, HOME: env.home, NIGHTSHIFT_CONF: "", NIGHTSHIFT_STATE: "" } });
  fs.rmSync(env.root, { recursive: true, force: true });
  assert.strictEqual(r.signal, null, "hung (killed by " + r.signal + ")\n" + r.stderr);
  assert.strictEqual(r.status, 0, r.stderr);
}

const stamp = (d, hms) => "[" + d + " " + hms + "]";
const good = {
  "runs/20260913/_batch.log": [stamp("2026-09-13", "05:12:04") + " batch start", stamp("2026-09-13", "05:12:04") + " START security (branch=main)", stamp("2026-09-13", "05:30:00") + " END   security exit=0",
    stamp("2026-09-13", "05:30:00") + " START readability (branch=main)", stamp("2026-09-13", "05:40:00") + " END   readability exit=0", stamp("2026-09-13", "05:40:00") + " batch done"].join("\n"),
  "runs/20260913/security.log": "No change tonight, nothing to fix here at all.",
  "runs/20260913/readability.log": "Opened https://github.com/o/r/pull/12 with a rename pass.",
  "review-ledger.json": JSON.stringify({ 12: "abc1234def" }),
  "review.log": [stamp("2026-09-13", "06:07:04") + " reviewing PRs: 12", "**Comments posted:** 2", stamp("2026-09-13", "06:08:00") + " done; ledger updated", stamp("2026-09-13", "08:07:04") + " nothing new"].join("\n"),
};

test("a normal state dir", () => drive(good));

test("untimed lines are not review ticks; a job whose batch died reads as stopped; a live one as running", () => {
  const pad2 = (n) => String(n).padStart(2, "0");
  const now = new Date(Date.now() - 60000);
  const today = data.dayKey(now), hms = pad2(now.getHours()) + ":" + pad2(now.getMinutes()) + ":" + pad2(now.getSeconds());
  const cases = [
    [{ ...good, "review.log": good["review.log"] + "\n[nightshift] agent hit a usage limit\n", "runs/20260801/_batch.log": stamp("2026-08-01", "05:12:04") + " START security\n" }, "20260801", "stopped"],
    [{ "runs/20200101/_batch.log": stamp("2020-01-01", "05:12:04") + " START security\n" }, "20200101", "stopped"],
    [{ ["runs/" + today.replace(/-/g, "") + "/_batch.log"]: stamp(today, hms) + " START security\n" }, today.replace(/-/g, ""), "running"],
  ];
  for (const [files, night, status] of cases) {
    const env = build(files);
    try {
      const d = data.load({ state: env.state, conf: env.conf });
      assert.ok(d.review.ticks.every((k) => Number.isFinite(k.t)));
      assert.ok(!d.review.ticks.some((k) => /usage limit/.test(k.msg)));
      assert.strictEqual(d.nights.find((n) => n.date === night).jobs[0].status, status);
      assert.strictEqual(!!d.running, status === "running");
    } finally { fs.rmSync(env.root, { recursive: true, force: true }); }
  }
});

test("days are local calendar days, not UTC", () => {
  assert.strictEqual(data.dayKey(new Date(2026, 8, 14, 23, 30)), "2026-09-14");
  assert.strictEqual(data.dayKey(new Date(2026, 8, 14, 0, 5)), "2026-09-14");
});

test("an empty state dir", () => drive({}));

test("runs/ exists but holds nothing, or a stray file named like a night", () => drive({ "runs/20260101": "not a directory", "runs/notanight/_batch.log": "x" }));

test("a night whose _batch.log is empty or has no timestamps", () => drive({ ...good, "runs/20260914/_batch.log": "", "runs/20260912/_batch.log": "garbage\n[not a date] START security\n" }));

test("tagged non-timestamp lines in the batch log and review log", () => drive({
  ...good,
  "runs/20260914/_batch.log": [stamp("2026-09-14", "05:12:04") + " START security (branch=x)", "[nightshift] agent hit a usage limit (exit 1). Retrying", stamp("2026-09-14", "05:20:04") + " END   security exit=0"].join("\n"),
  "review.log": good["review.log"] + "\n[nightshift] agent hit a usage limit (exit 1). Retrying with: claude\n[link](https://x) trailing\n[ ] todo\n",
}));

test("old-style date stamps", () => drive({ ...good, "review.log": "[Sat Jul 18 03:27:02 PM PDT 2026] no PRs changed since last review; no-op\n[Sun Jul 19 10:20:30 AM PDT 2026] ERROR: gh pr list failed\n" }));

test("a job that started and never ended (machine rebooted mid-batch)", () => drive({ ...good, "runs/20260801/_batch.log": stamp("2026-08-01", "05:12:04") + " START security (branch=x)\n", "runs/20260801/security.log": "partial" }));

test("END without START, bad exit codes, odd job names", () => drive({
  ...good,
  "runs/20260802/_batch.log": [stamp("2026-08-02", "05:00:00") + " END   ghost exit=3", stamp("2026-08-02", "05:00:00") + " START c++[x (branch=)", stamp("2026-08-02", "05:01:00") + " END   c++[x exit=124",
    stamp("2026-08-02", "05:01:00") + " START ../../etc (branch=y)", stamp("2026-08-02", "05:02:00") + " END   ../../etc exit=1", stamp("2026-08-02", "05:02:00") + " START __proto__", stamp("2026-08-02", "05:03:00") + " END   __proto__ exit=0"].join("\n"),
}, { sessions: ['{"timestamp":"2026-08-02T12:00:30Z","type":"user","message":{"content":"run the c++[x job"}}\n'] }));

test("a job log that is a directory, and an unreadable batch log", () => drive({ ...good, "runs/20260803/_batch.log": null, "runs/20260913/security.log": null }));

test("a review ledger that is not an object", () => {
  for (const ledger of ["null", "[1,2,3]", "\"sha\"", "42", "{not json", "", JSON.stringify({ 5: null, 6: 7 })]) drive({ ...good, "review-ledger.json": ledger });
});

test("binary junk in every log", () => {
  const junk = Buffer.from(Array.from({ length: 4096 }, (_, i) => (i * 7919) % 256));
  drive({ ...good, "review.log": junk, "runs/20260913/_batch.log": junk, "runs/20260913/security.log": junk });
});

test("corrupt session transcripts", () => drive(good, { sessions: ["{", "not json\n{\"timestamp\":\"nope\"}\n", '{"timestamp":"2026-09-13T12:12:10Z","type":"user","message":{"content":[1]}}'] }));

test("a very long history", () => {
  const files = { ...good };
  for (let d = 0; d < 400; d++) {
    const day = new Date(Date.UTC(2025, 0, 1) + d * 86400e3).toISOString().slice(0, 10);
    const key = day.replace(/-/g, "");
    files["runs/" + key + "/_batch.log"] = stamp(day, "05:00:00") + " START security (branch=m)\n" + stamp(day, "05:10:00") + " END   security exit=" + (d % 5) + "\n" + stamp(day, "05:10:00") + " batch done\n";
    files["runs/" + key + "/security.log"] = "https://github.com/o/r/pull/" + d;
  }
  drive(files);
});

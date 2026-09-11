#!/usr/bin/env node
// Writes a made-up but realistic Nightshift state dir, so the console has something to show
// before your first night. Deterministic: the same output every time.
//   node scripts/make-demo-state.js [dir]      (default: <tui>/fixtures/demo)
"use strict";
const fs = require("node:fs");
const path = require("node:path");

const out = path.resolve(process.argv[2] || path.join(__dirname, "..", "fixtures", "demo"));
const runs = path.join(out, "runs");
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(runs, { recursive: true });

let seed = 7;
const rnd = () => { seed = (seed * 48271) % 2147483647; return seed / 2147483647; };
const pad = (n) => String(n).padStart(2, "0");
const stamp = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
const REPO = "you/your-app";
const JOBS = [
  ["security", 0.15, 3, 12, "Nightly security report", "No exploitable issue found. Dependencies unchanged since the last sweep; the one open advisory is unreachable from app code."],
  ["readability", 0.6, 4, 12, "Nightly readability pass", "Renamed the three single-letter loop variables in the export module and folded two nested ifs into early returns. 31 lines removed, 9 added."],
  ["maintainability", 0.7, 8, 24, "Nightly maintainability report", "Collapsed three hand-rolled guards into the existing helper and removed a dead branch in the export path. Behaviour unchanged, checks green."],
  ["performance", 0.35, 3, 9, "Nightly performance report", "Measured the list view with 2k rows; the memo boundary was recomputing on every scroll. Moved it up one level."],
  ["conventions-followup", 0.5, 4, 10, "Nightly conventions follow-up", "Took the 'one canonical validator' theme: two call sites now share the schema instead of re-checking fields by hand."],
  ["conventions", 0.55, 5, 9, "Nightly conventions sweep", "Read the guide files first. Four small rule breaks fixed, two design-level ones flagged for a human."],
  ["architecture", 0.4, 9, 22, "Nightly architecture report", "The provider seam typed as optional forced every adapter to keep a fallback. Made the contract total; four fallbacks deleted."],
  ["smoke-tests", 0.1, 1, 4, "Nightly smoke-test report", "The app still opens, the three main screens render, no new test needed tonight."],
  ["issues", 0.45, 6, 18, "Nightly issue report", "Picked the one small, clear issue: the toast opened the wrong panel after export. Fixed with a test."],
];
let prNo = 180;
const ledger = {};
const reviewLog = [];
const today = new Date(); today.setHours(0, 0, 0, 0);
for (let back = 44; back >= 1; back--) {
  const day = new Date(today.getTime() - back * 86400e3);
  const key = `${day.getFullYear()}${pad(day.getMonth() + 1)}${pad(day.getDate())}`;
  const dir = path.join(runs, key);
  fs.mkdirSync(dir);
  let t = new Date(day); t.setHours(5, 12, 0, 0);
  const lines = [];
  if (rnd() < 0.08) { // the laptop was asleep
    t.setHours(9, 40); lines.push(`[${stamp(t)}] it is past 8:00. skipping tonight's batch`);
    fs.writeFileSync(path.join(dir, "_batch.log"), lines.join("\n") + "\n"); continue;
  }
  lines.push(`[${stamp(t)}] batch start`);
  const nightPRs = [];
  for (const [name, yieldP, lo, hi, title, body] of JOBS) {
    lines.push(`[${stamp(t)}] START ${name} (branch=main)`);
    const mins = lo + rnd() * (hi - lo);
    const pr = rnd() < yieldP;
    t = new Date(t.getTime() + mins * 60e3);
    const exit = rnd() < 0.015 ? 124 : 0;
    lines.push(`[${stamp(t)}] END   ${name} exit=${exit}`);
    let report;
    if (exit) report = `Timed out after 45 minutes while running the checks. Nothing was pushed.`;
    else if (pr) { prNo++; nightPRs.push(prNo); report = `## ${title}, ${key.slice(0, 4)}-${key.slice(4, 6)}-${key.slice(6, 8)}\n\nPR: https://github.com/${REPO}/pull/${prNo}\n\n${body}\n\nChecks: lint, typecheck and tests pass. Guard: no shared files with any open PR.`; }
    else report = `## ${title}, ${key.slice(0, 4)}-${key.slice(4, 6)}-${key.slice(6, 8)}\n\nNo change. ${body.split(". ")[0]}. Nothing cleared the bar tonight, so the repo was left clean.`;
    fs.writeFileSync(path.join(dir, name + ".log"), report + "\n");
    t = new Date(t.getTime() + 1000);
  }
  lines.push(`[${stamp(t)}] batch done`);
  fs.writeFileSync(path.join(dir, "_batch.log"), lines.join("\n") + "\n");
  fs.writeFileSync(path.join(out, "done-" + key), "");
  // review ticks every two hours at :07
  for (let h = 0; h < 24; h += 2) {
    const rt = new Date(day); rt.setHours(h, 7, 0, 0);
    if (h === 6 && nightPRs.length) {
      reviewLog.push(`[${stamp(rt)}] reviewing PRs: ${nightPRs.join(",")}`);
      const comments = Math.floor(rnd() * 3);
      reviewLog.push(`\n**Reviewed:** ${nightPRs.map((n) => "#" + n).join(", ")} (diffs only, working tree untouched).\n\n**Comments posted:** ${comments}\n\n${comments ? "- One place where the new helper is called with a value it already validated. Suggested dropping the second check." : "Nothing cleared the bar; left a short lgtm on each."}\n`);
      const done = new Date(rt.getTime() + (60 + rnd() * 240) * 1000);
      reviewLog.push(`[${stamp(done)}] done; ledger updated`);
      for (const n of nightPRs) ledger[n] = Array.from({ length: 40 }, () => "0123456789abcdef"[Math.floor(rnd() * 16)]).join("");
    } else reviewLog.push(`[${stamp(rt)}] nothing new`);
  }
  for (const n of Object.keys(ledger)) if (rnd() < 0.12) delete ledger[n]; // merged
}
fs.writeFileSync(path.join(out, "review.log"), reviewLog.join("\n") + "\n");
fs.writeFileSync(path.join(out, "review-ledger.json"), JSON.stringify(ledger, null, 2) + "\n");
console.log("demo state written to " + out);

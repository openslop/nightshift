// Derived numbers from the loaded state: per-job stats, per-night series, yield, streaks, review cadence.
"use strict";

const median = (a) => { if (!a.length) return 0; const s = [...a].sort((x, y) => x - y); const m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
const mean = (a) => (a.length ? a.reduce((n, v) => n + v, 0) / a.length : 0);

function compute(d, order) {
  const nights = [...d.nights].reverse(); // old → new
  const ran = nights.filter((n) => n.jobs.length);
  const perJob = order.map((name) => {
    const runs = ran.map((n) => n.jobs.find((j) => j.name === name)).filter(Boolean);
    const durs = runs.map((j) => j.dur / 60000);
    const prs = runs.filter((j) => j.status === "pr").length;
    const fails = runs.filter((j) => j.status === "error" || j.status === "timeout").length;
    return { name, n: runs.length, prs, fails, yield: runs.length ? prs / runs.length : 0, mean: mean(durs), median: median(durs), min: durs.length ? Math.min(...durs) : 0, max: durs.length ? Math.max(...durs) : 0 };
  });
  const batchDur = ran.map((n) => n.dur / 60000);
  const prsPerNight = ran.map((n) => n.prs);
  const avg7 = batchDur.map((_, i) => mean(batchDur.slice(Math.max(0, i - 6), i + 1)));
  const totalJobs = ran.reduce((s, n) => s + n.jobs.length, 0);
  const totalPRs = ran.reduce((s, n) => s + n.prs, 0);
  const statusMix = { pr: 0, noop: 0, fail: 0 };
  for (const n of ran) for (const j of n.jobs) statusMix[j.status === "pr" ? "pr" : j.status === "error" || j.status === "timeout" ? "fail" : "noop"]++;
  // streak: consecutive calendar days ending at the newest night that completed
  let streak = 0;
  {
    let prev = null;
    for (const n of d.nights) {
      if (!n.complete) { if (streak === 0 && prev === null) { prev = n.date; continue; } break; }
      if (prev !== null) {
        const a = new Date(prev.slice(0, 4), prev.slice(4, 6) - 1, prev.slice(6, 8)), b = new Date(n.date.slice(0, 4), n.date.slice(4, 6) - 1, n.date.slice(6, 8));
        if (Math.round((a - b) / 86400e3) !== 1) break;
      }
      streak++; prev = n.date;
    }
  }
  // review cadence over the last 14 days
  const days = [];
  const today = new Date(); today.setHours(0, 0, 0, 0);
  for (let i = 13; i >= 0; i--) { const dd = new Date(today.getTime() - i * 86400e3); days.push({ key: dd.toISOString().slice(0, 10), label: String(dd.getDate()).padStart(2, "0"), passes: 0, comments: 0, quiet: 0 }); }
  const byKey = new Map(days.map((x) => [x.key, x]));
  for (const k of d.review.ticks) {
    const day = byKey.get(new Date(k.t).toISOString().slice(0, 10)); if (!day) continue;
    if (k.kind === "review") { day.passes++; const m = (k.report || "").match(/Comments posted:\*?\*?\s*(\d+)/i); if (m) day.comments += +m[1]; }
    else if (k.kind === "noop") day.quiet++;
  }
  return {
    perJob, batchDur, avg7, prsPerNight, labels: ran.map((n) => n.label.slice(5)),
    totalJobs, totalPRs, yield: totalJobs ? totalPRs / totalJobs : 0, medianBatch: median(batchDur), meanBatch: mean(batchDur),
    statusMix, streak, nights: ran.length, sessions: d.nights.reduce((s, n) => s + n.jobs.filter((j) => j.session).length, 0),
    days, reviewPasses: d.review.ticks.filter((k) => k.kind === "review").length, reviewComments: days.reduce((s, x) => s + x.comments, 0),
  };
}

module.exports = { compute, median, mean };

// Chart widgets for the metrics view: area chart, range bars, columns, ring gauge, seven-segment tiles.
"use strict";

const { mix } = require("./term");
const { Braille, bigClock } = require("./widgets");

const rpad = (s, n) => String(s).padStart(n).slice(-n);

// Filled area + line, optional overlay line (moving average), animated reveal from the left.
function area(scr, x, y, w, h, series, overlay, th, t, opts = {}) {
  const { reveal = 1, color = th.fg, color2 = th.accent, labels = [], unit = "" } = opts;
  const bc = new Braille(w, h);
  const W = w * 2, H = h * 4;
  const n = series.length;
  if (n < 2) return;
  const max = Math.max(1e-9, ...series, ...(overlay || []));
  const shown = Math.max(2, Math.floor(n * reveal));
  const X = (i) => Math.round((i / (n - 1)) * (W - 1));
  const Y = (v) => H - 1 - Math.round((v / max) * (H - 3));
  for (let i = 0; i < shown; i++) {
    const px = X(i), py = Y(series[i]);
    for (let yy = py; yy < H; yy += 2) bc.set(px, yy, 0.18 + 0.25 * (1 - (yy - py) / H)); // hatched fill
    if (i > 0) bc.line(X(i - 1), Y(series[i - 1]), px, py, 0.85);
  }
  if (overlay) for (let i = 1; i < shown; i++) bc.line(X(i - 1), Y(overlay[i - 1]), X(i), Y(overlay[i]), 2);
  // comet on the head of the line
  const hi = shown - 1;
  if (hi >= 0) { const px = X(hi), py = Y(series[hi]); bc.set(px, py, 3); bc.set(px - 1, py, 3); bc.set(px, py - 1, 3); bc.set(px, py + 1, 3); }
  bc.blit(scr, x, y, (v) => (v >= 3 ? th.bright : v >= 2 ? color2 : v >= 0.8 ? color : mix(th.line, th.muted, v / 0.5)));
  // y-axis extremes and x labels
  scr.text(x + w - String(Math.round(max) + unit).length, y, Math.round(max) + unit, { fg: th.dim });
  if (labels.length) { scr.text(x, y + h, labels[0], { fg: th.dim }); const l = labels[labels.length - 1]; scr.text(x + w - l.length, y + h, l, { fg: th.dim }); }
}

// Horizontal range bars: min ├───█───┤ max with a median marker. rows: [{label, min, max, mid, color, right}]
function rangeBars(scr, x, y, w, rows, th, t, opts = {}) {
  const { reveal = 1, labelW = 16, unit = "m" } = opts;
  const gmax = Math.max(1e-9, ...rows.map((r) => r.max));
  const bx = x + labelW + 1, bw = w - labelW - 9;
  for (let i = 0; i < rows.length; i++) {
    const r = rows[i], yy = y + i;
    scr.text(x, yy, r.label.slice(0, labelW), { fg: r.sel ? th.bright : th.fg2 });
    for (let k = 0; k < bw; k++) scr.put(bx + k, yy, "╌", { fg: th.line });
    const a = bx + Math.round((r.min / gmax) * (bw - 1) * reveal), b = bx + Math.round((r.max / gmax) * (bw - 1) * reveal), m = bx + Math.round((r.mid / gmax) * (bw - 1) * reveal);
    for (let k = a; k <= b; k++) scr.put(k, yy, "─", { fg: mix(r.color || th.fg2, th.fg, 0.3) });
    scr.put(a, yy, "├", { fg: r.color || th.fg2 }); scr.put(b, yy, "┤", { fg: r.color || th.fg2 });
    const blink = r.sel && ((t * 3) | 0) % 2;
    scr.put(m, yy, "█", { fg: blink ? th.bright : r.color || th.fg });
    scr.text(bx + bw + 1, yy, rpad(Math.round(r.mid) + unit, 7), { fg: th.fg });
  }
}

// Vertical columns (full block height) with values and labels; two series interleaved.
function columns(scr, x, y, w, h, groups, th, t, opts = {}) {
  const { reveal = 1, colors = [th.accent, th.ok], names = ["a", "b"] } = opts;
  const max = Math.max(1, ...groups.flatMap((g) => g.values));
  const gw = Math.max(3, Math.floor(w / groups.length));
  const BARS = "▁▂▃▄▅▆▇█";
  groups.forEach((g, gi) => {
    const gx = x + gi * gw;
    g.values.forEach((v, si) => {
      const cx = gx + si;
      const full = (v / max) * (h - 1) * reveal;
      for (let r = 0; r < h - 1; r++) {
        const level = full - r;
        const cy = y + h - 2 - r;
        if (level >= 1) scr.put(cx, cy, "█", { fg: mix(colors[si], th.bright, r / h * 0.6) });
        else if (level > 0) scr.put(cx, cy, BARS[Math.min(7, Math.floor(level * 8))], { fg: colors[si] });
      }
      if (v > 0 && full >= 1) scr.text(cx, y + h - 2 - Math.floor(full), String(v), { fg: th.bright }, 1);
    });
    scr.text(gx, y + h - 1, g.label, { fg: g.today ? th.bright : th.dim }, gw - 1);
  });
  let lx = x + w - names.reduce((s, n) => s + n.length + 3, 0);
  names.forEach((n, i) => { scr.text(lx, y - 1, "█ " + n, { fg: colors[i] }); lx += n.length + 3; });
}

// Ring gauge: segments of a circle, [{frac, color}], with a centre label. Sweeps in on reveal.
function ring(scr, x, y, w, h, segs, th, t, opts = {}) {
  const { reveal = 1, label = "", sub = "" } = opts;
  const bc = new Braille(w, h);
  const W = w * 2, H = h * 4;
  const cx = W / 2, cy = H / 2, R = Math.min(W / 2, H / 2) - 1, r0 = R * 0.62;
  let a0 = -Math.PI / 2;
  const cols = [];
  segs.forEach((sg, i) => {
    const a1 = a0 + sg.frac * Math.PI * 2 * reveal;
    const steps = Math.max(6, Math.floor((a1 - a0) * R * 1.5));
    for (let s = 0; s <= steps; s++) {
      const a = a0 + ((a1 - a0) * s) / steps;
      for (let rr = r0; rr <= R; rr += 0.7) bc.set(Math.round(cx + Math.cos(a) * rr), Math.round(cy + Math.sin(a) * rr), 1 + i);
    }
    a0 += sg.frac * Math.PI * 2;
    cols.push(sg.color);
  });
  // spinning tick around the outside
  const sa = t * 1.5;
  bc.set(Math.round(cx + Math.cos(sa) * (R + 1.5)), Math.round(cy + Math.sin(sa) * (R + 1.5)), 9);
  bc.blit(scr, x, y, (v) => (v >= 9 ? th.bright : cols[Math.round(v) - 1] || th.muted));
  if (label) scr.text(x + Math.max(0, (w - label.length) >> 1), y + (h >> 1) - (sub ? 1 : 0), label, { fg: th.bright });
  if (sub) scr.text(x + Math.max(0, (w - sub.length) >> 1), y + (h >> 1), sub, { fg: th.fg2 });
}

// Seven-segment stat tile: big digits, unit and caption. Counts up on reveal.
function tile(scr, x, y, value, unit, caption, th, reveal = 1, color) {
  const shown = typeof value === "number" ? Math.round(value * Math.min(1, reveal)) : value;
  const s = String(shown);
  const wdt = bigClock(scr, x, y, s, th, false);
  if (color) for (let r = 0; r < 5; r++) for (let i = 0; i < wdt; i++) { const c = scr.back[y + r] && scr.back[y + r][x + i]; if (c && c.ch !== " ") c.fg = color; }
  if (unit) scr.text(x + wdt, y + 4, unit, { fg: th.fg2 });
  scr.text(x, y + 6, caption.toUpperCase(), { fg: th.dim });
  return wdt + (unit ? unit.length : 0);
}

module.exports = { area, rangeBars, columns, ring, tile };

// ASCII / braille widgets: panel chrome, big clock, wave surface, radar, scopes, sparks, grids.
"use strict";

const { mix } = require("./term");

// ---------- braille canvas ----------
// Each cell holds 2x4 dots. Bits per the Unicode braille layout.
const DOT = [[0x01, 0x08], [0x02, 0x10], [0x04, 0x20], [0x40, 0x80]];

class Braille {
  constructor(w, h) { this.w = w; this.h = h; this.cells = new Uint8Array(w * h); this.val = new Float32Array(w * h).fill(-1); }
  set(px, py, v = 1) {
    const cx = px >> 1, cy = py >> 2;
    if (px < 0 || py < 0 || cx >= this.w || cy >= this.h) return;
    const i = cy * this.w + cx;
    this.cells[i] |= DOT[py & 3][px & 1];
    if (v > this.val[i]) this.val[i] = v;
  }
  line(x0, y0, x1, y1, v = 1) {
    const dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
    let err = dx - dy;
    for (;;) {
      this.set(x0, y0, v);
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * err;
      if (e2 > -dy) { err -= dy; x0 += sx; }
      if (e2 < dx) { err += dx; y0 += sy; }
    }
  }
  blit(scr, x, y, colorFn) {
    for (let cy = 0; cy < this.h; cy++)
      for (let cx = 0; cx < this.w; cx++) {
        const i = cy * this.w + cx;
        const b = this.cells[i];
        if (!b) continue;
        scr.put(x + cx, y + cy, String.fromCharCode(0x2800 + b), { fg: colorFn(this.val[i]) });
      }
  }
}

// ---------- panel chrome ----------
// Outer panels (like the reference): a caption row "LEFT ......... RIGHT" over a hairline.
function caption(scr, x, y, w, left, right, th, glow = 0) {
  for (let i = 0; i < w; i++) scr.put(x + i, y + 1, "─", { fg: th.line });
  if (glow > 0) { // a comet travelling the rule
    const gx = x + Math.floor(glow * w) % w;
    scr.put(gx, y + 1, "━", { fg: th.bright });
    for (let k = 1; k <= 4; k++) if (gx - k >= x) scr.put(gx - k, y + 1, "━", { fg: mix(th.line, th.accent, 1 - k / 5) });
  }
  scr.text(x, y, left.toUpperCase(), { fg: th.fg2 });
  if (right) scr.text(x + w - right.length, y, right.toUpperCase(), { fg: th.dim });
}

// Boxed panel with the caption inset in the border (the main terminal panel).
function box(scr, x, y, w, h, left, right, th, active) {
  const c = active ? th.lineHi : th.line;
  scr.put(x, y, "┌", { fg: c }); scr.put(x + w - 1, y, "┐", { fg: c });
  scr.put(x, y + h - 1, "└", { fg: c }); scr.put(x + w - 1, y + h - 1, "┘", { fg: c });
  for (let i = 1; i < w - 1; i++) { scr.put(x + i, y, "─", { fg: c }); scr.put(x + i, y + h - 1, "─", { fg: c }); }
  for (let j = 1; j < h - 1; j++) { scr.put(x, y + j, "│", { fg: c }); scr.put(x + w - 1, y + j, "│", { fg: c }); }
  if (left) scr.text(x + 2, y, " " + left.toUpperCase() + " ", { fg: th.fg2 });
  if (right) scr.text(x + w - 3 - right.length, y, " " + right.toUpperCase() + " ", { fg: th.dim });
}

// ---------- big seven-segment clock ----------
const SEG = { // a b c d e f g
  0: "abcdef", 1: "bc", 2: "abdeg", 3: "abcdg", 4: "bcfg", 5: "acdfg", 6: "acdefg", 7: "abc", 8: "abcdefg", 9: "abcdfg",
};
function glyph(d) {
  const s = SEG[d] || "";
  const has = (k) => s.includes(k);
  const tl = has("a") && has("f") ? "╭" : has("a") ? "╶" : has("f") ? "╷" : " ";
  const tr = has("a") && has("b") ? "╮" : has("a") ? "╴" : has("b") ? "╷" : " ";
  const bl = has("d") && has("e") ? "╰" : has("d") ? "╶" : has("e") ? "╵" : " ";
  const br = has("d") && has("c") ? "╯" : has("d") ? "╴" : has("c") ? "╵" : " ";
  const ml = (() => { const u = has("f"), dn = has("e"), g = has("g");
    if (u && dn && g) return "├"; if (u && dn) return "│"; if (u && g) return "╰"; if (dn && g) return "╭"; if (g) return "╶"; if (u) return "╵"; if (dn) return "╷"; return " "; })();
  const mr = (() => { const u = has("b"), dn = has("c"), g = has("g");
    if (u && dn && g) return "┤"; if (u && dn) return "│"; if (u && g) return "╯"; if (dn && g) return "╮"; if (g) return "╴"; if (u) return "╵"; if (dn) return "╷"; return " "; })();
  const H = (k) => (has(k) ? "──" : "  ");
  return [
    tl + H("a") + tr,
    (has("f") ? "│" : " ") + "  " + (has("b") ? "│" : " "),
    ml + H("g") + mr,
    (has("e") ? "│" : " ") + "  " + (has("c") ? "│" : " "),
    bl + H("d") + br,
  ];
}
const COLON = [" ", "•", " ", "•", " "];
function bigClock(scr, x, y, text, th, dim = false) {
  let cx = x;
  for (const ch of text) {
    const rows = ch === ":" ? COLON : glyph(ch);
    for (let r = 0; r < 5; r++) scr.text(cx, y + r, rows[r], { fg: dim ? th.fg2 : th.bright });
    cx += ch === ":" ? 2 : 5;
  }
  return cx - x;
}

// ---------- wave surface ----------
function waves(scr, x, y, w, h, t, th, energy = 1) {
  const bc = new Braille(w, h);
  const W = w * 2, H = h * 4;
  const N = 13;
  const cx = W / 2, cy = H * 0.6;
  const sx = W / (2 * N + 2), sy = H / (3.4 * N);
  const P = [];
  for (let i = 0; i <= N; i++) {
    P[i] = [];
    for (let j = 0; j <= N; j++) {
      const u = i / N - 0.5, v = j / N - 0.5;
      const r = Math.hypot(u, v);
      const z = (Math.sin(r * 13 - t * 2.1) * 0.55 + Math.sin(u * 8 + t * 1.2) * Math.cos(v * 6 - t * 0.8) * 0.45) * energy;
      P[i][j] = [Math.round(cx + (i - j) * sx), Math.round(cy + (i + j - N) * sy - z * H * 0.17), (z + 1) / 2];
    }
  }
  for (let i = 0; i <= N; i++)
    for (let j = 0; j <= N; j++) {
      const a = P[i][j];
      if (i < N) { const b = P[i + 1][j]; bc.line(a[0], a[1], b[0], b[1], (a[2] + b[2]) / 2); }
      if (j < N) { const b = P[i][j + 1]; bc.line(a[0], a[1], b[0], b[1], (a[2] + b[2]) / 2); }
    }
  bc.blit(scr, x, y, (v) => mix(th.dim, th.fg, Math.max(0, Math.min(1, v * 1.2 - 0.1))));
  scr.put(x, y, "┌", { fg: th.line }); scr.put(x + w - 1, y, "┐", { fg: th.line });
  scr.put(x, y + h - 1, "└", { fg: th.line }); scr.put(x + w - 1, y + h - 1, "┘", { fg: th.line });
}

// ---------- radar ----------
// blips: [{a: angle 0..1, r: 0..1, hot: bool}]
function radar(scr, x, y, w, h, t, th, blips) {
  const bc = new Braille(w, h);
  const W = w * 2, H = h * 4;
  const cx = W / 2, cy = H / 2, R = Math.min(W / 2, H / 2) - 1;
  const rings = 4;
  for (let k = 1; k <= rings; k++) {
    const r = (R * k) / rings;
    const steps = Math.max(24, Math.floor(r * 4));
    for (let s = 0; s < steps; s++) {
      const a = (s / steps) * Math.PI * 2;
      bc.set(Math.round(cx + Math.cos(a) * r), Math.round(cy + Math.sin(a) * r), 0.15);
    }
  }
  const sweep = (t * 0.6) % 1;
  const sa = sweep * Math.PI * 2;
  bc.line(Math.round(cx), Math.round(cy), Math.round(cx + Math.cos(sa) * R), Math.round(cy + Math.sin(sa) * R), 1);
  for (let k = 1; k < 10; k++) {
    const a = sa - k * 0.045;
    bc.line(Math.round(cx), Math.round(cy), Math.round(cx + Math.cos(a) * R), Math.round(cy + Math.sin(a) * R), 0.62 - k * 0.05);
  }
  bc.set(Math.round(cx), Math.round(cy), 1); bc.set(Math.round(cx) + 1, Math.round(cy), 1);
  for (const b of blips) {
    const d = ((sweep - b.a) % 1 + 1) % 1; // time since sweep passed
    const v = b.hot ? (d < 0.05 ? 1.5 : Math.max(0.4, 1 - d * 1.1)) : Math.max(0.2, 0.55 - d);
    const px = Math.round(cx + Math.cos(b.a * Math.PI * 2) * R * b.r), py = Math.round(cy + Math.sin(b.a * Math.PI * 2) * R * b.r);
    bc.set(px, py, v); bc.set(px + 1, py, v);
    if (b.hot && d < 0.1) { bc.set(px - 1, py, v); bc.set(px + 2, py, v); bc.set(px, py - 1, v); bc.set(px, py + 1, v); bc.set(px - 2, py, v * 0.6); bc.set(px + 3, py, v * 0.6); }
  }
  bc.blit(scr, x, y, (v) => (v >= 1.4 ? th.bright : v >= 0.75 ? mix(th.accent, th.bright, (v - 0.75) / 0.65) : v >= 0.34 ? mix(th.fg2, th.accent, (v - 0.34) / 0.4) : mix(th.line, th.muted, v / 0.34)));
}

// ---------- scope line (a series drawn as a braille polyline) ----------
function scope(scr, x, y, w, h, series, t, th, color) {
  const bc = new Braille(w, h);
  const W = w * 2, H = h * 4;
  const n = series.length;
  if (n < 2) { bc.line(0, H - 1, W - 1, H - 1, 0.2); bc.blit(scr, x, y, () => th.line); return; }
  const max = Math.max(1e-9, ...series);
  let px = 0, py = H - 1 - Math.round((series[0] / max) * (H - 2));
  for (let i = 1; i < n; i++) {
    const nx = Math.round((i / (n - 1)) * (W - 1));
    const ny = H - 1 - Math.round((series[i] / max) * (H - 2));
    const age = 1 - i / n;
    bc.line(px, py, nx, ny, 1 - age * 0.7);
    px = nx; py = ny;
  }
  const head = ((t * 0.35) % 1) * (n - 1);
  const hi = Math.floor(head), fr = head - hi;
  const yAt = (i) => H - 1 - Math.round((series[Math.max(0, Math.min(n - 1, i))] / max) * (H - 2));
  const hx = Math.round((head / (n - 1)) * (W - 1)), hy = Math.round(yAt(hi) + (yAt(hi + 1) - yAt(hi)) * fr);
  bc.set(hx, hy, 2); bc.set(hx - 1, hy, 1.6); bc.set(hx - 2, hy, 1.3);
  bc.blit(scr, x, y, (v) => (v >= 1.3 ? mix(color || th.fg, th.bright, Math.min(1, (v - 1.3) / 0.7)) : mix(th.dim, color || th.fg, v)));
}

const BARS = "▁▂▃▄▅▆▇█";
function spark(scr, x, y, w, series, th, color) {
  const max = Math.max(1e-9, ...series);
  const s = series.slice(-w);
  for (let i = 0; i < s.length; i++) {
    const v = s[i] / max;
    const ch = v <= 0 ? " " : BARS[Math.min(7, Math.floor(v * 7.99))];
    scr.put(x + w - s.length + i, y, ch, { fg: mix(th.muted, color || th.fg, v) });
  }
}

// Spike chart (like the network panel): vertical spikes on a faint grid, braille.
function spikes(scr, x, y, w, h, series, th) {
  const bc = new Braille(w, h);
  const W = w * 2, H = h * 4;
  for (let gx = 0; gx < W; gx += 8) for (let gy = 0; gy < H; gy += 8) bc.set(gx, gy, 0.05);
  const max = Math.max(1, ...series);
  const mid = Math.round(H * 0.35);
  bc.line(0, mid, W - 1, mid, 0.18);
  const n = series.length;
  for (let i = 0; i < n; i++) {
    const v = series[i] / max;
    if (v <= 0) continue;
    const px = Math.round(((i + 0.5) / n) * (W - 1));
    const len = Math.round(v * (H - mid - 1));
    bc.line(px, mid, px, mid + len, (i === n - 1 ? 0.7 + 0.3 * Math.sin(Date.now() / 250) : 0.4) + v * 0.6);
    // faint flare at the base, like the reference
    bc.set(px - 1, mid + 1, 0.3); bc.set(px + 1, mid + 1, 0.3);
    bc.set(px - 2, mid, 0.2); bc.set(px + 2, mid, 0.2);
  }
  bc.blit(scr, x, y, (v) => (v < 0.1 ? th.line : v < 0.3 ? th.dim : mix(th.fg2, th.bright, (v - 0.3) / 0.7)));
}

// Night grid: one glyph per night, newest at the end.
function nightGrid(scr, x, y, w, h, nights, selected, th, t) {
  const cells = w * h;
  const list = nights.slice(0, cells).reverse();
  const off = cells - list.length;
  const si = list.indexOf(selected) + off;
  const sx = si % w, sy = Math.floor(si / w);
  const rr = ((t * 1.2) % 4) * 6; // ripple radius in cells
  for (let i = 0; i < cells; i++) {
    const cx = x + (i % w), cy = y + Math.floor(i / w);
    const n = list[i - off];
    if (!n) { scr.put(cx, cy, "·", { fg: th.line }); continue; }
    let ch = "·", fg = th.muted;
    if (n.jobs.some((j) => j.status === "running")) { ch = "◉"; fg = ((t * 2) | 0) % 2 ? th.accent : th.accent2; }
    else if (n.jobs.some((j) => j.status === "error" || j.status === "timeout")) { ch = "×"; fg = th.bad; }
    else if (n.prs > 0) { ch = "●"; fg = mix(th.fg2, th.ok, Math.min(1, n.prs / 5)); }
    else if (n.dropped && !n.jobs.length) { ch = "·"; fg = th.dim; }
    else if (n.jobs.length) { ch = "○"; fg = th.fg2; }
    if (n === selected) { scr.put(cx, cy, ch, { fg: th.bright, bg: th.selBar }); continue; }
    const dist = Math.hypot((i % w) - sx, (Math.floor(i / w) - sy) * 2);
    const ring = Math.abs(dist - rr) < 1.2 ? 1 - Math.abs(dist - rr) / 1.2 : 0;
    scr.put(cx, cy, ch, { fg: ring ? mix(fg, th.bright, ring * 0.8) : fg });
  }
}

// Bracket meter like htop: 1 [||||||       ] 12%
function meter(scr, x, y, w, frac, label, right, th, color, reveal = 1) {
  frac *= Math.min(1, reveal);
  scr.text(x, y, label, { fg: th.fg2 });
  const bx = x + label.length;
  const bw = Math.max(3, w - label.length - right.length - 1);
  scr.put(bx, y, "[", { fg: th.muted });
  const fillN = Math.round(Math.max(0, Math.min(1, frac)) * (bw - 2));
  for (let i = 0; i < bw - 2; i++) scr.put(bx + 1 + i, y, i < fillN ? "|" : " ", { fg: i === fillN - 1 ? th.bright : i < fillN ? mix(color, th.bright, i / (bw - 2)) : th.line });
  scr.put(bx + bw - 1, y, "]", { fg: th.muted });
  scr.text(bx + bw + 1, y, right, { fg: th.dim });
}

module.exports = { Braille, caption, box, bigClock, waves, radar, scope, spark, spikes, nightGrid, meter };

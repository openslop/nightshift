// Visual effects: a tiny 3D pipeline on the braille canvas, plus charts and screen-wide passes.
"use strict";

const { mix } = require("./term");
const { Braille } = require("./widgets");

// ---------- 3D ----------
function rot(p, ay, ax) {
  const [x, y, z] = p;
  const cy = Math.cos(ay), sy = Math.sin(ay);
  const x1 = x * cy + z * sy, z1 = -x * sy + z * cy;
  const cx = Math.cos(ax), sx = Math.sin(ax);
  return [x1, y * cx - z1 * sx, y * sx + z1 * cx];
}
function proj(p, W, H, scale, dist = 3.4) {
  const f = dist / (dist + p[2]);
  return [Math.round(W / 2 + p[0] * f * scale), Math.round(H / 2 - p[1] * f * scale), f];
}

// Rotating heightfield: rows = nights (old → new), cols = jobs. grid[r][c] in 0..1 or null.
// cam: {angle, tilt, zoom}. sel: {row, col} may be fractional (tweened). sparks: Set of "r,c" cells
// that opened PRs (they shed rising sparks). pulse: Set of "r,c" running cells. Returns anchor
// points in cell coords for labels: {pin, old, new, col}.
function terrain(scr, x, y, w, h, t, th, grid, sel = {}, opts = {}) {
  const { cam = { angle: t * 0.26, tilt: 0.62, zoom: 1 }, sparks = new Set(), pulse = new Set(), fog = true } = opts;
  const bc = new Braille(w, h);
  const W = w * 2, H = h * 4;
  const R = grid.length, C = R ? grid[0].length : 0;
  const ay = cam.angle, ax = cam.tilt + 0.08 * Math.sin(t * 0.3);
  const scale = Math.min(W, H * 1.35) * (opts.big ? 0.37 : 0.46) * cam.zoom;
  const pos = (r, c, v) => rot([(C > 1 ? c / (C - 1) - 0.5 : 0) * 1.75, -0.35 + (v || 0) * 0.8, (R > 1 ? r / (R - 1) - 0.5 : 0) * 1.75], ay, ax);
  const P = [];
  const rowW = (r) => Math.max(0, 1 - Math.abs(r - (sel.row == null ? -9 : sel.row)));
  const colW = (c) => Math.max(0, 1 - Math.abs(c - (sel.col == null ? -9 : sel.col)));
  const depth = (f) => (fog ? 0.45 + 0.55 * Math.max(0, Math.min(1, (f - 0.7) / 0.6)) : 1);
  for (let r = 0; r < R; r++) {
    P[r] = [];
    for (let c = 0; c < C; c++) {
      let v = grid[r][c]; if (v == null) v = 0;
      if (pulse.has(r + "," + c)) v = 0.5 + 0.5 * Math.sin(t * 5);
      P[r][c] = { p: proj(pos(r, c, v), W, H, scale), v };
    }
  }
  const K = [[0, 0], [0, C - 1], [R - 1, C - 1], [R - 1, 0]].map(([r, c]) => proj(pos(r, c, 0), W, H, scale));
  for (let i = 0; i < 4; i++) { const a = K[i], b = K[(i + 1) % 4]; bc.line(a[0], a[1], b[0], b[1], 0.06); }
  // vertical posts at the corners, like a holo-cage
  for (const [r, c] of [[0, 0], [0, C - 1], [R - 1, C - 1], [R - 1, 0]]) { const a = proj(pos(r, c, 0), W, H, scale), b = proj(pos(r, c, 0.85), W, H, scale); bc.line(a[0], a[1], b[0], b[1], 0.05); }
  for (let r = 0; r < R; r++)
    for (let c = 0; c < C; c++) {
      const a = P[r][c];
      const rw = rowW(r), cw = colW(c);
      if (c + 1 < C) { const b = P[r][c + 1]; const d = depth((a.p[2] + b.p[2]) / 2); bc.line(a.p[0], a.p[1], b.p[0], b.p[1], rw > 0.02 ? 2 + rw * 0.99 : (0.12 + (a.v + b.v) / 2 * 0.8) * d); }
      if (r + 1 < R) { const b = P[r + 1][c]; const d = depth((a.p[2] + b.p[2]) / 2); bc.line(a.p[0], a.p[1], b.p[0], b.p[1], cw > 0.02 ? 1.2 + cw * 0.79 : (0.08 + (a.v + b.v) / 2 * 0.5) * d); }
    }
  // sparks rising from PR cells
  for (const key of sparks) {
    const [r, c] = key.split(",").map(Number);
    if (!P[r] || !P[r][c]) continue;
    const seed = (r * 31 + c * 17) % 97 / 97;
    for (let k = 0; k < 2; k++) {
      const ph = (t * 0.35 + seed + k * 0.5) % 1;
      const q = proj(pos(r, c, P[r][c].v + 0.08 + ph * 0.55), W, H, scale);
      bc.set(q[0], q[1], 1.2 + (1 - ph) * 0.6);
    }
  }
  // pin on the selected cell
  let pin = null;
  if (sel.row != null && sel.col != null) {
    const rr = Math.round(sel.row), cc = Math.round(sel.col);
    if (P[rr] && P[rr][cc]) {
      const a = P[rr][cc];
      const top = proj(pos(sel.row, sel.col, a.v + 0.45 + 0.05 * Math.sin(t * 4)), W, H, scale), tip = proj(pos(sel.row, sel.col, a.v + 0.14), W, H, scale);
      bc.line(tip[0], tip[1], top[0], top[1], 3);
      bc.set(top[0] - 2, top[1], 3); bc.set(top[0] + 2, top[1], 3); bc.set(top[0], top[1] - 2, 3);
      pin = [x + (top[0] >> 1), y + (top[1] >> 2)];
    }
  }
  bc.blit(scr, x, y, (v) => (v >= 3 ? th.bright : v >= 2 ? mix(th.accent2, th.accent, Math.min(1, v - 2)) : v >= 1.2 ? mix(th.fg2, th.tert, Math.min(1, v - 1.2)) : mix(th.dim, th.fg, Math.min(1, v))));
  const cellOf = (q) => [x + (q[0] >> 1), y + (q[1] >> 2)];
  return { pin, old: cellOf(K[0]), new: cellOf(K[3]), colEnd: sel.col != null && P[R - 1] && P[R - 1][Math.round(sel.col)] ? cellOf(P[R - 1][Math.round(sel.col)].p) : null };
}

// Ridge-line rendering of the same field: one line per night, drawn far to near, each hiding
// what is behind it, with the surface below dithered by slope. Reads as a solid shape.
function ridges(scr, x, y, w, h, t, th, grid, sel = {}, opts = {}) {
  const { cam = { angle: t * 0.26, tilt: 0.62, zoom: 1 }, sparks = new Set(), pulse = new Set(), big = false } = opts;
  const W = w * 2, H = h * 4;
  const R = grid.length, C = R ? grid[0].length : 0;
  if (!R || !C) return { pin: null };
  const dots = new Uint8Array(W * H); // 0 empty · 1 dark shade · 2 light shade · 3 line · 4 selected night · 5 selected job · 6 bright
  const ay = cam.angle, ax = -(cam.tilt + 0.08 * Math.sin(t * 0.3));
  const scale = Math.min(W, H * 1.35) * (big ? 0.4 : 0.48) * cam.zoom;
  const pos = (r, c, v) => rot([(C > 1 ? c / (C - 1) - 0.5 : 0) * 1.75, -0.3 + (v || 0) * 0.6, (R > 1 ? r / (R - 1) - 0.5 : 0) * 1.75], ay, ax);
  const P = (r, c, v) => proj(pos(r, c, v), W, H, scale);
  const val = (r, c) => { let v = grid[r][c]; if (v == null) v = 0; if (pulse.has(r + "," + c)) v = 0.5 + 0.5 * Math.sin(t * 5); return v; };
  const put = (px, py, k) => { if (px >= 0 && py >= 0 && px < W && py < H) dots[py * W + px] = k; };
  const rowW = (r) => Math.max(0, 1 - Math.abs(r - (sel.row == null ? -9 : sel.row)));
  // sub-sample columns so the ridge is smooth, then order rows by depth (far first)
  const SUB = 4;
  const rows = [];
  for (let r = 0; r < R; r++) {
    const pts = [], floor = [];
    for (let c = 0; c < C - 1; c++)
      for (let k = 0; k < SUB; k++) {
        const u = k / SUB, cc = c + u, v = val(r, c) * (1 - u) + val(r, c + 1) * u;
        pts.push(P(r, cc, v)); floor.push(P(r, cc, 0));
      }
    pts.push(P(r, C - 1, val(r, C - 1))); floor.push(P(r, C - 1, 0));
    rows.push({ r, pts, floor, depth: pts.reduce((s, p) => s + p[2], 0) / pts.length });
  }
  rows.sort((a, b) => b.depth - a.depth); // nearest first; a per-column horizon hides what is behind
  const horizon = new Int16Array(W).fill(H);
  for (const row of rows) {
    const { r, pts } = row;
    const selRow = rowW(r) > 0.5;
    const near = Math.max(0, Math.min(1, (row.depth - 0.75) / 0.6));
    const band = 3 + Math.round(near * 3);
    for (let i = 0; i + 1 < pts.length; i++) {
      const [x0, y0] = pts[i], [x1, y1] = pts[i + 1];
      const slope = (y1 - y0) / Math.max(1, Math.abs(x1 - x0)); // lit from the upper left
      const shade = slope < -0.5 ? 2 : slope < 0.25 ? 1 : 0;
      const n = Math.max(1, Math.abs(x1 - x0));
      for (let k = 0; k <= n; k++) {
        const u = k / n, px = Math.round(x0 + (x1 - x0) * u), ly = Math.round(y0 + (y1 - y0) * u);
        if (px < 0 || px >= W) continue;
        if (ly < horizon[px]) {
          put(px, ly, selRow ? 4 : 3);
          for (let py = ly + 1; py < Math.min(horizon[px], ly + band); py++) {
            const lit = shade === 2 ? (px + py) % 2 === 0 : shade === 1 ? (px % 2 === 0 && py % 2 === 0) : false;
            if (lit) put(px, py, near > 0.5 ? 2 : 1);
          }
          horizon[px] = ly;
        }
      }
    }
    if (sel.col != null) { const c = Math.round(sel.col); if (c >= 0 && c < C) { const q = pts[Math.min(pts.length - 1, c * SUB)]; if (q[1] <= horizon[q[0]] + 1) { put(q[0], q[1], 5); put(q[0] + 1, q[1], 5); put(q[0] - 1, q[1], 5); } } }
  }
  for (const key of sparks) {
    const [r, c] = key.split(",").map(Number);
    if (r >= R || c >= C) continue;
    const seed = (r * 31 + c * 17) % 97 / 97;
    for (let k = 0; k < 2; k++) { const ph = (t * 0.35 + seed + k * 0.5) % 1; const q = P(r, c, val(r, c) + 0.08 + ph * 0.55); put(q[0], q[1], 4); }
  }
  let pin = null;
  if (sel.row != null && sel.col != null) {
    const rr = Math.round(sel.row), cc = Math.round(sel.col);
    if (rr >= 0 && rr < R && cc >= 0 && cc < C) {
      const v = val(rr, cc);
      const top = P(sel.row, sel.col, v + 0.45 + 0.05 * Math.sin(t * 4)), tip = P(sel.row, sel.col, v + 0.14);
      const n = Math.max(1, Math.abs(top[1] - tip[1]));
      for (let k = 0; k <= n; k++) put(Math.round(tip[0] + (top[0] - tip[0]) * k / n), Math.round(tip[1] + (top[1] - tip[1]) * k / n), 6);
      put(top[0] - 2, top[1], 6); put(top[0] + 2, top[1], 6); put(top[0], top[1] - 2, 6);
      pin = [x + (top[0] >> 1), y + (top[1] >> 2)];
    }
  }
  // dots → braille
  const DOTBITS = [[0x01, 0x08], [0x02, 0x10], [0x04, 0x20], [0x40, 0x80]];
  const col = [null, th.dim, th.muted, th.fg, th.accent, th.tert, th.bright];
  for (let cy = 0; cy < h; cy++)
    for (let cx = 0; cx < w; cx++) {
      let bits = 0, best = 0;
      for (let dy = 0; dy < 4; dy++) for (let dx = 0; dx < 2; dx++) { const k = dots[(cy * 4 + dy) * W + cx * 2 + dx]; if (k) { bits |= DOTBITS[dy][dx]; if (k > best) best = k; } }
      if (bits) scr.put(x + cx, y + cy, String.fromCharCode(0x2800 + bits), { fg: col[best] });
    }
  const K = [P(0, 0, 0), P(R - 1, 0, 0), P(R - 1, C - 1, 0)];
  const cellOf = (q) => [x + (q[0] >> 1), y + (q[1] >> 2)];
  return { pin, old: cellOf(K[0]), new: cellOf(K[1]), colEnd: sel.col != null ? cellOf(P(R - 1, Math.max(0, Math.min(C - 1, Math.round(sel.col))), val(R - 1, Math.max(0, Math.min(C - 1, Math.round(sel.col)))))) : null };
}

// Rotating icosahedron for the boot screen.
const PHI = (1 + Math.sqrt(5)) / 2;
const ICO_V = [[-1, PHI, 0], [1, PHI, 0], [-1, -PHI, 0], [1, -PHI, 0], [0, -1, PHI], [0, 1, PHI], [0, -1, -PHI], [0, 1, -PHI], [PHI, 0, -1], [PHI, 0, 1], [-PHI, 0, -1], [-PHI, 0, 1]].map((p) => p.map((v) => v / PHI / 1.15));
const ICO_E = [];
for (let i = 0; i < 12; i++) for (let j = i + 1; j < 12; j++) {
  const d = Math.hypot(...ICO_V[i].map((v, k) => v - ICO_V[j][k]));
  if (Math.abs(d - 2 / PHI / 1.15) < 0.01) ICO_E.push([i, j]);
}
function wireframe(scr, x, y, w, h, t, th) {
  const bc = new Braille(w, h);
  const W = w * 2, H = h * 4;
  const scale = Math.min(W, H) * 0.42;
  const V = ICO_V.map((p) => proj(rot(p, t * 0.9, t * 0.37), W, H, scale));
  for (const [a, b] of ICO_E) bc.line(V[a][0], V[a][1], V[b][0], V[b][1], (V[a][2] + V[b][2]) / 2 - 0.55);
  bc.blit(scr, x, y, (v) => mix(th.dim, th.accent, Math.max(0, Math.min(1, v * 2.5))));
}

// Hyperspace: stars streaking outward. state persists across frames.
function makeWarp(n = 140) {
  const rnd = () => Math.random() * 2 - 1;
  return { stars: Array.from({ length: n }, () => ({ x: rnd(), y: rnd(), z: Math.random() * 0.9 + 0.1, pz: null })), t0: Date.now() };
}
function warp(scr, x, y, w, h, st, th, label) {
  const bc = new Braille(w, h);
  const W = w * 2, H = h * 4;
  const age = (Date.now() - st.t0) / 1000;
  const speed = 0.012 + Math.min(1, age / 0.9) * 0.09;
  for (const s of st.stars) {
    const pz = s.z;
    s.z -= speed;
    if (s.z <= 0.03) { s.x = Math.random() * 2 - 1; s.y = Math.random() * 2 - 1; s.z = 1; continue; }
    const k = W * 0.22;
    const ax = W / 2 + (s.x / pz) * k, ay = H / 2 + (s.y / pz) * k * 0.9;
    const bx = W / 2 + (s.x / s.z) * k, by = H / 2 + (s.y / s.z) * k * 0.9;
    if (bx < 0 || by < 0 || bx >= W || by >= H) { s.z = 0; continue; }
    bc.line(Math.round(ax), Math.round(ay), Math.round(bx), Math.round(by), 1 - s.z);
  }
  bc.blit(scr, x, y, (v) => mix(th.dim, th.bright, Math.min(1, v * 1.3)));
  if (label) {
    const lx = x + Math.max(0, ((w - label.length) >> 1)), ly = y + (h >> 1);
    scr.fill(lx - 2, ly - 1, label.length + 4, 3, " ", { bg: th.bg });
    scr.text(lx, ly, label, { fg: th.accent, b: true });
  }
  return age;
}

// ---------- moon gauge: fills as the next shift approaches ----------
function moon(scr, x, y, w, h, phase, th) {
  const bc = new Braille(w, h);
  const W = w * 2, H = h * 4;
  const r = Math.min(W, H) / 2 - 1, cx = W / 2, cy = H / 2;
  const edge = r - 2 * r * Math.max(0, Math.min(1, phase));
  for (let py = 0; py < H; py++)
    for (let px = 0; px < W; px++) {
      const dx = px - cx + 0.5, dy = py - cy + 0.5;
      const d = Math.hypot(dx, dy);
      if (d > r) continue;
      if (dx >= edge) bc.set(px, py, 1);
      else if (d > r - 1.2) bc.set(px, py, 0.2);
    }
  bc.blit(scr, x, y, (v) => (v > 0.5 ? th.bright : th.muted));
}

// ---------- timeline (gantt) of one night's jobs ----------
function gantt(scr, x, y, w, h, night, selIdx, th, t) {
  const jobs = night.jobs;
  const labelW = Math.min(16, Math.max(8, Math.floor(w * 0.18)));
  const gx = x + labelW + 1, gw = w - labelW - 8;
  const t0 = night.start, t1 = Math.max(night.end || 0, ...jobs.map((j) => j.end || Date.now()), t0 + 60000);
  const span = t1 - t0;
  const px = (ms) => gx + Math.round(((ms - t0) / span) * (gw - 1));
  // axis
  const stepMin = span > 3 * 3600e3 ? 60 : span > 90 * 60e3 ? 15 : span > 30 * 60e3 ? 10 : 5;
  for (let m = 0; ; m += stepMin) {
    const ms = t0 + m * 60e3; if (ms > t1) break;
    const ax = px(ms);
    scr.put(ax, y, "┬", { fg: th.line });
    const lab = new Date(ms).toTimeString().slice(0, 5);
    if (ax + lab.length <= gx + gw) scr.text(ax, y - 1, lab, { fg: th.dim });
    for (let r = 1; r <= jobs.length; r++) if (r <= h - 1) scr.put(ax, y + r, "╎", { fg: th.line });
  }
  for (let i = 0; i < gw; i++) if (scr.back[y][gx + i].ch === " ") scr.put(gx + i, y, "─", { fg: th.line });
  const colors = { pr: th.ok, noop: th.fg2, done: th.fg2, empty: th.dim, running: th.accent, timeout: th.warn, error: th.bad };
  for (let i = 0; i < jobs.length && i < h - 1; i++) {
    const j = jobs[i], sel = i === selIdx;
    const ry = y + 1 + i;
    scr.text(x, ry, (sel ? "▶ " : "  ") + j.name.slice(0, labelW - 2), { fg: sel ? th.bright : th.fg2 });
    const a = px(j.start), b = Math.max(a, px(j.end || Date.now()));
    const shimmer = sel ? a + Math.floor(((t * 1.5) % 1) * (b - a + 1)) : -1;
    for (let k = a; k <= b; k++) scr.put(k, ry, sel ? "█" : "▓", { fg: k === shimmer || k === shimmer - 1 ? th.bright : sel ? mix(colors[j.status], th.bright, 0.25) : colors[j.status] });
    if (j.status === "running") scr.put(b, ry, ((t * 3) | 0) % 2 ? "▌" : "▐", { fg: th.bright });
    const dur = fmtShort(j.dur);
    scr.text(b + 2, ry, dur, { fg: sel ? th.fg : th.dim });
    if (j.prs.length) scr.text(b + 2 + dur.length + 1, ry, "#" + j.prs[0].n, { fg: th.ok });
  }
}
function fmtShort(ms) { const m = Math.round(ms / 60000); return m < 1 ? Math.round(ms / 1000) + "s" : m < 60 ? m + "m" : Math.floor(m / 60) + "h" + String(m % 60).padStart(2, "0"); }

// ---------- job × night matrix ----------
function matrix(scr, x, y, w, h, nights, order, selNight, selJob, th, t) {
  const labelW = Math.min(16, Math.max(8, Math.floor(w * 0.18)));
  const n = Math.min(nights.length, Math.floor((w - labelW - 2) / 2));
  const cols = nights.slice(0, n).reverse();
  const gx = x + labelW + 1;
  // headers: day of month, two rows (tens, ones)
  cols.forEach((nt, i) => {
    const dd = nt.date.slice(6, 8);
    const sel = nt === selNight;
    scr.put(gx + i * 2, y, dd[0], { fg: sel ? th.bright : th.dim, bg: sel ? th.selBar : undefined });
    scr.put(gx + i * 2, y + 1, dd[1], { fg: sel ? th.bright : th.dim, bg: sel ? th.selBar : undefined });
  });
  const glyph = { pr: ["●", th.ok], noop: ["○", th.fg2], done: ["◌", th.fg2], empty: ["·", th.dim], running: ["◉", th.accent], timeout: ["◔", th.warn], error: ["×", th.bad] };
  order.slice(0, h - 2).forEach((name, r) => {
    const ry = y + 2 + r;
    const selRow = name === selJob;
    scr.text(x, ry, (selRow ? "▶ " : "  ") + name.slice(0, labelW - 2), { fg: selRow ? th.bright : th.fg2 });
    cols.forEach((nt, i) => {
      const j = nt.jobs.find((k) => k.name === name);
      const sel = nt === selNight;
      const bg = sel ? th.selBar : undefined;
      if (!j) { scr.put(gx + i * 2, ry, " ", { bg }); return; }
      const [ch, fg] = glyph[j.status];
      const blink = j.status === "running" && ((t * 2) | 0) % 2;
      scr.put(gx + i * 2, ry, blink ? "○" : ch, { fg: sel && selRow ? th.bright : fg, bg });
    });
  });
}

// ---------- hex datastream ----------
function streamLine(pool) {
  const pick = () => pool[Math.floor(Math.random() * pool.length)] || "00000000";
  const hex = () => Math.floor(Math.random() * 0xffff).toString(16).padStart(4, "0").toUpperCase();
  const r = Math.random();
  if (r < 0.25) return { s: hex() + " " + pick().slice(0, 7) + " " + hex(), hot: false };
  if (r < 0.4) return { s: "▸ " + pick().slice(0, 8) + " ▸ " + hex(), hot: true };
  return { s: hex() + " " + hex() + " " + hex() + " " + hex(), hot: false };
}
function hexStream(scr, x, y, w, h, lines, th) {
  const n = Math.min(h, lines.length);
  for (let i = 0; i < n; i++) {
    const l = lines[lines.length - n + i];
    const age = 1 - i / Math.max(1, n - 1);
    scr.text(x, y + i, l.s, { fg: l.hot ? mix(th.accent2, th.accent, 1 - age) : mix(th.muted, th.fg, 1 - age * 0.9) }, w);
  }
}

// ---------- screen-wide passes ----------
function dotField(scr, th) {
  const empty = (x, y) => { const c = scr.back[y] && scr.back[y][x]; return !c || (c.ch === " " && !c.bg); };
  for (let y = 1; y < scr.h - 1; y += 2)
    for (let x = 2; x < scr.w - 1; x += 5) {
      if (!empty(x, y) || !empty(x - 1, y) || !empty(x + 1, y) || !empty(x, y - 1) || !empty(x, y + 1)) continue;
      const c = scr.back[y][x]; c.ch = "·"; c.fg = th.line;
    }
}
function scanline(scr, th, t) {
  const period = scr.h + 40;
  const r = Math.floor((t * 9) % period);
  for (let dy = -1; dy <= 1; dy++) {
    const yy = r + dy;
    if (yy < 0 || yy >= scr.h) continue;
    const k = dy === 0 ? 0.35 : 0.12;
    for (const c of scr.back[yy]) if (c.fg && c.ch !== " ") c.fg = mix(c.fg, th.bright, k);
  }
}
function glitch(scr, x, y, w, t) {
  // Every ~9 s, a 120 ms burst that scrambles a few characters in a strip.
  const phase = t % 9;
  if (phase > 0.12) return;
  const chars = "▒░╳┼╪≡";
  for (let i = 0; i < 6; i++) {
    const cx = x + Math.floor(Math.random() * w);
    const c = scr.back[y] && scr.back[y][cx];
    if (c && c.ch !== " ") c.ch = chars[Math.floor(Math.random() * chars.length)];
  }
}
// Caption rule with ruler ticks.
function ruler(scr, x, y, w, th) {
  for (let i = 0; i < w; i++) scr.put(x + i, y, i % 10 === 0 ? "┼" : "─", { fg: i % 10 === 0 ? th.lineHi : th.line });
}

module.exports = { terrain, ridges, wireframe, makeWarp, warp, moon, gantt, matrix, streamLine, hexStream, dotField, scanline, glitch, ruler, fmtShort };

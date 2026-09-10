#!/usr/bin/env node
// Renders the console's braille widgets with the console's own code and prints them as JSON:
// { name: { cols, rows, frames: [ { colourClass: [[x, y, runLength], ...] } ] } }, dot units.
// assets/gen-demo.py turns these into the README animation, so it needs no fonts or scripts.
"use strict";
const FX = require("../src/fx");
const W = require("../src/widgets");
const { themes } = require("../src/theme");

const th = themes.night;
const classes = { [th.bright]: "b", [th.accent]: "a", [th.tert]: "r", [th.ok]: "g", [th.fg]: "f" };
function cls(hex) {
  if (classes[hex]) return classes[hex];
  const v = parseInt(hex.slice(1), 16);
  return v > parseInt(th.fg2.slice(1), 16) ? "f" : v > parseInt(th.dim.slice(1), 16) ? "m" : "d";
}
function capture(draw) {
  const cells = [];
  const scr = { put(x, y, ch, st) { const code = ch.charCodeAt(0); if (code >= 0x2800 && code <= 0x28ff) cells.push([x, y, code - 0x2800, cls(st.fg)]); }, text() {}, fill() {}, back: [] };
  draw(scr);
  const layout = [[0x01, 0x08], [0x02, 0x10], [0x04, 0x20], [0x40, 0x80]];
  const dots = {};
  for (const [cx, cy, bits, c] of cells)
    for (let dy = 0; dy < 4; dy++) for (let dx = 0; dx < 2; dx++) if (bits & layout[dy][dx]) (dots[c] = dots[c] || new Set()).add((cy * 4 + dy) * 1000 + cx * 2 + dx);
  const runs = {};
  for (const c of Object.keys(dots)) {
    runs[c] = [];
    for (const key of [...dots[c]].sort((a, b) => a - b)) {
      const y = Math.floor(key / 1000), x = key % 1000;
      const last = runs[c][runs[c].length - 1];
      if (last && last[1] === y && last[0] + last[2] === x) last[2]++; else runs[c].push([x, y, 1]);
    }
  }
  return runs;
}
const seq = (cols, rows, n, draw) => ({ cols, rows, frames: Array.from({ length: n }, (_, k) => capture((scr) => draw(scr, k, n))) });

const out = {};
// deep field: 10 nights × 8 jobs, one full turn
const R = 10, C = 8;
const grid = Array.from({ length: R }, (_, r) => Array.from({ length: C }, (_, c) => 0.15 + 0.7 * Math.abs(Math.sin(r * 1.7 + c * 0.9 + 3))));
const sparks = new Set(["9,1", "9,3", "9,4", "7,1", "6,4", "4,3", "2,1"]);
out.field = seq(34, 13, 36, (scr, k, n) => FX.terrain(scr, 0, 0, 34, 13, 100 + k * 0.25, th, grid, { row: R - 1, col: 1 }, { cam: { angle: (k / n) * Math.PI * 2, tilt: 0.62, zoom: 1 }, sparks }));
// radar: one sweep
const blips = Array.from({ length: 40 }, (_, i) => ({ a: (i / 40 + 0.75) % 1, r: 0.3 + 0.65 * ((i * 13) % 7) / 7, hot: (i * 7) % 3 === 0 }));
out.radar = seq(30, 12, 30, (scr, k, n) => W.radar(scr, 0, 0, 30, 12, (k / n) / 0.6, th, blips));
// moon, two phases: before and after the shift
out.moon0 = seq(6, 3, 1, (scr) => FX.moon(scr, 0, 0, 6, 3, 0.35, th));
out.moon1 = seq(6, 3, 1, (scr) => FX.moon(scr, 0, 0, 6, 3, 0.95, th));
// a job's scope trace with the comet
const series = Array.from({ length: 28 }, (_, i) => 6 + 5 * Math.abs(Math.sin(i * 0.8)) + (i % 7 === 3 ? 9 : 0));
out.scope = seq(26, 2, 24, (scr, k, n) => W.scope(scr, 0, 0, 26, 2, series, (k / n) / 0.35, th, th.ok));
// PR spikes per night
const prs = Array.from({ length: 20 }, (_, i) => [1, 0, 3, 2, 0, 4, 1, 0, 2, 5, 0, 1, 3, 0, 2, 4, 1, 0, 3, 4][i]);
out.spikes = seq(30, 5, 1, (scr) => W.spikes(scr, 0, 0, 30, 5, prs, th));
// the boot icosahedron
out.ico = seq(14, 8, 30, (scr, k, n) => FX.wireframe(scr, 0, 0, 14, 8, (k / n) * 7, th));
process.stdout.write(JSON.stringify(out));

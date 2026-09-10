// Terminal layer: raw input, alternate screen, a cell buffer, and a diff renderer.
// Zero dependencies. Truecolor ANSI.
"use strict";

const ESC = "\x1b[";

function rgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function mix(a, b, t) {
  t = t < 0 ? 0 : t > 1 ? 1 : t;
  const A = rgb(a), B = rgb(b);
  const c = A.map((v, i) => Math.round(v + (B[i] - v) * t));
  return "#" + c.map((v) => v.toString(16).padStart(2, "0")).join("");
}

class Screen {
  constructor(out = process.stdout) {
    this.out = out;
    this.w = out.columns || 80;
    this.h = out.rows || 24;
    this.front = null; // last painted frame
    this.back = this.blank();
  }
  blank() {
    const rows = new Array(this.h);
    for (let y = 0; y < this.h; y++) {
      const row = new Array(this.w);
      for (let x = 0; x < this.w; x++) row[x] = { ch: " ", fg: null, bg: null, b: false, d: false };
      rows[y] = row;
    }
    return rows;
  }
  resize() {
    this.w = this.out.columns || 80;
    this.h = this.out.rows || 24;
    this.front = null;
    this.back = this.blank();
    this.out.write(ESC + "2J");
  }
  clear(bg) {
    for (let y = 0; y < this.h; y++)
      for (let x = 0; x < this.w; x++) {
        const c = this.back[y][x];
        c.ch = " "; c.fg = null; c.bg = bg || null; c.b = false; c.d = false;
      }
  }
  put(x, y, ch, st = {}) {
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return;
    const c = this.back[y][x];
    c.ch = ch;
    if (st.fg !== undefined) c.fg = st.fg;
    if (st.bg !== undefined) c.bg = st.bg;
    c.b = !!st.b; c.d = !!st.d;
  }
  text(x, y, s, st = {}, maxw = Infinity) {
    let i = 0;
    for (const ch of String(s)) {
      if (i >= maxw) break;
      this.put(x + i, y, ch, st);
      i++;
    }
    return i;
  }
  fill(x, y, w, h, ch, st = {}) {
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) this.put(x + i, y + j, ch, st);
  }
  flush() {
    let s = "";
    let lastFg = "", lastBg = "", lastB = null, lastD = null;
    let cx = -1, cy = -1;
    for (let y = 0; y < this.h; y++) {
      for (let x = 0; x < this.w; x++) {
        const c = this.back[y][x];
        const f = this.front && this.front[y][x];
        if (f && f.ch === c.ch && f.fg === c.fg && f.bg === c.bg && f.b === c.b && f.d === c.d) continue;
        if (cx !== x || cy !== y) { s += ESC + (y + 1) + ";" + (x + 1) + "H"; }
        if (c.b !== lastB || c.d !== lastD) {
          s += ESC + "0m"; lastFg = ""; lastBg = "";
          if (c.b) s += ESC + "1m";
          if (c.d) s += ESC + "2m";
          lastB = c.b; lastD = c.d;
        }
        if (c.fg !== lastFg) { s += c.fg ? ESC + "38;2;" + rgb(c.fg).join(";") + "m" : ESC + "39m"; lastFg = c.fg; }
        if (c.bg !== lastBg) { s += c.bg ? ESC + "48;2;" + rgb(c.bg).join(";") + "m" : ESC + "49m"; lastBg = c.bg; }
        s += c.ch;
        cx = x + 1; cy = y;
      }
    }
    if (s) this.out.write(s + ESC + "0m");
    // swap
    if (!this.front) this.front = this.blank();
    for (let y = 0; y < this.h; y++)
      for (let x = 0; x < this.w; x++) {
        const c = this.back[y][x], f = this.front[y][x];
        f.ch = c.ch; f.fg = c.fg; f.bg = c.bg; f.b = c.b; f.d = c.d;
      }
  }
}

function enter(out = process.stdout) {
  out.write(ESC + "?1049h" + ESC + "?25l" + ESC + "2J" + ESC + "H");
  if (process.stdin.isTTY) process.stdin.setRawMode(true);
  process.stdin.resume();
}
function leave(out = process.stdout) {
  if (process.stdin.isTTY) process.stdin.setRawMode(false);
  out.write(ESC + "0m" + ESC + "?25h" + ESC + "?1049l");
}

// Decode a raw stdin chunk into key names.
function decodeKeys(buf) {
  const s = buf.toString("utf8");
  const keys = [];
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (c === "\x1b") {
      const rest = s.slice(i);
      const m = rest.match(/^\x1b\[([0-9;]*)([A-Za-z~])/) || rest.match(/^\x1bO([A-Z])/);
      if (m) {
        const code = m[2] || m[1];
        const map = { A: "up", B: "down", C: "right", D: "left", H: "home", F: "end", "~": null };
        let name = map[code] || null;
        if (code === "~") {
          const n = m[1];
          name = { 5: "pgup", 6: "pgdn", 1: "home", 4: "end", 3: "delete" }[n] || "esc";
        }
        keys.push(name || "esc");
        i += m[0].length;
        continue;
      }
      keys.push("esc"); i++; continue;
    }
    if (c === "\r" || c === "\n") keys.push("enter");
    else if (c === "\x7f" || c === "\b") keys.push("backspace");
    else if (c === "\t") keys.push("tab");
    else if (c === "\x03") keys.push("ctrl-c");
    else if (c === "\x0c") keys.push("ctrl-l");
    else keys.push(c);
    i++;
  }
  return keys;
}

module.exports = { Screen, enter, leave, decodeKeys, rgb, mix };

// Drives the app headlessly against one state dir: every view, every navigation key, many sizes.
// Run as a child process by stability.test.js so a hang shows up as a timeout, not a stuck suite.
"use strict";

const { App } = require("../src/app");

const [stateDir, confFile, repoDir] = process.argv.slice(2);
const SIZES = [[240, 60], [160, 45], [120, 30], [80, 24], [40, 12], [12, 5], [3, 2], [1, 1]];
const KEYS = ["j", "k", "down", "up", "left", "h", "pgup", "right", "l", "pgdn", "home", "end", "enter", "down", "pgdn", "pgup", "home", "esc",
  "d", "<", ">", "+", "-", "[", "]", " ", "f", "d", "m", "m", "r", "down", "enter", "j", "esc", "end", "r", "?", "x", "t", "t", "R", "ctrl-l",
  "left", "left", "left", "enter", "esc", "right", "right", "right", "right", "tab", "backspace", "esc", "esc"];

for (const [columns, rows] of SIZES) {
  const out = { columns, rows, write() {}, on() {} };
  const app = new App({ state: stateDir, conf: confFile, repo: repoDir || undefined, out, noBoot: false, noWarp: true });
  app.render(); // boot screen
  app.key("x"); // any key skips boot
  app.t0 = Date.now() - 5000;
  app.render();
  for (const k of KEYS) { app.key(k); app.render(); }
  app.overlayT = Date.now() - 60000; app.overlay = "report"; app.render();
  app.view = "review"; app.render();
}
process.stdout.write("ok\n");

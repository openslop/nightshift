// Palettes. "night" is the Nightshift warm-dark palette (surfaces carry the weight, colour
// marks what is live). "phosphor" is a green CRT.
"use strict";

const themes = {
  night: {
    bg: "#140e11",
    panel: "#1a1316",
    line: "#2e282b",
    lineHi: "#4a4046",
    dim: "#4f454a",
    muted: "#6f6167",
    fg2: "#9d8b93",
    fg: "#ded6da",
    bright: "#f3eef0",
    accent: "#9d9df0",
    accent2: "#6b6bcf",
    ok: "#5fbf8a",
    warn: "#b57e38",
    bad: "#f73b3b",
    tert: "#d29cb8",
    sel: "#251e21",
    selBar: "#2c2329",
  },
  phosphor: {
    bg: "#0b0f0d",
    panel: "#0e1411",
    line: "#1f2b25",
    lineHi: "#33463c",
    dim: "#2f423a",
    muted: "#4a6457",
    fg2: "#6f8c7d",
    fg: "#a9c4b6",
    bright: "#dcefe4",
    accent: "#8de3b3",
    accent2: "#4fae80",
    ok: "#8de3b3",
    warn: "#d8b25a",
    bad: "#f0655a",
    tert: "#9ad0c4",
    sel: "#132019",
    selBar: "#182a21",
  },
};

module.exports = { themes };

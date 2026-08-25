#!/usr/bin/env node
// Generates the CalypsoCode wordmark as SVG, every cell drawn as a <rect>.
//
// The mark must never be shipped as text: the block glyphs depend on the
// viewer's fonts, and cell spacing varies between them. This is the single
// source for every deliverable — README, banner, identity sheet.
//
// The glyph rows below mirror packages/tui/src/logo.ts. If that file changes,
// update these arrays and re-run:
//
//   node generate-logo.mjs [outDir]
//
// Writes calypsocode-logo-dark.svg and calypsocode-logo-light.svg.

import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const LEFT = [
  "".padEnd(34, " "),
  "█▀▀▀ ▀▀▀▄ █    █__█ █▀▀█ █▀▀▀ █▀▀█",
  "█___ █▀▀█ █     █▀  █▄▄█ ▀▀▀█ █__█",
  "▀▀▀▀ ▀▀▀▀ ▀▀▀▀ ▀    ▀    ▀▀▀▀ ▀▀▀▀",
];

const RIGHT = [
  "             ▄     ",
  "█▀▀▀ █▀▀█ █▀▀█ █▀▀█",
  "█___ █__█ █__█ █^^^",
  "▀▀▀▀ ▀▀▀▀ ▀▀▀▀ ▀▀▀▀",
];

const CW = 8;               // cell width
const CH = 16;              // cell height
const GAP_CELLS = 1;        // space between the two halves
const PAD_CELLS = 2;        // clearspace, per the identity sheet

const LEFT_CELLS = 34;
const RIGHT_X = (LEFT_CELLS + GAP_CELLS) * CW;
const GLYPH_W = RIGHT_X + RIGHT[1].length * CW;   // 432
const GLYPH_H = LEFT.length * CH;                 // 64
const PAD = PAD_CELLS * CW;                       // 16

// Theme pairs. Dark/light values come from
// packages/tui/src/theme/assets/calypsocode.json.
const THEMES = {
  dark: {
    flat: "#7e7a98",      // textMuted — "Calypso" never takes brand color
    flatDim: "#262431",   // 25% tint behind dim cells
    boldDim: "#29194b",
    from: "#8b4cff",      // primary
    to: "#ff2e97",        // accent
  },
  light: {
    flat: "#6b6480",
    flatDim: "#dad8df",
    boldDim: "#dacbf5",
    from: "#6b2fd9",
    to: "#c21f73",
  },
};

// Glyph → which halves are painted bright, and whether a dim backing cell sits
// underneath. Mirrors the cell marks documented in the identity sheet.
function cellParts(ch) {
  switch (ch) {
    case "█": return { bright: "full" };
    case "▀": return { bright: "top" };
    case "▄": return { bright: "bottom" };
    case "_": return { dim: "full" };
    case "^": return { dim: "full", bright: "top" };
    case "~": return { dim: "top" };
    case ",": return { dim: "bottom" };
    default:  return {};
  }
}

function rect(x, y, part, fill) {
  const h = part === "full" ? CH : CH / 2;
  const yy = part === "bottom" ? y + CH / 2 : y;
  return `<rect x="${x}" y="${yy}" width="${CW}" height="${h}" fill="${fill}"/>`;
}

function group(rows, xOffset, brightFill, dimFill) {
  const out = [];
  rows.forEach((line, r) => {
    [...line].forEach((ch, c) => {
      const { bright, dim } = cellParts(ch);
      const x = xOffset + c * CW;
      const y = r * CH;
      if (dim) out.push(rect(x, y, dim, dimFill));
      if (bright) out.push(rect(x, y, bright, brightFill));
    });
  });
  return out.join("\n    ");
}

function svg(theme) {
  const t = THEMES[theme];
  const vbW = GLYPH_W + PAD * 2;
  const vbH = GLYPH_H + PAD * 2;
  // userSpaceOnUse pins the ramp to the bold half's own columns, so it does not
  // shift when clearspace changes.
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-PAD} ${-PAD} ${vbW} ${vbH}" width="${vbW}" height="${vbH}" role="img" aria-label="CalypsoCode">
  <title>CalypsoCode</title>
  <defs>
    <linearGradient id="cc" gradientUnits="userSpaceOnUse" x1="${RIGHT_X}" y1="0" x2="${GLYPH_W}" y2="0">
      <stop offset="0" stop-color="${t.from}"/>
      <stop offset="1" stop-color="${t.to}"/>
    </linearGradient>
  </defs>
  <g shape-rendering="crispEdges">
    ${group(LEFT, 0, t.flat, t.flatDim)}
    ${group(RIGHT, RIGHT_X, "url(#cc)", t.boldDim)}
  </g>
</svg>
`;
}

const outDir = process.argv[2] ?? ".";
mkdirSync(outDir, { recursive: true });
for (const theme of Object.keys(THEMES)) {
  const file = join(outDir, `calypsocode-logo-${theme}.svg`);
  writeFileSync(file, svg(theme));
  console.log(`${file}  ${GLYPH_W}×${GLYPH_H} glyph → ${GLYPH_W + PAD * 2}×${GLYPH_H + PAD * 2} with clearspace`);
}

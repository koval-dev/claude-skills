#!/usr/bin/env node
// Render a URL or local HTML file, save a full-page screenshot, and run measure.js on it.
//
// Usage:
//   node audit_url.mjs <url-or-path> [--out <dir>] [--mobile] [--width 1440] [--height 900]
//
// Writes <out>/screenshot.png (or screenshot-mobile.png) and <out>/measurements.json.
// Needs Playwright with Chromium: npm i -D playwright && npx playwright install chromium
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};
const target = args.find((a, i) => !a.startsWith('--') && !['--out', '--width', '--height'].includes(args[i - 1]));
if (!target) {
  console.error('Usage: node audit_url.mjs <url-or-path> [--out <dir>] [--mobile] [--width 1440] [--height 900]');
  process.exit(1);
}

const mobile = args.includes('--mobile');
const outDir = path.resolve(opt('--out', 'design-audit-output'));
const width = Number(opt('--width', mobile ? 390 : 1440));
const height = Number(opt('--height', mobile ? 844 : 900));
const url = /^(https?|file):\/\//.test(target) ? target : pathToFileURL(path.resolve(target)).href;
if (url.startsWith('file:') && !existsSync(fileURLToPath(url))) {
  console.error(`File not found: ${target}`);
  process.exit(1);
}

let chromium;
try {
  ({ chromium } = await import('playwright'));
} catch {
  console.error('Playwright is not installed. To use this script, run:\n  npm i -D playwright && npx playwright install chromium\n' +
    'Or run scripts/measure.js through any browser tool that can execute JavaScript in a page.');
  process.exit(2);
}

const here = path.dirname(fileURLToPath(import.meta.url));
const measureSrc = await readFile(path.join(here, 'measure.js'), 'utf8');

// Prefer Playwright's bundled Chromium; fall back to an installed Chrome or Edge.
let browser;
for (const channel of [undefined, 'chrome', 'msedge']) {
  try {
    browser = await chromium.launch(channel ? { channel } : {});
    break;
  } catch {}
}
if (!browser) {
  console.error('Could not launch a browser. Run: npx playwright install chromium');
  process.exit(2);
}
try {
  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1, isMobile: mobile, hasTouch: mobile });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 }).catch(() => page.goto(url, { waitUntil: 'load' }));
  await page.waitForTimeout(500);
  await mkdir(outDir, { recursive: true });
  const shot = path.join(outDir, mobile ? 'screenshot-mobile.png' : 'screenshot.png');
  await page.screenshot({ path: shot, fullPage: true });
  const measurements = await page.evaluate(measureSrc);
  const jsonPath = path.join(outDir, mobile ? 'measurements-mobile.json' : 'measurements.json');
  await writeFile(jsonPath, JSON.stringify(measurements, null, 2));
  console.log(`Screenshot:   ${shot}\nMeasurements: ${jsonPath}`);
  const m = measurements;
  console.log(`Summary: ${m.typography.distinctFontSizes} font sizes, ${m.spacing.distinctValues} spacing values, ` +
    `${m.contrast.failureCount} contrast failures, ${m.components.distinctButtonStyles} button styles, ` +
    `${m.alignment.nearMisses.length} near-miss alignments, box nesting ${m.regions.maxBoxNesting}, ` +
    `${m.accessibility.smallTargets.length} small targets${m.page.horizontalOverflow ? ', HORIZONTAL OVERFLOW' : ''}`);
} finally {
  await browser.close();
}

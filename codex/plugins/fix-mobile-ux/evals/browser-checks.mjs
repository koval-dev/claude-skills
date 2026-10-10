import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
import { pathToFileURL } from "node:url";

export const viewports = [
  { width: 320, height: 568 },
  { width: 390, height: 844 },
  { width: 844, height: 390 },
  { width: 1280, height: 800 },
];

export async function loadBrowser(modulePath) {
  const module = await import(modulePath ? pathToFileURL(resolve(modulePath)).href : "playwright");
  return (module.chromium || module.default.chromium).launch({ headless: true });
}

async function serve(root) {
  const server = createServer(async (request, response) => {
    try {
      let pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
      if (pathname.endsWith("/")) pathname += "index.html";
      const file = resolve(root, `.${pathname}`);
      if (!file.startsWith(resolve(root) + sep)) throw new Error("Outside fixture");
      const body = await readFile(file);
      response.setHeader("Content-Type", { ".html": "text/html", ".css": "text/css", ".js": "text/javascript" }[extname(file)] || "application/octet-stream");
      response.end(body);
    } catch {
      response.writeHead(404);
      response.end("Not found");
    }
  });
  await new Promise((done) => server.listen(0, "127.0.0.1", done));
  return { server, url: `http://127.0.0.1:${server.address().port}` };
}

function ensure(value, message) {
  if (!value) throw new Error(message);
}

async function reachable(locator) {
  await locator.scrollIntoViewIfNeeded();
  return locator.evaluate((element) => {
    const box = element.getBoundingClientRect();
    const x = Math.max(0, box.left) + Math.min(box.width / 2, innerWidth / 2);
    const y = box.top + box.height / 2;
    const hit = document.elementFromPoint(x, y);
    return box.width > 0 && box.height > 0 && box.left >= -1 && box.right <= innerWidth + 1
      && box.top >= -1 && box.bottom <= innerHeight + 1 && (hit === element || element.contains(hit));
  });
}

async function checkout(page) {
  const meta = await page.locator('meta[name="viewport"]').getAttribute("content");
  ensure(!/user-scalable\s*=\s*(no|0)|maximum-scale\s*=/i.test(meta), "Zoom restricted");
  const hints = {
    name: ["name", "text"], email: ["email", "email"], phone: ["tel", "tel"],
    card: ["cc-number", "text"], expiry: ["cc-exp", "text"], cvc: ["cc-csc", "text"], postcode: ["postal-code", "text"],
  };
  for (const [id, [autocomplete, type]] of Object.entries(hints)) {
    const input = page.locator(`#${id}`);
    ensure(await input.count() === 1, `Missing field ${id}`);
    const details = await input.evaluate((element) => ({
      labels: [...element.labels].map((label) => ({ text: label.textContent.trim(), visible: !!label.getBoundingClientRect().height && getComputedStyle(label).visibility !== "hidden" && getComputedStyle(label).display !== "none" })),
      autocomplete: element.autocomplete, type: element.type, inputmode: element.inputMode,
    }));
    ensure(details.labels.some((label) => label.text && label.visible), `No visible associated label: ${id}`);
    ensure(details.autocomplete.split(/\s+/).includes(autocomplete), `Missing autofill hint: ${id}`);
    // Text plus a suitable keyboard hint can preserve an existing validation contract.
    const hintedText = details.type === "text" && ((id === "email" && details.inputmode === "email") || (id === "phone" && details.inputmode === "tel"));
    ensure(details.type === type || hintedText || (id === "expiry" && details.type === "month"), `Wrong input type or keyboard hint: ${id}`);
    if (["card", "cvc"].includes(id)) ensure(details.inputmode === "numeric", `Missing numeric inputmode: ${id}`);
    await input.focus();
    ensure(await reachable(input), `Field unreachable or obscured: ${id}`);
  }
  const pay = page.getByRole("button", { name: /^pay$/i });
  ensure(await reachable(pay), "Payment action unreachable");
  ensure(await pay.evaluate((button) => button.form?.id === "checkout"), "Payment action lost form association");
  const box = await pay.boundingBox();
  ensure(box.width >= 44 && box.height >= 44, "Payment action smaller than mobile target");
  await page.locator("#postcode").fill("P7A 1A1");
  await pay.click({ trial: true });
}

async function focusRestored(page, opener) {
  await page.waitForFunction(() => document.activeElement?.id === "open-filters", null, { timeout: 2500 });
  ensure(await opener.evaluate((element) => element === document.activeElement), "Focus not restored");
}

async function navigation(page, url) {
  const opener = page.getByRole("button", { name: /^filters$/i });
  const apply = page.getByRole("button", { name: /^apply$/i });
  const sheet = page.locator("#filter-sheet");
  const nav = page.locator(".tabs");
  for (const link of await nav.getByRole("link").all()) {
    ensure(await link.evaluate((element) => !!(element.getAttribute("aria-label") || element.textContent.trim() || element.querySelector("svg title")?.textContent)), "Unnamed navigation link");
    ensure(await reachable(link), "Navigation link obscured");
    const box = await link.boundingBox();
    ensure(box.width >= 44 && box.height >= 44, "Navigation target too small");
  }
  for (const control of await page.locator(".delete").all()) {
    ensure(await control.isVisible() && await reachable(control), "Order action requires hover or is obscured");
  }
  ensure(await reachable(opener), "Filters action unreachable");
  await opener.focus();
  await page.keyboard.press("Enter");
  await sheet.waitFor({ state: "visible" });
  ensure(await page.getByRole("dialog", { name: /filters/i }).count() === 1, "Sheet lacks accessible dialog name");
  ensure(await sheet.evaluate((element) => element.contains(document.activeElement)), "Opening did not move focus into sheet");
  const modal = await sheet.evaluate((element) => element.matches(":modal") || element.getAttribute("aria-modal") === "true");
  ensure(modal, "Filter sheet lacks modal semantics");
  for (let index = 0; index < 8; index++) {
    await page.keyboard.press("Tab");
    // Native dialog Tab wrapping can briefly put focus on body; underlying controls must remain inert.
    ensure(await sheet.evaluate((element) => element.contains(document.activeElement) || (element.matches(":modal") && document.activeElement === document.body)), "Modal focus escaped");
  }
  ensure(await reachable(apply), "Apply action unreachable in sheet");
  const close = sheet.getByRole("button", { name: /close|cancel|dismiss/i }).first();
  ensure(await close.count() > 0 && await reachable(close), "Missing reachable explicit dismiss control");
  const paid = sheet.getByRole("checkbox", { name: /^paid$/i });
  await paid.check();
  ensure(await paid.isChecked(), "Filter cannot be changed");

  // Each path must consume the sheet entry, then let the next Back leave.
  for (const dismissal of ["close", "apply", "escape", "back"]) {
    await page.goto(`${url}/src/pages/about/index.html`);
    await page.goto(`${url}/src/pages/dashboard/index.html`);
    const baseState = await page.evaluate(() => JSON.stringify(history.state));
    await opener.click();
    await sheet.waitFor({ state: "visible" });
    if (dismissal === "close") await close.click();
    else if (dismissal === "apply") await apply.click();
    else if (dismissal === "escape") await page.keyboard.press("Escape");
    else await page.evaluate(() => history.back());
    await sheet.waitFor({ state: "hidden", timeout: 3000 });
    await focusRestored(page, opener);
    await page.waitForFunction((baseline) => JSON.stringify(history.state) === baseline, baseState, { timeout: 3000 });
    await page.evaluate(() => history.back());
    await page.waitForURL(/\/src\/pages\/about\/index.html$/, { timeout: 4000 });
  }
}

export async function runtimeChecks(root, kind, browser, screenshotDir) {
  const { server, url } = await serve(root);
  const results = [];
  try {
    for (const viewport of viewports) {
      const context = await browser.newContext({ viewport, hasTouch: viewport.width < 1000 });
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      try {
        await page.goto(`${url}/src/pages/${kind === "checkout" ? "checkout" : "dashboard"}/index.html`);
        ensure(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), "Horizontal page overflow");
        if (kind === "checkout") await checkout(page);
        else await navigation(page, url);
        ensure(errors.length === 0, `Browser errors: ${errors.join(", ")}`);
        results.push({ viewport, pass: true });
      } catch (error) {
        results.push({ viewport, pass: false, error: error.message });
      }
      if (screenshotDir) {
        if (kind === "navigation" && results.at(-1).pass) await page.goto(`${url}/src/pages/dashboard/index.html`);
        await page.screenshot({ path: `${screenshotDir}/${kind}-${viewport.width}x${viewport.height}.png`, fullPage: kind === "checkout" });
        if (kind === "navigation" && results.at(-1).pass) {
          await page.getByRole("button", { name: /^filters$/i }).click();
          await page.locator("#filter-sheet").waitFor({ state: "visible" });
          await page.screenshot({ path: `${screenshotDir}/navigation-sheet-${viewport.width}x${viewport.height}.png` });
        }
      }
      await context.close();
    }
  } finally {
    await new Promise((done) => server.close(done));
  }
  return results;
}

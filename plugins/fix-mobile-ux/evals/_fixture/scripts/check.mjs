// Minimal project check: every page and stylesheet referenced by a page exists.
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";

const pages = ["src/pages/checkout/index.html", "src/pages/dashboard/index.html", "src/pages/about/index.html"];
let failed = false;
for (const page of pages) {
  const html = readFileSync(page, "utf8");
  for (const [, href] of html.matchAll(/(?:href|src)="([^"#:]+\.(?:css|js))"/g)) {
    const target = join(dirname(page), href);
    if (!existsSync(target)) {
      console.error(`${page}: missing ${href}`);
      failed = true;
    }
  }
}
console.log(failed ? "check failed" : "check passed");
process.exit(failed ? 1 : 0);

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { representation } from "../lib/agent-http.ts";
import { HOME_MARKDOWN, LLMS, markdown } from "../lib/agent-content.ts";

test("Accept quality, specificity, defaults and exclusions", () => {
  for (const [accept, expected] of [
    [null, "html"], ["*/*", "html"], ["text/markdown", "markdown"],
    ["text/html", "html"], ["text/markdown;q=0", "none"],
    ["text/markdown;q=0, */*;q=1", "html"],
    ["text/html;q=0, text/*;q=1", "markdown"],
    ["text/markdown;q=0.8, text/html;q=0.9", "html"],
    ["text/markdown;q=1, text/html;q=0.5", "markdown"],
    ["text/html;q=0, text/markdown;q=0", "none"],
    ["application/json", "none"], ["TEXT/MARKDOWN; charset=utf-8", "markdown"],
  ]) assert.equal(representation(accept), expected, accept);
});
test("Markdown responses carry body, status and cache variation", async () => {
  for (const status of [200, 404]) {
    const r = markdown(HOME_MARKDOWN, status);
    assert.equal(r.status, status);
    assert.match(r.headers.get("content-type"), /^text\/markdown/);
    assert.equal(r.headers.get("vary"), "Accept");
    assert.ok((await r.text()).length > 500);
  }
});
test("Agent guidance points to Markdown and setup documentation", () => {
  assert.match(LLMS, /^# notchbud\n\n> /);
  assert.match(LLMS, /## When to use this/);
  assert.match(LLMS, /Accept: text\/markdown/);
  assert.doesNotMatch(LLMS + HOME_MARKDOWN, /api\/product|openapi\.json/);
  assert.match(HOME_MARKDOWN, /screenshots are sent to Groq/);
});
test("Proxy inventory covers every page and sitemap excludes auth pages", () => {
  const proxy = readFileSync("proxy.ts", "utf8");
  const sitemap = readFileSync("app/sitemap.xml", "utf8");
  const pages = readdirSync("app", { withFileTypes: true }).filter(d => d.isDirectory()).filter(d => {
    try { return readFileSync(`app/${d.name}/page.tsx`).length; } catch { return false; }
  }).map(d => "/" + d.name);
  for (const path of pages) {
    assert.ok(proxy.includes(JSON.stringify(path)), path);
    if (!["/sign-in", "/sign-up", "/sso-callback"].includes(path)) assert.ok(sitemap.includes(path + "</loc>"), path);
  }
  assert.match(sitemap, /xmlns="http:\/\/www.sitemaps.org\/schemas\/sitemap\/0.9"/);
  assert.equal((sitemap.match(/<lastmod>/g) || []).length, 7);
});

test("Discovery adds no API routes or handlers to the installer endpoint", () => {
  for (const path of ["app/api/product/route.ts", "app/api/[...path]/route.ts", "app/openapi.json/route.ts"]) {
    assert.equal(existsSync(path), false);
  }
  const download = readFileSync("app/api/download/route.ts", "utf8");
  assert.match(download, /redirect\(latest\?\.assetUrl \?\? RELEASES_URL\)/);
  assert.doesNotMatch(download, /methodNotAllowed|POST|PUT|PATCH|DELETE/);
});

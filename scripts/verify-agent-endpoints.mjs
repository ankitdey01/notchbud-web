// Run against a running local production server or a deployed preview:
// BASE_URL=https://preview.example npm run test:endpoints
import assert from "node:assert/strict";
const base = process.env.BASE_URL || "http://localhost:3000";
async function check(path, status, type, options = {}) {
  const r = await fetch(base + path, { redirect: "manual", signal: AbortSignal.timeout(15000), ...options });
  assert.equal(r.status, status, path);
  if (type) assert.ok(r.headers.get("content-type")?.includes(type), path + " content type");
  console.log(`${r.status} ${path} ${options.method || "GET"}`);
  return r;
}
const md = await check("/", 200, "text/markdown", { headers: { Accept: "text/markdown" } });
assert.match(md.headers.get("vary"), /\bAccept\b/i);
assert.ok((await md.text()).length > 500);
if (!process.env.MACHINE_ONLY) {
const html = await check("/", 200, "text/html", { headers: { Accept: "text/html" } });
assert.match(html.headers.get("vary"), /\bAccept\b/i);
const body = await html.text();
const text = body.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "").replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
assert.ok(text.length > 500);
assert.match(body, /<h1\b/);
assert.match(body, /notchbud — Windows AI desktop assistant/);
assert.match(body, /application\/ld\+json/);
console.log(`Homepage raw HTML text: ${text.length} characters; text/HTML ratio: ${(100 * text.length / body.length).toFixed(2)}%`);
}
await check("/", 406, "text/plain", { headers: { Accept: "application/json" } });
if (!process.env.MACHINE_ONLY) await check("/", 200, "text/html", { headers: { Accept: "text/markdown;q=0, text/html" } });
const missing = await check("/__agent-missing", 404, "text/markdown", { headers: { Accept: "text/markdown" } });
assert.match(await missing.text(), /\[.*\]\(\/llms.txt\)/);
if (!process.env.MACHINE_ONLY) await check("/__agent-missing", 404, "text/html", { headers: { Accept: "text/html" } });
const head = await check("/", 200, "text/markdown", { method: "HEAD", headers: { Accept: "text/markdown" } });
assert.equal(await head.text(), "");
for (const path of ["/llms.txt", "/index.md"]) {
  const r = await check(path, 200, "text/markdown");
  assert.ok((await r.text()).length > 100);
}
await check("/openapi.json", 404, "text/markdown", { headers: { Accept: "text/markdown" } });
if (!process.env.MACHINE_ONLY) {
  await check("/api/product", 404);
  const download = await check("/api/download", 307);
  assert.match(download.headers.get("location"), /^https:\/\/github.com\/ankitdey01\/notchbud\/releases/);
}
const xml = await (await check("/sitemap.xml", 200, "xml")).text();
const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
assert.equal(urls.length, 8);
for (const url of process.env.MACHINE_ONLY ? [] : urls) {
  const path = new URL(url).pathname;
  const r = await check(path, 200, "text/html");
  assert.ok((await r.text()).includes("<main"));
}
assert.match(await (await check("/robots.txt", 200, "text/plain")).text(), /Sitemap: https:\/\/notchbud.vercel.app\/sitemap.xml/);
console.log(process.env.MACHINE_ONLY ? "Machine endpoint checks passed; HTML/auth checks skipped." : "All endpoint checks passed.");

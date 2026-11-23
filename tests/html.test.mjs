import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
test("Production HTML exposes meaningful content without JS, metadata and sequential headings", { skip: !existsSync(".next/server/app/index.html") }, () => {
  for (const name of ["index", "docs", "download", "pricing", "support", "privacy", "tos"]) {
    const html = readFileSync(`.next/server/app/${name}.html`, "utf8");
    const text = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "").replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    assert.ok(text.length > 500, name);
    if (name === "index") {
      assert.ok(text.length / html.length >= .05, "homepage text ratio >= 5%");
      assert.match(html, /<noscript>/);
      assert.match(html, /notchbud — Windows AI desktop assistant/);
      const ld = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
      assert.equal(JSON.parse(ld[1]).name, "notchbud");
      const headings = [...html.matchAll(/<h([1-6])\b/g)].map(m => Number(m[1]));
      assert.equal(headings[0], 1);
      for (let i = 1; i < headings.length; i++) assert.ok(headings[i] <= headings[i - 1] + 1);
      console.log(`Homepage: ${text.length} text characters, ${(100 * text.length / html.length).toFixed(2)}% text/HTML`);
    }
  }
});

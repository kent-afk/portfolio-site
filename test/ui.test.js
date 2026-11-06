import test from "node:test";
import assert from "node:assert/strict";
import { esc, parseDeck, safeUrl } from "../js/ui.js";

test("esc escapes HTML metacharacters", () => {
  assert.equal(esc(`<>&"'`), "&lt;&gt;&amp;&quot;&#39;");
  assert.equal(esc(null), "");
});

test("safeUrl only allows intended targets", () => {
  assert.equal(safeUrl("javascript:alert(1)"), "");
  assert.equal(safeUrl("data:text/html,<script>"), "");
  assert.equal(safeUrl("data:image/png;base64,abc", { image: true }), "data:image/png;base64,abc");
  assert.equal(safeUrl("https://example.com/x"), "https://example.com/x");
  assert.equal(safeUrl("mailto:a@b.c"), "mailto:a@b.c");
  assert.equal(safeUrl("#/resume"), "#/resume");
  assert.equal(safeUrl("assets/x.webp"), "assets/x.webp");
  assert.equal(safeUrl("example.com/x"), "https://example.com/x");
});

test("parseDeck normalises entries and rejects bad shapes", () => {
  const deck = parseDeck(JSON.stringify({
    projects: [
      { title: " One ", tags: "a, b", private: 1 },
      { desc: "no title" },
    ],
  }));
  assert.equal(deck.length, 1);
  assert.equal(deck[0].title, "One");
  assert.deepEqual(deck[0].tags, ["a", "b"]);
  assert.equal(deck[0].private, true);
  assert.equal(parseDeck(JSON.stringify([{ title: "A" }]))[0].title, "A");
  assert.throws(() => parseDeck("{}"), /invalid shape/);
  assert.throws(() => parseDeck("not json"));
});

import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const readIndex = () => {
  assert.equal(existsSync("index.html"), true, "index.html should exist");
  return readFileSync("index.html", "utf8");
};

test("homepage contains the approved structure and responsive metadata", () => {
  const html = readIndex();

  assert.match(html, /<meta name="viewport" content="width=device-width, initial-scale=1">/);
  for (const id of ["intro", "featured", "experience", "research", "media"]) {
    assert.match(html, new RegExp(`id="${id}"`));
  }
  assert.match(html, /class="menu-toggle"/);
  assert.match(html, /aria-controls="primary-navigation"/);
});

test("homepage exposes the public identity and evidence links", () => {
  const html = readIndex();

  assert.match(html, /mailto:240376410@qq\.com/);
  assert.match(html, /https:\/\/github\.com\/YuehuaZhu/);
  assert.match(html, /https:\/\/scholar\.google\.com\/citations\?user=NW7Fu6EAAAAJ/);
  assert.match(html, /assets\/docs\/Yuehua_Zhu_CV_public\.pdf/);
  assert.match(html, /assets\/images\/profile\.jpg/);
  assert.match(html, /assets\/images\/favicon\.png/);
});

test("homepage contains the revised bilingual content", () => {
  const html = readIndex();

  assert.match(html, /data-en="Yuehua Zhu">朱跃华/);
  assert.match(html, /2026\.01 至今/);
  assert.match(html, /Since Jan 2026/);
  assert.match(html, /内容推荐与大模型算法/);
  assert.match(html, /Content Recommendation &amp; LLM Systems/);
  assert.doesNotMatch(html, /项目与奖项材料|Project &amp; Award Materials|高级算法专家|Senior Algorithm Expert/);
});

test("all new-tab links protect the opener", () => {
  const html = readIndex();
  const links = html.match(/<a\b[^>]*target="_blank"[^>]*>/g) ?? [];

  assert.ok(links.length > 0, "expected external links");
  for (const link of links) {
    assert.match(link, /rel="noopener noreferrer"/);
  }
});

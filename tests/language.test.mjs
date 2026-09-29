import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import test from "node:test";

test("language resolution follows query, storage, browser, fallback priority", async () => {
  const scriptPath = "assets/js/site.js";
  assert.equal(existsSync(scriptPath), true, `${scriptPath} should exist`);
  const { resolveLanguage } = await import(`../${scriptPath}`);

  assert.equal(resolveLanguage("?lang=en", "zh", "zh-CN"), "en");
  assert.equal(resolveLanguage("?lang=zh", "en", "en-US"), "zh");
  assert.equal(resolveLanguage("", "en", "zh-CN"), "en");
  assert.equal(resolveLanguage("", "", "en-GB"), "en");
  assert.equal(resolveLanguage("", "", "fr-FR"), "zh");
  assert.equal(resolveLanguage("?lang=invalid", "invalid", "en-US"), "en");
});

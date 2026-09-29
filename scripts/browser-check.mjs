import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";

const cdpPort = process.env.CDP_PORT || "9230";
const siteUrl = process.env.SITE_URL || "http://localhost:4173/";
const screenshotDir = process.env.SCREENSHOT_DIR || "screenshots";
const targets = await fetch(`http://localhost:${cdpPort}/json`).then((response) => response.json());
const target = targets.find((item) => item.type === "page" && item.url.startsWith(siteUrl));
assert.ok(target, `No Chrome page found for ${siteUrl}`);

const socket = new WebSocket(target.webSocketDebuggerUrl);
const pending = new Map();
let requestId = 0;

socket.addEventListener("message", ({ data }) => {
  const message = JSON.parse(data);
  if (!message.id || !pending.has(message.id)) return;
  const { resolve, reject } = pending.get(message.id);
  pending.delete(message.id);
  if (message.error) reject(new Error(message.error.message));
  else resolve(message.result);
});

await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});

const send = (method, params = {}) => new Promise((resolve, reject) => {
  const id = ++requestId;
  pending.set(id, { resolve, reject });
  socket.send(JSON.stringify({ id, method, params }));
});

const pause = (milliseconds = 250) => new Promise((resolve) => setTimeout(resolve, milliseconds));

const navigate = async (url) => {
  await send("Page.navigate", { url });
  await pause(400);
};

const evaluate = async (expression) => {
  const result = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
  return result.result.value;
};

const screenshot = async (name) => {
  const result = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
  await mkdir(screenshotDir, { recursive: true });
  await writeFile(`${screenshotDir}/${name}.png`, Buffer.from(result.data, "base64"));
};

await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
await navigate(`${siteUrl}?lang=zh`);
const desktopZh = await evaluate(`({
  lang: document.documentElement.lang,
  name: document.querySelector('.name-line h1').textContent.trim(),
  overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
  portrait: document.querySelector('.portrait').complete && document.querySelector('.portrait').naturalWidth > 0,
  quantPeriod: document.body.innerText.includes('2026.01 至今')
})`);
assert.deepEqual(desktopZh, { lang: "zh-CN", name: "朱跃华", overflow: false, portrait: true, quantPeriod: true });
await screenshot("desktop-zh");

const desktopEn = await evaluate(`(() => {
  document.querySelector('[data-lang="en"]').click();
  return {
    lang: document.documentElement.lang,
    name: document.querySelector('.name-line h1').textContent.trim(),
    role: [...document.querySelectorAll('.job-role')][2].textContent.trim(),
    quantPeriod: document.body.innerText.includes('Since Jan 2026'),
    urlLanguage: new URL(location.href).searchParams.get('lang')
  };
})()`);
assert.deepEqual(desktopEn, {
  lang: "en",
  name: "Yuehua Zhu",
  role: "Content Recommendation & LLM Systems",
  quantPeriod: true,
  urlLanguage: "en",
});
await screenshot("desktop-en");

await navigate(siteUrl);
const persistedLanguage = await evaluate(`document.documentElement.lang`);
assert.equal(persistedLanguage, "en");

await send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
await navigate(`${siteUrl}?lang=zh`);
await screenshot("mobile-zh");
const mobile = await evaluate(`(() => {
  const button = document.querySelector('.menu-toggle');
  button.click();
  return {
    width: innerWidth,
    overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    buttonVisible: getComputedStyle(button).display !== 'none',
    expanded: button.getAttribute('aria-expanded'),
    menuOpen: document.querySelector('.primary-navigation').classList.contains('is-open')
  };
})()`);
assert.deepEqual(mobile, { width: 390, overflow: false, buttonVisible: true, expanded: "true", menuOpen: true });
await screenshot("mobile-zh-menu");

const mobileNavigation = await evaluate(`(() => {
  document.querySelector('a[href="#research"]').click();
  return {
    hash: location.hash,
    expanded: document.querySelector('.menu-toggle').getAttribute('aria-expanded'),
    menuOpen: document.querySelector('.primary-navigation').classList.contains('is-open')
  };
})()`);
assert.deepEqual(mobileNavigation, { hash: "#research", expanded: "false", menuOpen: false });

socket.close();
console.log(JSON.stringify({ desktopZh, desktopEn, persistedLanguage, mobile, mobileNavigation }, null, 2));

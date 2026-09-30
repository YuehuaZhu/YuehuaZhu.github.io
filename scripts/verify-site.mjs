import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";

const requiredFiles = [
  "index.html",
  "assets/css/site.css",
  "assets/js/site.js",
  "assets/images/profile.jpg",
  "assets/images/favicon.png",
  "assets/docs/Yuehua_Zhu_CV_public.pdf",
  "robots.txt",
  "sitemap.xml",
  "googlea2cbce590c5ac459.html",
];

for (const file of requiredFiles) {
  assert.equal(existsSync(file), true, `${file} is missing`);
  assert.ok(statSync(file).size > 0, `${file} is empty`);
}

const html = readFileSync("index.html", "utf8");
for (const asset of requiredFiles.filter((file) => file.startsWith("assets/"))) {
  assert.match(html, new RegExp(asset.replaceAll(".", "\\.")), `${asset} is not referenced`);
}

const robots = readFileSync("robots.txt", "utf8");
const sitemap = readFileSync("sitemap.xml", "utf8");
const googleVerification = readFileSync("googlea2cbce590c5ac459.html", "utf8");
assert.match(robots, /Sitemap: https:\/\/yuehuazhu\.github\.io\/sitemap\.xml/);
assert.match(sitemap, /<loc>https:\/\/yuehuazhu\.github\.io\/<\/loc>/);
assert.equal(
  googleVerification,
  "google-site-verification: googlea2cbce590c5ac459.html",
  "Google Search Console verification file changed",
);

console.log(`Verified ${requiredFiles.length} production files.`);

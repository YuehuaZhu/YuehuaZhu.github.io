import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";

const requiredFiles = [
  "index.html",
  "assets/css/site.css",
  "assets/js/site.js",
  "assets/images/profile.jpg",
  "assets/docs/Yuehua_Zhu_CV_public.pdf",
];

for (const file of requiredFiles) {
  assert.equal(existsSync(file), true, `${file} is missing`);
  assert.ok(statSync(file).size > 0, `${file} is empty`);
}

const html = readFileSync("index.html", "utf8");
for (const asset of requiredFiles.slice(1)) {
  assert.match(html, new RegExp(asset.replaceAll(".", "\\.")), `${asset} is not referenced`);
}

console.log(`Verified ${requiredFiles.length} production files.`);

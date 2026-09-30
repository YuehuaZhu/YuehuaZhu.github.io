# SEO Discovery and Tencent Source Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add durable search-engine discovery signals for Yuehua Zhu's homepage and attach the verified Tencent AI Lab feature to the NeurIPS 2020 paper.

**Architecture:** Keep the existing static single-page architecture. Put page identity and Person schema in `index.html`, crawler discovery directives in root-level static files, and guard the contract with Node content tests and the existing production-file verifier.

**Tech Stack:** Static HTML, robots.txt, XML sitemap, JSON-LD, Node.js built-in test runner.

---

## File Map

- Modify `index.html`: canonical metadata, Person JSON-LD, and Tencent paper evidence link.
- Create `robots.txt`: crawler allow rule and sitemap declaration.
- Create `sitemap.xml`: canonical homepage URL and truthful last-modified date.
- Modify `tests/site-content.test.mjs`: content, JSON-LD, and bilingual-link regression coverage.
- Modify `scripts/verify-site.mjs`: require the two crawler files and validate their URL contract.

### Task 1: Define the SEO and Tencent-link contract

**Files:**
- Modify: `tests/site-content.test.mjs`
- Modify: `scripts/verify-site.mjs`

- [x] **Step 1: Add failing homepage assertions**

Add a test that requires a self-referencing canonical link, an `application/ld+json` script, and the Tencent URL with `data-en="Tencent Official Feature ↗"` and Chinese text `腾讯官方报道 ↗`.

- [x] **Step 2: Add failing JSON-LD assertions**

Extract the JSON-LD script body, parse it with `JSON.parse`, and assert:

```js
assert.equal(schema["@type"], "Person");
assert.equal(schema.name, "Yuehua Zhu");
assert.equal(schema.alternateName, "朱跃华");
assert.equal(schema.url, "https://yuehuazhu.github.io/");
assert.ok(schema.sameAs.includes("https://github.com/YuehuaZhu"));
assert.ok(schema.sameAs.some((url) => url.startsWith("https://scholar.google.com/citations?user=NW7Fu6EAAAAJ")));
```

- [x] **Step 3: Extend the production-file verifier**

Add `robots.txt` and `sitemap.xml` to `requiredFiles`, then assert both files reference `https://yuehuazhu.github.io/` and robots references the absolute sitemap URL.

- [x] **Step 4: Run the tests and verify RED**

Run: `npm test && npm run check`

Expected: failures for missing canonical, JSON-LD, Tencent link, `robots.txt`, and `sitemap.xml`.

### Task 2: Implement the static SEO signals and evidence link

**Files:**
- Modify: `index.html`
- Create: `robots.txt`
- Create: `sitemap.xml`

- [x] **Step 1: Add homepage identity metadata**

Add the following within `<head>`:

```html
<meta name="author" content="Yuehua Zhu / 朱跃华">
<link rel="canonical" href="https://yuehuazhu.github.io/">
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Yuehua Zhu",
  "alternateName": "朱跃华",
  "honorificSuffix": "Ph.D.",
  "url": "https://yuehuazhu.github.io/",
  "image": "https://yuehuazhu.github.io/assets/images/profile.jpg",
  "sameAs": [
    "https://github.com/YuehuaZhu",
    "https://scholar.google.com/citations?user=NW7Fu6EAAAAJ&hl=zh-CN"
  ]
}
</script>
```

- [x] **Step 2: Add the Tencent official feature link**

After the ProxyGML code link, add:

```html
<a class="i18n" data-en="Tencent Official Feature ↗" href="https://mp.weixin.qq.com/s/vSQpmkuG-E8HUKv7FLai6g" target="_blank" rel="noopener noreferrer">腾讯官方报道 ↗</a>
```

- [x] **Step 3: Create crawler discovery files**

Create `robots.txt`:

```text
User-agent: *
Allow: /

Sitemap: https://yuehuazhu.github.io/sitemap.xml
```

Create `sitemap.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://yuehuazhu.github.io/</loc>
    <lastmod>2026-09-30</lastmod>
  </url>
</urlset>
```

- [x] **Step 4: Run the tests and verify GREEN**

Run: `npm test && npm run check && git diff --check`

Expected: 0 failures, production verifier reports 8 files, and diff check exits 0.

### Task 3: Cross-browser validation and release

**Files:**
- No production files beyond Task 2.

- [x] **Step 1: Run the browser check**

Start the existing local HTTP server and Chrome CDP session, then run `npm run check:browser`.

Expected: desktop Chinese, desktop English, language persistence, mobile layout, and mobile navigation assertions all pass without overflow.

- [x] **Step 2: Run CI-equivalent checks under Node 22**

Run: `npx -y node@22 --test && npx -y node@22 scripts/verify-site.mjs`

Expected: all tests pass and 8 production files are verified.

- [x] **Step 3: Commit implementation and create a hotfix PR**

Commit the implementation with `feat: add search discovery signals and Tencent source`, push the branch, and create a PR describing SEO files, structured data, and the verified Tencent AI Lab link.

- [x] **Step 4: Merge with the team-collab workflow**

Rebase-merge the PR, update local `main`, evaluate `CLAUDE.md` and `PLAN.md`, and clean the remote and local hotfix branch.

- [x] **Step 5: Verify production**

Confirm GitHub Pages reports `built`, then verify:

```text
https://yuehuazhu.github.io/          -> 200 and canonical/JSON-LD/Tencent link present
https://yuehuazhu.github.io/robots.txt -> 200 and sitemap declared
https://yuehuazhu.github.io/sitemap.xml -> 200 and canonical homepage listed
```

Expected: all three URLs return 200. Search Console ownership and indexing request remain a user-account step after deployment.

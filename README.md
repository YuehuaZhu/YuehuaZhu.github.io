# Yuehua Zhu - Personal Homepage

Bilingual personal homepage for Yuehua Zhu, published at <https://yuehuazhu.github.io/>.

## Local preview

```bash
python3 -m http.server 8000
```

Open <http://localhost:8000/>.

## Verification

```bash
npm test
npm run check
```

The production site is intentionally build-free: GitHub Pages serves the committed HTML, CSS, JavaScript, image, and public CV directly from `main`.

## Content boundaries

Only the sanitized CV under `assets/docs/` and the optimized portrait under `assets/images/` are public. Source documents and original photos in the project root are ignored by Git.

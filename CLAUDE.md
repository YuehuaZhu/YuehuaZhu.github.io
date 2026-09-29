# githubResume - 朱跃华个人主页

## 项目定位

面向招聘方、产业合作方和学术同行的中英双语个人主页，使用纯静态文件部署到 GitHub Pages。
当前 `.superpowers/brainstorm/` 仅保存设计预览，不是正式站点源码。

## 开发规范

- 小修或 Hotfix（预计不超过 30 分钟）使用 `hotfix/short-description` 命名格式。
- 功能或重大 Bug 使用 `team-collab` skill，按 issue、分支、PR、合并流程推进。
- 未经老大明确要求，不执行 push、合并或 GitHub Pages 发布。
- 用户可见中英文文案必须同步修改；新增外链必须可访问并使用新窗口打开。
- 公开简历只使用 `assets/docs/Yuehua_Zhu_CV_public.pdf`，不得暴露原始电话或旧邮箱。

## 快速上手

```bash
python3 -m http.server 8000
open http://localhost:8000
npm test
npm run check
```

## 架构

```text
index.html
  |-- assets/css/site.css       页面布局与响应式样式
  |-- assets/js/site.js         语言切换、移动导航、活动栏目
  |-- assets/images/profile.jpg 公开头像
  `-- assets/docs/*.pdf         公开下载文件
```

正式站点不使用框架或构建工具。内容语义保留在 `index.html`，中英文通过 `data-zh` / `data-en` 共用同一 DOM；语言查询参数优先于本地偏好。

## 目录结构

```text
githubResume/
├── index.html
├── assets/
│   ├── css/site.css
│   ├── js/site.js
│   ├── images/profile.jpg
│   └── docs/Yuehua_Zhu_CV_public.pdf
├── scripts/verify-site.mjs
├── tests/                    Node.js content and language tests
├── .github/workflows/ci.yml  Pull request and main-branch checks
├── CLAUDE.md
├── PLAN.md
└── README.md
```

## 验证要求

- 桌面和 390px 移动视口均不得横向溢出或遮挡内容。
- 中文、英文可双向切换，刷新后保留语言，`?lang=zh` / `?lang=en` 可直接访问。
- 邮箱、GitHub、Google Scholar、简历下载及证据链接必须保留有效地址。
- 修改完成后运行 `npm test` 和 `npm run check`，并使用浏览器截图检查桌面与移动端。

## 排障

- 本地链接出现 404：必须从项目根目录启动 HTTP 服务，不要直接双击 `index.html`。
- 浏览器仍显示旧头像：确认 HTML 引用正式资源路径并强制刷新；不要复用临时预览目录中的资源。
- GitHub Pages 不更新：检查 Pages 来源分支、资源路径是否为相对路径，以及 Actions 状态。

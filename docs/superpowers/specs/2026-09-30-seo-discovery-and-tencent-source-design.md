# Google 收录信号与腾讯官方报道设计

## 目标

让 Google 更容易发现并理解 `https://yuehuazhu.github.io/` 是朱跃华的个人主页，同时在 NeurIPS 2020 论文条目中补充腾讯 AI Lab 官方报道。

## 方案选择

采用现有纯静态架构上的轻量增强，不迁移框架：

- 首页增加自引用 canonical、作者信息和 `schema.org/Person` JSON-LD。
- 根目录新增 `robots.txt`，允许公开页面抓取并声明 sitemap 地址。
- 根目录新增只包含首页 canonical URL 的 `sitemap.xml`，使用本次发布日期作为 `lastmod`。
- NeurIPS 2020 论文的链接组新增腾讯 AI Lab 官方报道；中文显示“腾讯官方报道”，英文显示 “Tencent Official Feature”。

未采用的方案：只依赖 Search Console 会缺少长期可维护的站点信号；迁移到 SEO 框架会增加不必要的构建和维护成本。

## 边界

- 不改变页面布局、视觉样式或现有中英文切换机制。
- 不声称技术 SEO 能保证姓名关键词排名；它只改善发现、归属和 canonical 信号。
- Google Search Console 的所有权验证与“请求编入索引”在部署后进行，验证令牌由站点所有者的 Google 账号提供。
- 腾讯文章经公开内容抓取核验，发布账号为“腾讯AI实验室”，正文明确介绍 ProxyGML 论文及 Spotlight 认可。

## 验证

- 内容测试断言 canonical、JSON-LD、腾讯链接及双语文案存在。
- JSON-LD 必须能被 `JSON.parse` 解析，并包含 `Person`、中英文姓名、主页 URL、GitHub 与 Google Scholar。
- 生产文件检查覆盖 `robots.txt` 与 `sitemap.xml`。
- 部署后确认首页、robots、sitemap 和腾讯链接均可访问。

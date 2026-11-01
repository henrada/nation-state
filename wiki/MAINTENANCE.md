# 维护国策百科

- 游戏的 `guideCatalog104()` 与办公桌指南提供正文；`tools/build-portal.cjs` 依照游戏实际脚本顺序，在隔离的十二种政体中读取词条，合并同义词与政体差异，不读取玩家存档。
- 修改游戏说明后，在仓库根目录运行 `node tools/build-portal.cjs`，一并提交 `wiki/data/`。入口索引只含标题与别名；正文分块读取，全文搜索会加载其余正文。数据修订标记由内容产生。
- 站点首页、分类捷径和近期收录在 `wiki/wiki.js`；版式在 `wiki/wiki.css`。用任意静态 HTTP 服务器打开 `wiki/` 即可预览。文章地址 `#entry/词条ID` 可直接分享，`#search` 为搜索入口。
- 原生 GitHub Wiki 是单独的 Wiki 仓库。`wiki-source/Home.md`、`_Sidebar.md`、`_Footer.md` 保存图文版入口的 Markdown 文稿；在原生 Wiki 编辑同名页面即可同步，保留其余历史页面和编辑记录。
- 插图复用游戏原有素材。`fonts/handbook.woff` 是 Noto Sans SC 的中文排版子集，按随附的 SIL Open Font License 发布，仅在本机没有相应字体时作为后备字体。

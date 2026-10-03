# Changelog

本文件只记录**本 fork** 的版本。上游 Project Manager 的 13.x 及更早版本历史见 [`CHANGELOG.original.md`](CHANGELOG.original.md)。

## [0.1.0] - 2026-10-03

基于上游 [Project Manager](https://github.com/alefragnani/vscode-project-manager) v13.1.1 的首次发布。

### 变更 (Breaking)

- 项目文件由 `projects.json` 改为 **`projects.jsonc`**. 原因: `.json` 后缀会让 VS Code 按严格 JSON 处理, 上游只在 `Edit Projects` 命令里临时切到 "JSON with Comments", 重载窗口或用其他方式打开时注释又会被标红报错. `.jsonc` 是 VS Code 内置映射的扩展名, 语言模式由文件名决定, 不依赖打开方式.
- 激活时会**自动把已有的 `projects.json` 改名为 `projects.jsonc`**, 只执行一次, 避免项目列表凭空消失.

### 修复

- **保存时不再丢失注释.** 上游 `save()` 用 `JSON.stringify` 整文件重写, 只要扩展保存一次 (新增/重命名/删除项目、改标签), 你写在文件里的注释、空行、缩进全部被静默抹掉. 现在改为读取磁盘文件后用 `jsonc-parser` 局部编辑, 只改动真正变化的部分, 注释/空行/缩进/换行符全部保留.
  - 内存项目与磁盘项目用最长公共子序列对齐, 因此"重命名"和"改路径"被当作同一项目的属性变化, 挂在项目上的注释不会掉.
  - 删除元素不用 `modify` (它会把该元素到下个元素之间的注释一起删掉), 改为手写偏移量, 只删除该条目和相邻的逗号, 两侧注释都保留.
  - 写入前会回读校验: 重新解析结果并与内存中的项目列表比对, 不一致就退回整文件重写. 那种情况下注释会丢, 但**绝不会写入错误的项目列表**.
- **在 Code 里保存文件后立即重新加载.** 上游用 `fs.watchFile` **轮询**, 约 5 秒一次 (实测 5006 ms). 保存文件后在这个窗口内执行命令, 扩展会按保存前的列表写盘, 把你刚手工加的项目丢掉. 现在注册 `onDidSaveTextDocument`, 在 Code 里的保存立刻生效; 轮询监听保留, 用于接住其他编辑器/脚本/同步工具的改动.
- 无效的项目文件现在会报告**出错的行号和列号**, 而不是一句笼统的 JSON 解析错误.

### 新增

- Side Bar 悬停按钮: **Open in New Window**、**Open with VS Code**、**Open with Cursor**. 后两个把项目文件夹交给另一个编辑器进程打开.
- 新增设置 `projectManager.openWith.vsCodeCommand` 和 `projectManager.openWith.cursorCommand`, 留空则自动探测 `code` / `cursor`.
- 启动外部编辑器时不经过 shell, 因此项目路径不可能被当作 shell 命令解释. Windows 上按 `code.cmd` 的方式调用 (`Code.exe <cli.js> -n <folder>` 且 `ELECTRON_RUN_AS_NODE=1`); 直接调用 `Code.exe <folder>` 会让它以纯 Node 运行并把文件夹当脚本加载, 静默失败.

### 变更 (元数据)

- 扩展标识改为 `m0m0.m0m0-33-project-manager` (`name` / `displayName` 为 `m0m0-33-project-manager`, `publisher` 为 `m0m0`), 版本号从 `0.1.0` 重新开始.
- `homepage` / `repository` / `bugs` 指向本 fork; 移除上游的 `sponsor` 条目.
- 清单、Help and Feedback 视图、What's New provider、Remote 相关 walkthrough 片段以及测试中的扩展 ID 同步更新.

### 保持不变的

- 命令 ID、设置 ID (`projectManager.*`) 和视图 ID **刻意保持不变**, 所以本 fork 可以直接替换原版. 因此**不要同时安装原版和本 fork**——它们会争抢同一批命令和设置.
- 源码文件里的版权声明保持原样 (GPLv3 要求), 本 fork 的修改内容与日期见 README.

### 变更 (品牌, 为公开上架做准备)

本 fork 会公开在 VS Code 插件市场上 (目的仅是在自己的多台机器之间同步), 因此**必须与原版在视觉上一眼可辨**, 否则既容易被判定为重复上架, 也可能干扰原作者. 为此:

- **用户可见的品牌名改为 `GF33 Project Manager`**: 活动栏标题、设置区标题、13 个命令标题、walkthrough 标题、欢迎页文案等共 101 处. 这样做是因为原版在 UI 里就显示为 "Project Manager", 装上去之后与官方版本无法区分. **命令 ID 和设置 ID 未改**, 所以你已有的设置不需要迁移.
- **更换全部图标资源**: 市场图标改为 `GF33` 徽标 (取代原作者的蓝色文件夹图标), What's New 页头 logo 同步更换, 活动栏图标换成"圆角方框 + 列表"图形. 原先的市场图标和 logo 都是原作者的原创美术作品, 沿用会有版权与"看起来是同一个插件"的双重问题.
- **修复 What's New 页头 logo 路径**: 该路径由扩展名动态拼接 (`images/vscode-<name>-logo-readme.png`), 改名后原文件已找不到, 一并修正.
- **移除原作者的支持/捐赠入口**: `Support Project Manager` 命令 (GitHub Sponsors + PayPal)、Help and Feedback 里的 Support 按钮、What's New 页面里的赞助与社交链接. 一个 fork 里放别人的捐赠按钮并不合适.
- **移除原作者的宣传素材**: walkthrough 里的 4 张原版 UI 截图/GIF (32 个 markdown 文件中的引用), 以及 48.7 MB 的宣传 GIF 和原版 gh-pages 站点文件.
- **欢迎页里的文档链接**从原作者的仓库改为本仓库.
- **精简 `keywords`**, 降低与原版在搜索里的重合: 去掉 `git` / `mercurial` / `svn` / `switch` / `manage` / `multi-root ready` 等, 只保留描述性词与 fork 标识.
- **README 顶部**增加醒目声明: 这是个人自用 fork, 一般用户请安装原版.

### 变更 (仅保留英文)

删除上游的 8 种翻译, 共 **58 个文件**:

- `package.nls.{az,cs,fr,pt-br,ru,uk,zh-cn,zh-tw}.json` (8 个)
- `l10n/bundle.l10n.{az,cs,fr,pt-br,ru,uk,zh-cn,zh-tw}.json` (8 个)
- `walkthrough/*.nls.{az,fr,pt-br,ru,uk,zh-cn,zh-tw}.md` (42 个)

**必须保留的英文 base 文件** (删掉会直接坏掉):

- `package.nls.json` —— `package.json` 里的 `%key%` 占位符靠它解析, 删掉后所有命令标题和设置说明会显示成原始的 `%projectManager.commands.saveProject.title%`.
- `l10n/bundle.l10n.json` —— 运行时消息 (`l10n.t`) 的英文基准表.
- `walkthrough/` 下 6 个英文 `.md` —— `package.json` 的 walkthrough 步骤直接引用它们 (本地化版本只是按约定附加的旁支, VS Code 找不到就用 base).

非英语界面下现在会回退显示英文.

### 变更 (资源目录合并)

原先资源分散在三个目录: `icon/` (本 fork 新增的按钮图标)、`images/` (What's New 页头 logo)、`docs/images/` (市场图标、活动栏图标、运行时 tree 图标). 现全部合并到 **`images/`**, `icon/` 与 `docs/` 已删除.

- `src/utils/icons.ts` 里的前缀由 `"docs/images/ico-"` 改为 `"images/ico-"`, **18 个运行时 tree 图标全部随之迁移**.
- 市场图标路径改为 `images/icon.png` (与 m0m0-32 的约定一致).
- `images/vscode-<name>-logo-readme.png` 必须留在 `images/` 下, 因为 vendored 的 `vscode-whats-new` 库里路径是写死的 (`Manager.ts`).
- 顺带删掉 3 个**无任何代码引用**的残留资源 `ico_file_code.png` / `ico_git_branch.png` / `ico_svn.png` (旧版本遗留; `getIconDetailsFromProjectPath` 返回的是 codicon 名, 不是文件路径).
- 清理 `.vscodeignore` 中已失效的条目 (`docs/index.html` 等 gh-pages 项、`AGENTS.md`、`.devcontainer/`).

> 迁移后逐项核对: bundle 里请求的是 `images/ico-*` (已无 `docs/images/ico-*`), 清单引用的 6 个文件全部存在, 18 个运行时图标一个不少.

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

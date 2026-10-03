# m0m0-33-project-manager

> **这是一个修改版本.** `m0m0-33-project-manager` 是 Alessandro Fragnani 的
> [Project Manager](https://github.com/alefragnani/vscode-project-manager) v13.1.1 的 fork,
> 由 **m0m0** 于 **2026-10-03** 修改.
> 改动清单见 [与原版的差异](#与原版的差异).
> 本 fork 与原版使用相同的 **GPLv3** 协议发布 (见 [协议](#协议)).

在收藏、Git、Mercurial、SVN 和 VS Code 文件夹之间快速切换项目, 提供侧边栏、状态栏和快速选择命令.

本 fork 里的每一项改动, 都是因为原版存在一个让它在日常使用中"没法用"的行为. 它们修的是具体缺陷, 不是审美偏好.

## 与原版的差异

### 1. 项目文件现在是真正的 JSONC 文件: `projects.jsonc`

**改了什么.** 文件原本叫 `projects.json`, 现在叫 `projects.jsonc`. `src/core/constants.ts` 里的 `PROJECTS_FILE` 指向新名字, 并且激活时会**一次性**把已有的 `projects.json` 改名, 避免老的项目列表被落在后面.

**为什么必须改.** 这个文件本来就是要支持注释的, 但 `.json` 后缀让 VS Code 按严格 JSON 处理它. 原版的做法是在 `Edit Projects` 命令里临时把语言模式切成 _JSON with Comments_ —— 但这个补救经不起现实考验:

- **重载窗口之后**, VS Code 会恢复之前打开的编辑器, 并根据**文件名**重新推导语言模式, 于是文件又变回普通 JSON, **每一行注释都被标红报错**;
- 从其他任何入口打开这个文件 (资源管理器、`Ctrl+P`、别的工具), 根本不会经过那个命令.

`.jsonc` 是 VS Code **内置映射**的扩展名, 语言模式由文件名决定, 不再取决于"是谁打开的". 顺带地, `editProjects()` 里那句 `setTextDocumentLanguage` 变成了死代码, 已删除.

### 2. 扩展保存文件时不再丢失注释

**改了什么.** `ProjectStorage.save()` 不再用 `JSON.stringify` 整文件重写, 而是重新读取磁盘上的文件, 用 `jsonc-parser` (`modify` / `applyEdits`) 做**局部编辑**, 只改动真正发生变化的部分.

**为什么必须改.** 这是**静默的数据丢失**. 原版的 `save()` 是:

```ts
fs.writeFileSync(this.filename, JSON.stringify(this.projects, null, "\t"));
```

只要扩展保存一次 —— 新增、重命名、删除项目或修改标签都会触发 —— 你写在文件里的注释、空行和自定义格式就被**全部抹掉**, 而且没有任何提示. 这比"根本不支持注释"更糟.

实现要点:

- **对齐.** 磁盘上的项目和内存中的项目用最长公共子序列配对, 因此"重命名"(路径相同)和"改路径"(名字相同)都被视为**同一项目的属性变化**, 而不是"删一个再加一个". 挂在项目上的注释两种情况下都能保住.
- **删除.** 删除元素用**手写偏移量**, 不用 `modify`. 因为 `modify` 的删除范围是从该元素一直延伸到下一个元素, 会把两个项目之间的注释一起删掉. 本 fork 只删除该条目和与它相邻的那个逗号, 两侧注释都保留.
- **安全网.** 写入前会把结果**重新解析**一遍, 与内存中的项目列表比对; 不一致就退回整文件重写. 这种情况下注释会丢, 但**绝不会写入一个错误的项目列表**.

### 3. 在 Code 里保存文件后立即重新加载

**改了什么.** 除了原有的文件监听, 新增了 `vscode.workspace.onDidSaveTextDocument` 处理器, 文件一保存就重新加载.

**为什么必须改.** 原版用 `fs.watchFile` 监听文件, 而它是**轮询**的, 约 **5 秒**一次. 保存文件后在这个窗口内执行命令, 扩展会按**保存之前**的列表写盘, 把你刚手工加进去的项目丢掉. 在本机实测原版监听器的延迟:

```
fs.watchFile fired after 5006 ms
```

轮询监听**保留**, 用来接住其他编辑器、脚本或同步工具造成的改动 —— 那几秒延迟无所谓. 而在 Code 里的保存现在**立刻**生效, 抢在任何命令之前.

### 4. "用 VS Code / Cursor 打开"按钮

**改了什么.** 在侧边栏把鼠标悬停到项目上, 现在显示三个按钮: _Open in New Window_(原有, 未改)、_Open with VS Code_、_Open with Cursor_. 后两个会把项目文件夹交给另一个编辑器进程打开. 两个设置 `projectManager.openWith.vsCodeCommand` 和 `projectManager.openWith.cursorCommand` 可以覆盖自动探测到的可执行文件.

**为什么必须改.** 想在两个编辑器之间移动项目, 只能离开编辑器去文件管理器里找. 手上已经有项目列表, 却没有办法用它把项目在第二个编辑器里打开.

有一个实现细节值得记下来, 因为**最直觉的写法是错的**. Windows 上 `code.cmd` **并不是**简单转发给 `Code.exe`:

```cmd
set ELECTRON_RUN_AS_NODE=1
"%~dp0..\Code.exe" "%~dp0..\07f806f999\resources\app\out\cli.js" %*
```

命令行处理逻辑在一个单独的 `cli.js` 里, 必须让应用程序去运行它. 如果改成直接启动 `Code.exe <文件夹>`, 它会把自己当成普通 Node, 把**文件夹当成脚本**去加载, 报 `Cannot find module` 然后退出 —— 而错误写到 stderr, 没人读, 所以**按钮看起来毫无反应**. 更麻烦的是扩展宿主自身就跑在 `ELECTRON_RUN_AS_NODE` 下, 子进程会继承这个变量, 这个陷阱永远处于激活状态. 因此本 fork 复刻了包装脚本的调用方式 (`Code.exe <cli.js> -n <folder>` 且 `ELECTRON_RUN_AS_NODE=1`), 并在"扁平"和"以提交号命名的子目录"两种安装布局里定位 `cli.js`. 全程**不经过 shell**, 所以项目路径不可能被当作 shell 命令解释.

### 5. 元数据与标识

- `name` / `displayName`: `projectManager` → `m0m0-33-project-manager`
- `publisher`: `alefragnani` → `m0m0`
- `version`: 从 `0.1.0` 重新开始, 与本 fork 无关的上游 `13.x` 编号不再沿用
- `homepage` / `repository` / `bugs` 指向本 fork 的仓库; 移除上游的 `sponsor` 条目
- 清单、Help and Feedback 视图、What's New provider、Remote 相关 walkthrough 片段以及测试中的扩展 ID 已更新为 `m0m0.m0m0-33-project-manager`

### 6. 一处小修复

无效的项目文件现在会报告**出错的行号和列号**, 而不是一句笼统的 JSON 解析错误.

## 兼容性

- 命令 ID、设置 ID (`projectManager.*`) 和视图 ID **刻意保持不变**, 因此本 fork 可以直接替换原版. 由此带来几点:
  - **不要同时安装原版和本 fork** —— 它们会争抢同一批命令和设置;
  - 你已有的设置继续有效, `projectsLocation` 仍指向同一个目录;
  - 已有的 `projects.json` 会在激活时被改名成 `projects.jsonc`, 只执行一次.
- 因为 publisher 变了, 默认存储目录会从
  `<globalStorage>/alefragnani.project-manager/` 变为 `<globalStorage>/m0m0.m0m0-33-project-manager/`.
  如果你没有设置 `projectManager.projectsLocation`, 请把 `projects.jsonc` 移过去, 或者设置 `projectsLocation`.

## 功能

- **收藏项目**: 保存常用项目, 支持标签和 profile
- **自动探测**: Git、Mercurial、SVN 和 VS Code 文件夹, 基础目录/忽略目录/递归深度均可配置
- **侧边栏**: 每种项目类型一个视图, 支持列表/标签视图切换、排序和标签筛选
- **状态栏**: 显示当前项目并可在项目间切换
- **项目标签**: 打标签、按标签筛选、标签分组可折叠
- **远程支持**: SSH、WSL、容器和 Codespaces, 包括存储在远端的项目
- **支持多根工作区**, 兼容虚拟工作区和 Workspace Trust
- **本地化**: en、az、cs、fr、pt-br、ru、uk、zh-cn、zh-tw

## 命令

| 命令 | 说明 |
| --- | --- |
| `Project Manager: Save Project` | 把当前文件夹保存为项目 |
| `Project Manager: List Projects to Open` | 列出已保存/已探测的项目并打开 |
| `Project Manager: List Projects to Open in New Window` | 同上, 在新窗口中打开 |
| `Project Manager: Edit Projects` | 编辑 `projects.jsonc` |
| `Project Manager: Refresh Projects` | 刷新自动探测的项目 |
| `Project Manager: Add Project to Workspace` | 把项目加入当前工作区 |
| `Project Manager: What's New` | 显示更新说明 |

侧边栏悬停按钮: **Open in New Window**、**Open with VS Code**、**Open with Cursor**.

## 本 fork 新增的设置

| 设置 | 默认值 | 说明 |
| --- | --- | --- |
| `projectManager.openWith.vsCodeCommand` | `""` | **用 VS Code 打开** 使用的命令或完整路径. 留空则自动探测 `code` |
| `projectManager.openWith.cursorCommand` | `""` | **用 Cursor 打开** 使用的命令或完整路径. 留空则自动探测 `cursor` |

## 构建

```bash
npm install
npm run vscode:prepublish     # 生产模式 webpack 构建 -> dist/extension.js
npx @vscode/vsce package      # -> m0m0-33-project-manager-0.1.0.vsix
```

`npm run compile` 只做类型检查并输出到 `out/`; `npm test` 会在真实的 VS Code 实例里跑测试套件 (首次运行会下载 VS Code).

## 归属

基于 [Project Manager](https://github.com/alefragnani/vscode-project-manager) v13.1.1, 版权归 Alessandro Fragnani 所有.

本 fork **与原作者无关**, 未获得其背书或支持. 本 fork 的问题请提到本仓库, 不要提到上游. 原项目的更新历史保留在 [`CHANGELOG.original.md`](CHANGELOG.original.md).

## 协议

**GPLv3** —— 见 [`LICENSE.md`](LICENSE.md).

本作品是 GPLv3 作品的修改版本, 并沿用同一协议发布. 源码文件中的版权声明属于原作者, 未作改动; 上述修改由 m0m0 于 2026-10-03 完成. 对应的源码在本仓库中提供.

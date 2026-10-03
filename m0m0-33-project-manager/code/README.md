# m0m0-33-project-manager

> **This is a modified version.** `m0m0-33-project-manager` is a fork of
> [Project Manager](https://github.com/alefragnani/vscode-project-manager) v13.1.1 by Alessandro Fragnani,
> modified by **m0m0** on **2026-10-03**.
> The changes are listed under [Key Modifications from Original](#key-modifications-from-original).
> It is distributed under the same license as the original, **GPLv3** (see [License](#license)).

Easily switch between projects: favorites, Git, Mercurial, SVN and VS Code folders, from a dedicated Side Bar, the status bar and quick pick commands.

Every change in this fork exists because the original has a behaviour that makes it unusable in daily work. They fix concrete defects, not matters of taste.

## Key Modifications from Original

### 1. The projects file is now a real JSONC file: `projects.jsonc`

**What changed.** The file was `projects.json` and is now `projects.jsonc`. `PROJECTS_FILE` in `src/core/constants.ts` points at the new name, and a one-time migration renames an existing `projects.json` on activation, so an existing project list is not left behind.

**Why it was necessary.** The file is meant to accept comments, but the `.json` extension made VS Code treat it as strict JSON. The original worked around this by switching the language mode to _JSON with Comments_ — but only inside the `Edit Projects` command. That workaround does not survive reality:

- after a window reload, VS Code restores the open editor and re-derives the language mode from the file name, so the file opens as plain JSON again and **every comment is flagged as an error**;
- opening the file any other way (Explorer, `Ctrl+P`, another tool) never went through that command at all.

`.jsonc` is a real extension that VS Code maps to _JSON with Comments_ by itself, so the correct language mode no longer depends on which command opened the file. This also turned the `setTextDocumentLanguage` call in `editProjects()` into dead code, which was removed.

### 2. Comments are kept when the extension saves the file

**What changed.** `ProjectStorage.save()` no longer rewrites the file with `JSON.stringify`. It re-reads the file from disk and edits it in place with `jsonc-parser` (`modify` / `applyEdits`), touching only the projects and properties that actually changed.

**Why it was necessary.** This was silent data loss. The original `save()` was:

```ts
fs.writeFileSync(this.filename, JSON.stringify(this.projects, null, "\t"));
```

Any comment, blank line or custom formatting was destroyed the next time the extension saved — which happens whenever you save, rename, delete or tag a project. A comment could disappear without a single warning, which is worse than not supporting comments at all.

Implementation notes:

- **Alignment.** The projects on disk are paired with the projects held in memory with a longest-common-subsequence pass, so a rename (same path) and a path update (same name) count as a change to an existing entry, not as a removal plus an addition. Comments attached to a project survive both.
- **Removal.** Element removal uses hand-written offsets, not `modify`. `modify` removes the whole span up to the next element, which takes the comments written between two projects with it. The fork deletes only the entry and the comma that separates it, so the comments on both sides are kept.
- **Safety net.** Before writing, the result is re-parsed and compared against the projects held in memory. If it does not match, the file is written from scratch instead. Comments are lost in that case, but a wrong project list is never written.

### 3. The file is reloaded the moment it is saved from within Code

**What changed.** A `vscode.workspace.onDidSaveTextDocument` handler reloads the projects file as soon as it is saved, in addition to the existing file watcher.

**Why it was necessary.** The original watched the file with `fs.watchFile`, which **polls**, every ~5 seconds. Saving the file and then running a command inside that window made the extension write the list as it was *before* the save, dropping the projects that had just been added by hand. A measured run of the original watcher on this machine:

```
fs.watchFile fired after 5006 ms
```

The polling watcher is kept for changes made by other editors, scripts or sync tools, where a few seconds of delay is harmless. Saves made in Code are now picked up immediately, before any command can be run.

### 4. Open with VS Code / Open with Cursor buttons

**What changed.** Hovering a project in the Side Bar now shows three buttons: _Open in New Window_ (unchanged), _Open with VS Code_ and _Open with Cursor_. The last two start the other editor as a separate process and hand it the project folder. Two settings, `projectManager.openWith.vsCodeCommand` and `projectManager.openWith.cursorCommand`, override the detected executable.

**Why it was necessary.** Moving a project between editors meant leaving the editor and going through a file manager. There was no way to open a project in a second editor from the list you already have.

One implementation detail is worth recording, because the obvious implementation does not work. On Windows `code.cmd` is **not** a plain forwarder to `Code.exe`:

```cmd
set ELECTRON_RUN_AS_NODE=1
"%~dp0..\Code.exe" "%~dp0..\07f806f999\resources\app\out\cli.js" %*
```

The command line handling lives in a separate `cli.js` that the application has to be asked to run. Starting `Code.exe <folder>` instead makes it behave as plain Node and try to load the folder as a script, failing with `Cannot find module` on a stderr that nothing reads — so the button appears to do nothing at all. The extension host itself runs with `ELECTRON_RUN_AS_NODE` set, which a spawned process inherits, so this trap is always armed. The fork therefore replicates the wrapper's invocation (`Code.exe <cli.js> -n <folder>` with `ELECTRON_RUN_AS_NODE=1`), locating `cli.js` in either the flat or the commit-named installation layout. No shell is used, so a project path can never be interpreted as a shell command.

### 5. Metadata and identity

- `name` / `displayName`: `projectManager` → `m0m0-33-project-manager`
- `publisher`: `alefragnani` → `m0m0`
- `version`: restarted at `0.1.0`; this fork's versioning is independent of the upstream `13.x` line
- `homepage`, `repository`, `bugs` point at this fork's repository; the upstream `sponsor` entry was removed
- the extension ID references in the manifest, the Help and Feedback view, the What's New provider, the Remote walkthrough snippets and the tests were updated to `m0m0.m0m0-33-project-manager`

### 6. Smaller fix

Invalid files are now reported with the **line and column** of the problem, instead of a bare JSON parse error.

## Compatibility

- Command IDs, setting IDs (`projectManager.*`) and view IDs are **deliberately unchanged**, so this fork is a drop-in replacement for the original. Consequences:
  - do not install the original and this fork at the same time — they claim the same commands and settings;
  - your existing settings keep working, and `projectsLocation` keeps pointing at the same folder;
  - an existing `projects.json` is renamed to `projects.jsonc` once, on activation.
- Because the publisher changed, the default storage folder moves from
  `<globalStorage>/alefragnani.project-manager/` to `<globalStorage>/m0m0.m0m0-33-project-manager/`.
  If you have not set `projectManager.projectsLocation`, move your `projects.jsonc` there, or set `projectsLocation`.

## Features

- **Favorite Projects**: save the projects you use most, with tags and profiles
- **Auto-detection**: Git, Mercurial, SVN and VS Code folders, with configurable base folders, ignored folders and recursion depth
- **Side Bar**: one view per project kind, with view-as-list/tags, sorting and tag filtering
- **Status Bar**: shows the current project and switches between projects
- **Project Tags**: tag projects, filter by tag, collapsible tag groups
- **Remote support**: SSH, WSL, Containers and Codespaces, including projects stored on the remote
- **Multi-root ready**, virtual workspace and workspace trust aware
- **English only**: the upstream translations (az, cs, fr, pt-br, ru, uk, zh-cn, zh-tw) were removed, since this fork is for personal use

## Commands

| Command | Description |
| --- | --- |
| `Project Manager: Save Project` | Save the current folder as a project |
| `Project Manager: List Projects to Open` | Pick a saved/detected project and open it |
| `Project Manager: List Projects to Open in New Window` | Same, in a new window |
| `Project Manager: Edit Projects` | Edit `projects.jsonc` |
| `Project Manager: Refresh Projects` | Refresh the auto-detected projects |
| `Project Manager: Add Project to Workspace` | Add a project to the current workspace |
| `Project Manager: What's New` | Show the release notes |

Side Bar hover buttons: **Open in New Window**, **Open with VS Code**, **Open with Cursor**.

## Settings added by this fork

| Setting | Default | Description |
| --- | --- | --- |
| `projectManager.openWith.vsCodeCommand` | `""` | Command or full path used by **Open with VS Code**. Empty detects the `code` command |
| `projectManager.openWith.cursorCommand` | `""` | Command or full path used by **Open with Cursor**. Empty detects the `cursor` command |

## Building

```bash
npm install
npm run vscode:prepublish     # production webpack build -> dist/extension.js
npx @vscode/vsce package      # -> m0m0-33-project-manager-0.1.0.vsix
```

`npm run compile` type-checks into `out/`; `npm test` runs the suite in a real VS Code instance, which is downloaded on first run.

## Attribution

Based on [Project Manager](https://github.com/alefragnani/vscode-project-manager) v13.1.1, Copyright (c) Alessandro Fragnani.

This fork is **not** affiliated with, endorsed by, or supported by the original author. Report problems with this fork here, not upstream. The original project's changelog is preserved in [`CHANGELOG.original.md`](CHANGELOG.original.md).

## License

**GPLv3** — see [`LICENSE.md`](LICENSE.md).

This is a modified version of a GPLv3 work, distributed under the same license. The copyright notices in the source files are those of the original author and have been left untouched; the modifications listed above were made by m0m0 on 2026-10-03. The corresponding source is available in this repository.

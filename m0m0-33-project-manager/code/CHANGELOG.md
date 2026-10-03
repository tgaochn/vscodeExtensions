# Changelog

This file lists the versions of **this fork** only. The history of the upstream Project Manager 13.x and earlier is kept in [`CHANGELOG.original.md`](CHANGELOG.original.md).

## [0.1.0] - 2026-10-03

First release, based on upstream [Project Manager](https://github.com/alefragnani/vscode-project-manager) v13.1.1.

### Changed (breaking)

- The projects file changed from `projects.json` to **`projects.jsonc`**. The `.json` extension made VS Code treat it as strict JSON; the upstream workaround switched the language mode to "JSON with Comments" only inside the `Edit Projects` command, so after a window reload, or when the file was opened any other way, every comment was flagged as an error. `.jsonc` is an extension VS Code maps by itself, which makes the language mode depend on the file name instead of on how the file was opened.
- On activation, an existing `projects.json` is **renamed once** to `projects.jsonc`, so an existing project list is not left behind.

### Fixed

- **Comments are no longer lost when the file is saved.** The upstream `save()` rewrote the whole file with `JSON.stringify`, so any comment, blank line or indentation the user had written was silently erased the next time the extension saved — which happens whenever a project is saved, renamed, deleted or tagged. The file is now re-read from disk and edited in place with `jsonc-parser`, touching only what actually changed; comments, blank lines, indentation and line endings are all preserved.
  - Projects on disk are paired with the projects held in memory using a longest common subsequence, so a rename (same path) and a path update (same name) count as a property change on one entry rather than a removal plus an addition. Comments attached to a project survive both.
  - Element removal does not use `modify`, which removes the whole span up to the next element and would take the comments written between two projects with it. It uses hand-written offsets that delete only the entry and its adjacent comma, keeping the comments on both sides.
  - Before writing, the result is re-parsed and compared against the projects held in memory. If it does not match, the file is written from scratch instead. Comments are lost in that case, but a wrong project list is never written.
- **The file is reloaded as soon as it is saved from within Code.** Upstream watched it with `fs.watchFile`, which **polls** about every 5 seconds (5006 ms measured). Saving the file and then running a command inside that window made the extension write the list as it was before the save, dropping the projects that had just been added by hand. A `onDidSaveTextDocument` handler now reloads immediately for saves made in Code; the polling watcher is kept for changes made by other editors, scripts or sync tools.
- An invalid projects file is now reported with the **line and column** of the problem, instead of a bare JSON parse error.

### Added

- Side Bar hover buttons: **Open in New Window**, **Open with VS Code** and **Open with Cursor**. The last two hand the project folder to another editor process.
- Settings `projectManager.openWith.vsCodeCommand` and `projectManager.openWith.cursorCommand`; empty detects `code` / `cursor` automatically.
- The external editor is started without going through a shell, so a project path can never be interpreted as a shell command. On Windows it is invoked the way the `code.cmd` wrapper does it (`Code.exe <cli.js> -n <folder>` with `ELECTRON_RUN_AS_NODE=1`); calling `Code.exe <folder>` instead makes it run as plain Node and try to load the folder as a script, failing silently.

### Changed (metadata)

- The extension identity is now `m0m0.m0m0-33-project-manager` (`name` / `displayName` = `m0m0-33-project-manager`, `publisher` = `m0m0`), and the version restarted at `0.1.0`.
- `homepage` / `repository` / `bugs` point at this fork; the upstream `sponsor` entry was removed.
- The extension ID was updated in the manifest, the Help and Feedback view, the What's New provider, the Remote walkthrough snippets and the tests.

### Left unchanged on purpose

- Command IDs, setting IDs (`projectManager.*`) and view IDs are **deliberately unchanged**, so this fork is a drop-in replacement for the original. As a consequence, **do not install the original and this fork at the same time** — they claim the same commands and settings.
- The copyright notices in the source files are untouched, as GPLv3 requires. The modifications and their date are stated in the README.

### Changed (branding, ahead of a public listing)

This fork is published on the VS Code Marketplace, so it has to be **visually distinguishable from the original at a glance**; otherwise it risks being treated as a duplicate listing, and it could interfere with the original author. To that end:

- **The user-visible brand name is now `GF33 Project Manager`** — the activity bar title, the settings section title, 13 command titles, the walkthrough title and the welcome view texts, 101 occurrences in total. The original shows itself as "Project Manager" in the UI, which made this fork indistinguishable from the official extension once installed. **Command and setting IDs were not changed**, so existing settings do not need to be migrated.
- **All icon assets were replaced**: the marketplace icon is now a `GF33` badge (replacing the original author's blue folder icon), the What's New header logo matches it, and the activity bar icon is a "rounded box with a list" glyph. The previous marketplace icon and logo are the original author's own artwork; reusing them would raise both a copyright question and the "looks like the same extension" problem.
- **Fixed the What's New header logo path**: the path is built from the extension name (`images/vscode-<name>-logo-readme.png`), so the rename left it pointing at a file that no longer existed.
- **Removed the original author's support/donation entry points**: the `Support Project Manager` command (GitHub Sponsors + PayPal), the Support button in Help and Feedback, and the sponsorship and social links on the What's New page. A fork should not carry someone else's donation buttons.
- **Removed the original author's promotional material**: the four upstream UI screenshots/GIFs referenced by the walkthrough (in 32 markdown files), a 48.7 MB promotional GIF, and the original gh-pages site files.
- **The documentation links** in the welcome views now point at this repository instead of the original author's.
- **`keywords` were trimmed** to reduce overlap with the original in search: `git`, `mercurial`, `svn`, `switch`, `manage` and `multi-root ready` were dropped, leaving descriptive words and the fork identifier.
- **The top of the README** carries a prominent notice that this is a modified version of the original, with the modification date and the license.

### Changed (English only)

The 8 upstream translations were deleted, **58 files** in total:

- `package.nls.{az,cs,fr,pt-br,ru,uk,zh-cn,zh-tw}.json` (8 files)
- `l10n/bundle.l10n.{az,cs,fr,pt-br,ru,uk,zh-cn,zh-tw}.json` (8 files)
- `walkthrough/*.nls.{az,fr,pt-br,ru,uk,zh-cn,zh-tw}.md` (42 files)

The English base files **must be kept** — deleting them breaks the extension:

- `package.nls.json` — the `%key%` placeholders in `package.json` are resolved from it. Without it, every command title and setting description would show its raw `%projectManager.commands.saveProject.title%`.
- `l10n/bundle.l10n.json` — the English reference table for the runtime messages (`l10n.t`).
- The 6 English `.md` files under `walkthrough/` — the walkthrough steps in `package.json` reference them directly; the localized variants are only an optional side branch that VS Code looks for by convention.

Non-English UIs now fall back to English.

### Changed (asset folders merged)

The assets were spread over three folders: `icon/` (the button icons added by this fork), `images/` (the What's New header logo) and `docs/images/` (the marketplace icon, the activity bar icon and the runtime tree icons). They are all merged into **`images/`** now, and `icon/` and `docs/` are gone.

- The prefix in `src/utils/icons.ts` changed from `"docs/images/ico-"` to `"images/ico-"`, and **all 18 runtime tree icons moved with it**.
- The marketplace icon path is now `images/icon.png`, matching the convention used by m0m0-32.
- `images/vscode-<name>-logo-readme.png` has to stay directly in `images/`, because the vendored `vscode-whats-new` library hardcodes that folder (`Manager.ts`).
- Three leftover assets referenced by no code at all were deleted along the way: `ico_file_code.png`, `ico_git_branch.png` and `ico_svn.png` (leftovers from an older version; `getIconDetailsFromProjectPath` returns codicon names, not file paths).
- Dead entries were removed from `.vscodeignore` (the gh-pages entries such as `docs/index.html`, plus `AGENTS.md` and `.devcontainer/`).

> Verified after the move: the bundle requests `images/ico-*` and no longer `docs/images/ico-*`, all 6 files referenced by the manifest are present, and all 18 runtime icons are accounted for.

# gtfish10_diff-tool

Compare two files side-by-side using VS Code's built-in diff viewer, with context menu integration and filename-based diff titles.

## Features

- **Two-step file marking**: Mark a first file, then mark a second file to instantly open a side-by-side diff comparison
- **Context menu integration**: Both commands are available directly from the editor right-click context menu under a dedicated "DiffTool" group
- **Filename-based diff title**: The diff tab title displays both filenames in a clear `file1<->file2` format for easy identification
- **Stateful caching**: The extension remembers the first marked file until a second file is selected, then automatically clears the cache after comparison

## Commands

| Command | Description |
| ------- | ----------- |
| `DiffTool: Mark 1st file` | Mark the current file as the left side of the diff comparison |
| `DiffTool: Mark 2nd file` | Mark the current file as the right side and open the diff view |

## Usage

1. Open the first file you want to compare
2. Right-click in the editor and select **DiffTool: Mark 1st file**
3. Open the second file
4. Right-click and select **DiffTool: Mark 2nd file**
5. A side-by-side diff view opens automatically

## Key Modifications from Original

- Enhanced diff title to show filenames instead of generic labels for clearer identification when comparing multiple file pairs

## Attribution

Based on [Diff Tool](https://marketplace.visualstudio.com/items?itemName=jinsihou.diff-tool) by jinsihou. Independently modified and maintained.

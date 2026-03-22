# gtfish30-render-pattern

A VS Code extension that recognizes file system paths as clickable links.

## Features

- Recognizes Windows absolute paths (e.g., `D:\Dropbox`, `C:\Users\Documents`)
- Recognizes UNC paths (e.g., `\\server\share\folder`)
- Recognizes file:// URLs (e.g., `file:///D:/Dropbox`)
- Ctrl+Click (or Cmd+Click on Mac) on a path to open it in Windows Explorer
- If the path is a folder, opens the folder directly
- If the path is a file, opens the parent folder and selects the file

## Usage

1. Open any file containing file paths
2. Hover over a recognized path to see the tooltip
3. Ctrl+Click to open the path in Windows Explorer

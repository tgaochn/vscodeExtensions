"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookmarkTreeItem = void 0;
const vscode_1 = require("vscode");
const bookmark_1 = require("./bookmark");
const group_1 = require("./group");
class BookmarkTreeItem extends vscode_1.TreeItem {
    constructor() {
        super(...arguments);
        this.base = null;
        this.parent = null;
        this.filterGroup = null;
    }
    static fromNone() {
        let result = new BookmarkTreeItem(" ", vscode_1.TreeItemCollapsibleState.None);
        result.contextValue = "none";
        result.description = "none";
        result.tooltip = "none";
        result.base = null;
        return result;
    }
    static fromBookmark(bookmark) {
        let label = (bookmark.lineNumber + 1) + (typeof bookmark.label !== "undefined" ? ": " + bookmark.label : "");
        let result = new BookmarkTreeItem(label, vscode_1.TreeItemCollapsibleState.None);
        result.contextValue = "bookmark";
        result.description = bookmark.lineText;
        result.iconPath = bookmark.group.decorationSvg;
        result.base = bookmark;
        result.tooltip = vscode_1.workspace.asRelativePath(bookmark.fsPath) + ": " + label;
        result.command = {
            "title": "jump to bookmark",
            "command": "vsc-labeled-bookmarks.jumpToBookmark",
            "arguments": [bookmark, true]
        };
        return result;
    }
    static fromGroup(group) {
        let label = group.name;
        let result = new BookmarkTreeItem(label, vscode_1.TreeItemCollapsibleState.Expanded);
        result.contextValue = "group";
        result.iconPath = group.decorationSvg;
        result.base = group;
        result.filterGroup = group;
        result.tooltip = "Group '" + group.name + "'";
        return result;
    }
    static fromFSPath(fsPath, filterGroup) {
        let result = new BookmarkTreeItem(vscode_1.Uri.file(fsPath), vscode_1.TreeItemCollapsibleState.Expanded);
        result.contextValue = "file";
        result.iconPath = vscode_1.ThemeIcon.File;
        result.base = fsPath;
        result.filterGroup = filterGroup;
        result.tooltip = vscode_1.workspace.asRelativePath(fsPath);
        return result;
    }
    setParent(parent) {
        this.parent = parent;
    }
    getParent() {
        return this.parent;
    }
    getBaseBookmark() {
        if (this.base instanceof bookmark_1.Bookmark) {
            return this.base;
        }
        return null;
    }
    getBaseGroup() {
        if (this.base instanceof group_1.Group) {
            return this.base;
        }
        return null;
    }
    getBaseFSPath() {
        if (typeof this.base === "string") {
            return this.base;
        }
        return null;
    }
    getFilterGroup() {
        return this.filterGroup;
    }
}
exports.BookmarkTreeItem = BookmarkTreeItem;
//# sourceMappingURL=bookmark_tree_item.js.map
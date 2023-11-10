"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookmarkPickItem = void 0;
const vscode_1 = require("vscode");
class BookmarkPickItem {
    constructor(bookmark, label, description, detail) {
        this.bookmark = bookmark;
        this.label = label;
        this.description = description;
        this.detail = detail;
        this.picked = false;
        this.alwaysShow = false;
    }
    static fromBookmark(bookmark, withGroupName) {
        let label = (typeof bookmark.label !== "undefined" ? "$(tag) " + bookmark.label + "\u2003" : "")
            + bookmark.lineText;
        let description = withGroupName ? "(" + bookmark.group.name + ")" : "";
        let detail = "line " + (bookmark.lineNumber + 1) + " - "
            + vscode_1.workspace.asRelativePath(bookmark.fsPath);
        if (label === "") {
            description = "empty line " + description;
        }
        if (bookmark.failedJump) {
            label = "$(warning) " + label;
            detail = "$(warning) " + detail;
        }
        return new BookmarkPickItem(bookmark, label, description, detail);
    }
}
exports.BookmarkPickItem = BookmarkPickItem;
//# sourceMappingURL=bookmark_pick_item.js.map
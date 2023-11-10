"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ByFileTreeDataProvider = void 0;
const bookmark_tree_item_1 = require("./bookmark_tree_item");
const bookmark_tree_data_provider_1 = require("./bookmark_tree_data_provider");
class ByFileTreeDataProvider extends bookmark_tree_data_provider_1.BookmarkTreeDataProvider {
    constructor(bookmarkDataProvider) {
        super(bookmarkDataProvider);
        this.collapseGroupNodes = true;
        this.collapseFileNodes = true;
    }
    setRootElements() {
        this.rootElements = this.getFiles(this.bookmarkDataProvider.getBookmarks())
            .map(fsPath => bookmark_tree_item_1.BookmarkTreeItem.fromFSPath(fsPath, null, this.collapseFileNodes));
    }
    getTargetForGroup(group) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.handlePendingRefresh();
            let parent = this.rootElements.find(element => { return group === element.getBaseGroup(); });
            if (typeof parent === "undefined") {
                return null;
            }
            let children = this.childElements.get(parent);
            if (typeof children === "undefined") {
                return null;
            }
            if (children.length === 0) {
                return null;
            }
            return children[0];
        });
    }
    getTargetForBookmark(bookmark) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.handlePendingRefresh();
            for (let [parent, children] of this.childElements) {
                let target = children.find(child => child.getBaseBookmark() === bookmark);
                if (typeof target !== "undefined") {
                    return target;
                }
            }
            return bookmark_tree_item_1.BookmarkTreeItem.fromNone();
        });
    }
}
exports.ByFileTreeDataProvider = ByFileTreeDataProvider;
//# sourceMappingURL=by_file_tree_data_provider.js.map
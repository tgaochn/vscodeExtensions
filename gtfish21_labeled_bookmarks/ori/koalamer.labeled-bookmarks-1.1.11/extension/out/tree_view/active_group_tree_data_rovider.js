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
exports.ActiveGroupTreeDataProvider = void 0;
const bookmark_tree_item_1 = require("./bookmark_tree_item");
const bookmark_tree_data_provider_1 = require("./bookmark_tree_data_provider");
class ActiveGroupTreeDataProvider extends bookmark_tree_data_provider_1.BookmarkTreeDataProvider {
    constructor(bookmarkDataProvider) {
        super(bookmarkDataProvider);
        this.collapseGroupNodes = false;
        this.collapseFileNodes = false;
    }
    setRootElements() {
        let activeGroup = this.bookmarkDataProvider.getActiveGroup();
        this.rootElements = this.bookmarkDataProvider.getGroups()
            .filter(g => { return g === activeGroup; })
            .map(group => bookmark_tree_item_1.BookmarkTreeItem.fromGroup(group, this.collapseGroupNodes));
    }
    getAnyTarget() {
        if (this.rootElements.length > 0) {
            return this.rootElements[0];
        }
        return null;
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
exports.ActiveGroupTreeDataProvider = ActiveGroupTreeDataProvider;
//# sourceMappingURL=active_group_tree_data_rovider.js.map
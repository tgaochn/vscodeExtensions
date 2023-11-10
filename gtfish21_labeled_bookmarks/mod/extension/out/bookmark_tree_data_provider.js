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
exports.BookmarkTreeDataProvider = void 0;
const vscode_1 = require("vscode");
const bookmark_tree_item_1 = require("./bookmark_tree_item");
class BookmarkTreeDataProvider {
    constructor(groups, bookmarks, byGroup) {
        this.rootElements = [];
        this.changeEmitter = new vscode_1.EventEmitter();
        this.onDidChangeTreeData = this.changeEmitter.event;
        // workaround for tree views not updating when hidden
        this.isRefreshPending = false;
        this.refreshGracePeriod = 100;
        this.groups = groups;
        this.bookmarks = bookmarks;
        this.byGroup = byGroup;
        this.childElements = new Map();
    }
    getTreeItem(element) {
        return element;
    }
    getChildren(element) {
        if (!element) {
            this.isRefreshPending = false;
            if (this.byGroup) {
                this.rootElements = this.groups.map(group => bookmark_tree_item_1.BookmarkTreeItem.fromGroup(group));
                return Promise.resolve(this.rootElements);
            }
            else {
                this.rootElements = this.getFiles(this.bookmarks)
                    .map(fsPath => bookmark_tree_item_1.BookmarkTreeItem.fromFSPath(fsPath, null));
                return Promise.resolve(this.rootElements);
            }
        }
        let filterGroup = element.getFilterGroup();
        let baseFSPath = element.getBaseFSPath();
        if (baseFSPath !== null) {
            let bookmarks = this.bookmarks.filter(bookmark => { return (bookmark.fsPath === baseFSPath); });
            if (filterGroup !== null) {
                bookmarks = bookmarks.filter(bookmark => { return bookmark.group === filterGroup; });
            }
            let children;
            if (bookmarks.length === 0) {
                children = [bookmark_tree_item_1.BookmarkTreeItem.fromNone()];
            }
            else {
                children = bookmarks.map(bookmark => bookmark_tree_item_1.BookmarkTreeItem.fromBookmark(bookmark));
            }
            children.forEach(child => child.setParent(element));
            this.childElements.set(element, children);
            return Promise.resolve(children);
        }
        let baseGroup = element.getBaseGroup();
        if (baseGroup !== null) {
            let files = this.getFiles(this.bookmarks.filter(bookmark => { return bookmark.group === filterGroup; }));
            let children;
            if (files.length === 0) {
                children = [bookmark_tree_item_1.BookmarkTreeItem.fromNone()];
            }
            else {
                children = files.map(fsPath => bookmark_tree_item_1.BookmarkTreeItem.fromFSPath(fsPath, filterGroup));
            }
            children.forEach(child => child.setParent(element));
            this.childElements.set(element, children);
            return Promise.resolve(children);
        }
        return Promise.resolve([]);
    }
    refresh() {
        this.isRefreshPending = true;
        this.changeEmitter.fire();
        // this.rootElements.forEach(element => {
        //     this.changeEmitter.fire(element);
        //     if (this.byGroup) {
        //         this.childElements.get(element)?.forEach(child => {
        //             this.changeEmitter.fire(child);
        //         });
        //     }
        // });
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            let nodesToProcess = new Array();
            nodesToProcess.push(undefined);
            while (nodesToProcess.length > 0) {
                let node = nodesToProcess.pop();
                let moreNodes = yield this.getChildren(node);
                moreNodes.forEach(newNode => {
                    if (typeof newNode !== "undefined") {
                        nodesToProcess.push(newNode);
                    }
                });
            }
        });
    }
    ;
    getAnyTarget() {
        if (this.rootElements.length > 0) {
            return this.rootElements[0];
        }
        return null;
    }
    getTargetForGroup(group) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.byGroup) {
                return null;
            }
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
    getParent(element) {
        return element.getParent();
    }
    getFiles(bookmarks) {
        let files = new Array();
        for (let i = 0; i < bookmarks.length; i++) {
            if (i === 0 || bookmarks[i].fsPath !== bookmarks[i - 1].fsPath) {
                files.push(bookmarks[i].fsPath);
            }
        }
        return files;
    }
    handlePendingRefresh() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isRefreshPending) {
                yield this.init();
                yield new Promise(resolve => setTimeout(resolve, this.refreshGracePeriod));
            }
        });
    }
}
exports.BookmarkTreeDataProvider = BookmarkTreeDataProvider;
//# sourceMappingURL=bookmark_tree_data_provider.js.map
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
exports.BookmarkTreeView = void 0;
const vscode = require("vscode");
const rate_limiter_1 = require("../rate_limiter/rate_limiter");
const active_group_tree_data_rovider_1 = require("./active_group_tree_data_rovider");
const inactive_groups_tree_data_provider_1 = require("./inactive_groups_tree_data_provider");
const by_file_tree_data_provider_1 = require("./by_file_tree_data_provider");
class BookmarkTreeView {
    constructor() {
        this.main = null;
        this.treeViewByActiveGroup = null;
        this.treeViewByInactiveGroups = null;
        this.treeViewByFile = null;
        this.treeDataProviderByActiveGroup = null;
        this.treeDataProviderByInactiveGroups = null;
        this.treeDataProviderByFile = null;
        this.proxyRefreshCallback = () => { };
        this.refreshLimiter = new rate_limiter_1.RateLimiter(() => { }, 0, 1000);
        this.isInitDone = false;
    }
    init(main) {
        return __awaiter(this, void 0, void 0, function* () {
            this.main = main;
            this.treeDataProviderByActiveGroup = new active_group_tree_data_rovider_1.ActiveGroupTreeDataProvider(this.main);
            this.treeDataProviderByInactiveGroups = new inactive_groups_tree_data_provider_1.InactiveGroupsTreeDataProvider(this.main);
            this.treeDataProviderByFile = new by_file_tree_data_provider_1.ByFileTreeDataProvider(this.main);
            this.treeViewByActiveGroup = vscode.window.createTreeView('bookmarksByActiveGroup', {
                treeDataProvider: this.treeDataProviderByActiveGroup
            });
            this.treeViewByInactiveGroups = vscode.window.createTreeView('bookmarksByInactiveGroups', {
                treeDataProvider: this.treeDataProviderByInactiveGroups
            });
            this.treeViewByFile = vscode.window.createTreeView('bookmarksByFile', {
                treeDataProvider: this.treeDataProviderByFile
            });
            yield this.treeDataProviderByActiveGroup.init();
            yield this.treeDataProviderByInactiveGroups.init();
            yield this.treeDataProviderByFile.init();
            this.refreshLimiter = new rate_limiter_1.RateLimiter(this.actualRefresh.bind(this), 50, 800);
            this.proxyRefreshCallback = this.refreshLimiter.fire.bind(this.refreshLimiter);
            this.isInitDone = true;
            this.refreshCallback();
        });
    }
    refreshCallback() {
        this.proxyRefreshCallback();
    }
    deleteItem(treeItem) {
        var _a, _b, _c;
        if (!this.isInitDone) {
            return;
        }
        let bookmark = treeItem.getBaseBookmark();
        if (bookmark !== null) {
            (_a = this.main) === null || _a === void 0 ? void 0 : _a.actionDeleteOneBookmark(bookmark);
            return;
        }
        let group = treeItem.getBaseGroup();
        if (group !== null) {
            (_b = this.main) === null || _b === void 0 ? void 0 : _b.actionDeleteOneGroup(group);
            return;
        }
        let fsPath = treeItem.getBaseFSPath();
        if (fsPath !== null) {
            (_c = this.main) === null || _c === void 0 ? void 0 : _c.deleteBookmarksOfFile(fsPath, treeItem.getFilterGroup());
        }
    }
    activateItem(treeItem) {
        var _a;
        if (!this.isInitDone) {
            return;
        }
        let group = treeItem.getBaseGroup();
        if (group === null) {
            return;
        }
        (_a = this.main) === null || _a === void 0 ? void 0 : _a.setActiveGroup(group.name);
    }
    editItem(treeItem) {
        var _a, _b;
        if (!this.isInitDone) {
            return;
        }
        let bookmark = treeItem.getBaseBookmark();
        if (bookmark !== null) {
            (_a = this.main) === null || _a === void 0 ? void 0 : _a.relabelBookmark(bookmark);
            return;
        }
        let group = treeItem.getBaseGroup();
        if (group !== null) {
            (_b = this.main) === null || _b === void 0 ? void 0 : _b.renameGroup(group);
            return;
        }
    }
    show() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.isInitDone
                    || this.main === null
                    || this.treeDataProviderByActiveGroup === null
                    || this.treeViewByActiveGroup === null) {
                    return;
                }
                if (!this.treeViewByActiveGroup.visible) {
                    let anytarget = this.treeDataProviderByActiveGroup.getAnyTarget();
                    if (anytarget !== null) {
                        this.treeViewByActiveGroup.reveal(anytarget);
                    }
                }
                let textEditor = vscode.window.activeTextEditor;
                if (typeof textEditor === "undefined" && vscode.window.visibleTextEditors.length > 0) {
                    textEditor = vscode.window.visibleTextEditors[0];
                }
                if (typeof textEditor === "undefined") {
                    return;
                }
                let nearestBookmarkInFile = this.main.getNearestActiveBookmarkInFile(textEditor, this.main.getActiveGroup());
                if (nearestBookmarkInFile === null) {
                    return;
                }
                let targetBookmark = yield this.treeDataProviderByActiveGroup.getTargetForBookmark(nearestBookmarkInFile);
                if (targetBookmark !== null) {
                    this.treeViewByActiveGroup.reveal(targetBookmark);
                }
            }
            catch (e) {
                console.log(e);
                vscode.window.showErrorMessage("Bookmark tree view init error " + e);
            }
        });
    }
    actualRefresh() {
        var _a, _b, _c;
        (_a = this.treeDataProviderByActiveGroup) === null || _a === void 0 ? void 0 : _a.refresh();
        (_b = this.treeDataProviderByInactiveGroups) === null || _b === void 0 ? void 0 : _b.refresh();
        (_c = this.treeDataProviderByFile) === null || _c === void 0 ? void 0 : _c.refresh();
    }
}
exports.BookmarkTreeView = BookmarkTreeView;
//# sourceMappingURL=bookmark_tree_view.js.map
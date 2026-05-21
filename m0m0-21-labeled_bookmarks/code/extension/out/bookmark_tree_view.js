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
const rate_limiter_1 = require("./rate_limiter/rate_limiter");
class BookmarkTreeView {
    constructor() {
        this.main = null;
        this.treeViewByGroup = null;
        this.treeViewByFile = null;
        this.treeDataProviderByGroup = null;
        this.treeDataProviderByFile = null;
        this.proxyRefreshCallback = () => { };
        this.refreshLimiter = new rate_limiter_1.RateLimiter(() => { }, 0, 1000);
    }
    init(main) {
        return __awaiter(this, void 0, void 0, function* () {
            this.main = main;
            this.treeDataProviderByGroup = this.main.getTreeDataProviderByGroup();
            this.treeDataProviderByFile = this.main.getTreeDataProviderByFile();
            this.treeViewByGroup = vscode.window.createTreeView('bookmarksByGroup', {
                treeDataProvider: this.treeDataProviderByGroup
            });
            this.treeViewByFile = vscode.window.createTreeView('bookmarksByFile', {
                treeDataProvider: this.treeDataProviderByFile
            });
            yield this.treeDataProviderByGroup.init();
            yield this.treeDataProviderByFile.init();
            this.refreshLimiter = new rate_limiter_1.RateLimiter(this.actualRefresh.bind(this), 50, 800);
            this.proxyRefreshCallback = this.refreshLimiter.fire.bind(this.refreshLimiter);
            this.refreshCallback();
        });
    }
    refreshCallback() {
        this.proxyRefreshCallback();
    }
    deleteItem(treeItem) {
        var _a;
        if (this.main === null
            || this.treeDataProviderByFile === null
            || this.treeDataProviderByGroup === null) {
            return;
        }
        let bookmark = treeItem.getBaseBookmark();
        if (bookmark !== null) {
            (_a = this.main) === null || _a === void 0 ? void 0 : _a.actionDeleteOneBookmark(bookmark);
            return;
        }
        let group = treeItem.getBaseGroup();
        if (group !== null) {
            this.main.actionDeleteOneGroup(group);
            return;
        }
        let fsPath = treeItem.getBaseFSPath();
        if (fsPath !== null) {
            let dataProvider = (treeItem.getFilterGroup() !== null)
                ? this.treeDataProviderByGroup
                : this.treeDataProviderByFile;
            dataProvider.getChildren(treeItem).then(children => {
                children.forEach(treeItem => {
                    let bookmark = treeItem.getBaseBookmark();
                    if (bookmark === null) {
                        return;
                    }
                    if (this.main === null) {
                        return;
                    }
                    this.main.actionDeleteOneBookmark(bookmark);
                });
            });
        }
    }
    activateItem(treeItem) {
        if (this.main === null
            || this.treeDataProviderByFile === null
            || this.treeDataProviderByGroup === null) {
            return;
        }
        let group = treeItem.getBaseGroup();
        if (group === null) {
            return;
        }
        this.main.setActiveGroup(group.name);
    }
    editItem(treeItem) {
        var _a;
        if (this.main === null
            || this.treeDataProviderByFile === null
            || this.treeDataProviderByGroup === null) {
            return;
        }
        let bookmark = treeItem.getBaseBookmark();
        if (bookmark !== null) {
            (_a = this.main) === null || _a === void 0 ? void 0 : _a.relabelBookmark(bookmark);
            return;
        }
        let group = treeItem.getBaseGroup();
        if (group !== null) {
            this.main.renameGroup(group);
            return;
        }
    }
    show() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (this.main === null
                    || this.treeDataProviderByFile === null
                    || this.treeDataProviderByGroup === null
                    || this.treeViewByFile === null
                    || this.treeViewByGroup === null) {
                    vscode.window.showErrorMessage("Bookmark tree view init error 1");
                    return;
                }
                if (!this.treeViewByFile.visible) {
                    let anytarget = this.treeDataProviderByFile.getAnyTarget();
                    if (anytarget !== null) {
                        this.treeViewByFile.reveal(anytarget);
                    }
                }
                if (!this.treeViewByGroup.visible) {
                    let anytarget = this.treeDataProviderByGroup.getAnyTarget();
                    if (anytarget !== null) {
                        this.treeViewByGroup.reveal(anytarget);
                    }
                }
                let groupTarget = yield this.treeDataProviderByGroup.getTargetForGroup(this.main.getActiveGroup());
                if (groupTarget === null) {
                    return;
                }
                let textEditor = vscode.window.activeTextEditor;
                if (typeof textEditor === "undefined" && vscode.window.visibleTextEditors.length > 0) {
                    textEditor = vscode.window.visibleTextEditors[0];
                }
                if (typeof textEditor === "undefined") {
                    this.treeViewByGroup.reveal(groupTarget);
                    return;
                }
                let nearestBookmark = this.main.getNearestBookmark(textEditor);
                if (nearestBookmark === null) {
                    this.treeViewByGroup.reveal(groupTarget);
                    return;
                }
                let target1 = yield this.treeDataProviderByFile.getTargetForBookmark(nearestBookmark);
                if (target1 !== null) {
                    this.treeViewByFile.reveal(target1);
                }
                let target2 = yield this.treeDataProviderByGroup.getTargetForBookmark(nearestBookmark);
                if (target2 !== null) {
                    this.treeViewByGroup.reveal(target2);
                }
            }
            catch (e) {
                console.log(e);
                vscode.window.showErrorMessage("Bookmark tree view init error " + e);
            }
        });
    }
    actualRefresh() {
        if (this.treeDataProviderByGroup !== null) {
            this.treeDataProviderByGroup.refresh();
        }
        if (this.treeDataProviderByFile !== null) {
            this.treeDataProviderByFile.refresh();
        }
    }
}
exports.BookmarkTreeView = BookmarkTreeView;
//# sourceMappingURL=bookmark_tree_view.js.map
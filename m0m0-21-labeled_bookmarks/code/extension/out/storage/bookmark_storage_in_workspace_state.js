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
exports.BookmarkStorageInWorkspaceState = void 0;
class BookmarkStorageInWorkspaceState {
    constructor(workspaceState, keyPostfix) {
        this.savedDataFormatVersionKey = "vscLabeledBookmarks.formatVersion";
        this.savedBookmarksKey = "vscLabeledBookmarks.bookmarks";
        this.savedGroupsKey = "vscLabeledBookmarks.groups";
        this.savedWorkspaceFoldersKey = "vscLabeledBookmarks.workspaceFolders";
        this.savedBookmarkTimestampKey = "vscodeLabeledBookmarks.bookmarkTimestamp";
        this.keyPostfix = "";
        this.dataFormatVersion = 0;
        this.groups = new Array();
        this.bookmarks = new Array();
        this.workspaceFolders = new Array();
        this.timestamp = 0;
        this.workspaceState = workspaceState;
        this.keyPostfix = keyPostfix;
    }
    readStorage() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            this.dataFormatVersion = (_a = this.workspaceState.get(this.savedDataFormatVersionKey + this.keyPostfix)) !== null && _a !== void 0 ? _a : 0;
            let abortOnError = this.dataFormatVersion !== 0;
            yield this.ensureDataFormatCompatibility();
            let bookmarkTimestamp = this.workspaceState.get(this.savedBookmarkTimestampKey + this.keyPostfix);
            if (typeof bookmarkTimestamp === "undefined") {
                if (abortOnError) {
                    throw new Error("Restoring timestamp failed");
                }
                bookmarkTimestamp = 0;
            }
            this.timestamp = bookmarkTimestamp;
            let serializedGroups = this.workspaceState.get(this.savedGroupsKey + this.keyPostfix);
            if (typeof serializedGroups === "undefined") {
                if (abortOnError) {
                    throw new Error("Restoring bookmark groups failed");
                }
                serializedGroups = new Array();
            }
            this.groups = serializedGroups;
            let serializedBookmarks = this.workspaceState.get(this.savedBookmarksKey + this.keyPostfix);
            if (typeof serializedBookmarks === "undefined") {
                if (abortOnError) {
                    throw new Error("Restoring bookmarks failed");
                }
                serializedBookmarks = new Array();
            }
            this.bookmarks = serializedBookmarks;
            let serializedWorkspaceFolders = this.workspaceState.get(this.savedWorkspaceFoldersKey + this.keyPostfix);
            if (typeof serializedWorkspaceFolders === "undefined") {
                if (abortOnError) {
                    throw new Error("Restoring workspace folder list failed");
                }
                serializedWorkspaceFolders = new Array();
            }
            this.workspaceFolders = serializedWorkspaceFolders;
        });
    }
    ensureDataFormatCompatibility() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.dataFormatVersion === 0) {
                // from v0 to v1: initial set up
                // - add timestamp
                // - add format v1
                // - add groups if not present
                // - add bookmarks if not present
                // - add workspaceFolders
                yield this.workspaceState.update(this.savedBookmarkTimestampKey + this.keyPostfix, 0);
                this.dataFormatVersion = 1;
                yield this.workspaceState.update(this.savedDataFormatVersionKey + this.keyPostfix, this.dataFormatVersion);
                let serializedGroups = this.workspaceState.get(this.savedGroupsKey + this.keyPostfix);
                if (typeof serializedGroups === "undefined") {
                    yield this.workspaceState.update(this.savedGroupsKey + this.keyPostfix, new Array());
                }
                let serializedBookmarks = this.workspaceState.get(this.savedBookmarksKey + this.keyPostfix);
                if (typeof serializedBookmarks === "undefined") {
                    yield this.workspaceState.update(this.savedBookmarksKey + this.keyPostfix, new Array());
                }
                yield this.workspaceState.update(this.savedWorkspaceFoldersKey + this.keyPostfix, new Array());
            }
        });
    }
    getBookmarks() {
        return this.bookmarks;
    }
    getGroups() {
        return this.groups;
    }
    getWorkspaceFolders() {
        return this.workspaceFolders;
    }
    getTimestamp() {
        return this.timestamp;
    }
    ;
    getStatusBarText() {
        if (this.keyPostfix === "") {
            return "";
        }
        return " (slot: " + this.keyPostfix + ")";
    }
    getStatusBarTooltipText() {
        return "Bookmarks are stored locally in the workspace state";
    }
    getStorageType() {
        return "workspaceState";
    }
    getStoragePath() {
        return this.keyPostfix;
    }
    setBookmarks(serializableBookmarks) {
        this.bookmarks = serializableBookmarks;
    }
    ;
    setGroups(serializableGroups) {
        this.groups = serializableGroups;
    }
    setWorkspaceFolders(workspaceFolders) {
        this.workspaceFolders = workspaceFolders;
    }
    setTimestamp(timestamp) {
        this.timestamp = timestamp;
    }
    persist() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.workspaceState.update(this.savedDataFormatVersionKey + this.keyPostfix, this.dataFormatVersion);
            yield this.workspaceState.update(this.savedBookmarkTimestampKey + this.keyPostfix, this.timestamp);
            yield this.workspaceState.update(this.savedGroupsKey + this.keyPostfix, this.groups);
            yield this.workspaceState.update(this.savedBookmarksKey + this.keyPostfix, this.bookmarks);
            yield this.workspaceState.update(this.savedWorkspaceFoldersKey + this.keyPostfix, this.workspaceFolders);
        });
    }
}
exports.BookmarkStorageInWorkspaceState = BookmarkStorageInWorkspaceState;
//# sourceMappingURL=bookmark_storage_in_workspace_state.js.map
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
exports.BookmarkStorageDummy = void 0;
const vscode = require("vscode");
const serializable_group_1 = require("./serializable_group");
class BookmarkStorageDummy {
    getBookmarks() {
        this.showError();
        return new Array();
    }
    getGroups() {
        this.showError();
        let dummyGroup = new serializable_group_1.SerializableGroup("uninitialized", "#888888FF", "bookmark", "?");
        return [dummyGroup];
    }
    getWorkspaceFolders() {
        this.showError();
        return new Array();
    }
    getTimestamp() {
        this.showError();
        return 0;
    }
    getStatusBarText() {
        return " (not persisted)";
    }
    getStatusBarTooltipText() {
        return "\nBookmarks are not persisted and will be lost";
    }
    getStorageType() {
        return "dummy";
    }
    getStoragePath() {
        return "";
    }
    setBookmarks(serializableBookmarks) {
        this.showError();
    }
    setGroups(serializableGroups) {
        this.showError();
    }
    setWorkspaceFolders(workspaceFolders) {
        this.showError();
    }
    setTimestamp(timestamp) {
        this.showError();
    }
    readStorage() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    persist() {
        return __awaiter(this, void 0, void 0, function* () {
            this.showError();
        });
    }
    ;
    showError() {
        vscode.window.showErrorMessage('Labeled bookmark storage is uninitialized. Bookmarks will not persisted. Use `ctrl+alt+b b` to switch to an actual storage location.');
    }
}
exports.BookmarkStorageDummy = BookmarkStorageDummy;
//# sourceMappingURL=bookmark_storage_dummy.js.map
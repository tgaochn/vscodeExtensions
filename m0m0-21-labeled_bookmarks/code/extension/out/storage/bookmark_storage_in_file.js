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
exports.BookmarkStorageInFile = void 0;
const vscode_1 = require("vscode");
const util_1 = require("util");
class BookmarkStorageInFile {
    constructor(uri) {
        this.presentDataFormatVersion = 1;
        this.uri = uri;
        this.dataFormatVersion = this.presentDataFormatVersion;
        this.groups = new Array();
        this.bookmarks = new Array();
        this.workspaceFolders = new Array();
        this.timestamp = 0;
    }
    readStorage() {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function* () {
            let fileContents = yield vscode_1.workspace.fs.readFile(this.uri);
            let json = new util_1.TextDecoder("utf-8").decode(fileContents);
            let savedData = JSON.parse(json);
            if (typeof savedData === "undefined") {
                Promise.reject(new Error("Could not read storage file " + this.uri.fsPath));
            }
            if (!savedData.hasOwnProperty('dataFormatVersion')
                || !savedData.hasOwnProperty('groups')
                || !savedData.hasOwnProperty('bookmarks')
                || !savedData.hasOwnProperty('workspaceFolders')
                || !savedData.hasOwnProperty('timestamp')) {
                Promise.reject(new Error("Expected fields missing from storage file"));
            }
            this.dataFormatVersion = (_a = savedData.dataFormatVersion) !== null && _a !== void 0 ? _a : 0;
            if (this.dataFormatVersion !== this.presentDataFormatVersion) {
                Promise.reject(new Error("Unkown data format version in storage file"));
            }
            this.groups = (_b = savedData.groups) !== null && _b !== void 0 ? _b : [];
            this.bookmarks = (_c = savedData.bookmarks) !== null && _c !== void 0 ? _c : [];
            this.workspaceFolders = (_d = savedData.workspaceFolders) !== null && _d !== void 0 ? _d : [];
            this.timestamp = (_e = savedData.timestamp) !== null && _e !== void 0 ? _e : 0;
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
    getStatusBarText() {
        return " (in file)";
    }
    getStatusBarTooltipText() {
        return "Bookmark storage file: " + this.uri.fsPath;
    }
    setBookmarks(serializableBookmarks) {
        this.bookmarks = serializableBookmarks;
    }
    setGroups(serializableGroups) {
        this.groups = serializableGroups;
    }
    getStorageType() {
        return "file";
    }
    getStoragePath() {
        return this.uri.fsPath;
    }
    setWorkspaceFolders(workspaceFolders) {
        this.workspaceFolders = workspaceFolders;
    }
    setTimestamp(timestamp) {
        this.timestamp = timestamp;
    }
    persist() {
        return __awaiter(this, void 0, void 0, function* () {
            let json = JSON.stringify({
                "dataFormatVersion": this.dataFormatVersion,
                "timestamp": this.timestamp,
                "groups": this.groups,
                "bookmarks": this.bookmarks,
                "workspaceFolders": this.workspaceFolders,
            });
            let bytes = Uint8Array.from(json.split("").map(c => { return c.charCodeAt(0); }));
            yield vscode_1.workspace.fs.writeFile(this.uri, bytes);
        });
    }
}
exports.BookmarkStorageInFile = BookmarkStorageInFile;
//# sourceMappingURL=bookmark_storage_in_file.js.map
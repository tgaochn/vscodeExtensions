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
exports.Main = void 0;
const vscode = require("vscode");
const group_1 = require("./group");
const vscode_1 = require("vscode");
const decoration_factory_1 = require("./decoration_factory");
const group_pick_item_1 = require("./group_pick_item");
const bookmark_pick_item_1 = require("./bookmark_pick_item");
const shape_pick_item_1 = require("./shape_pick_item");
const color_pick_item_1 = require("./color_pick_item");
const bookmark_1 = require("./bookmark");
const serializable_group_1 = require("./serializable_group");
const serializable_bookmark_1 = require("./serializable_bookmark");
class Main {
    constructor(ctx, treeviewRefreshCallback) {
        this.treeViewRefreshCallback = () => { };
        this.savedBookmarksKey = "vscLabeledBookmarks.bookmarks";
        this.savedGroupsKey = "vscLabeledBookmarks.groups";
        this.savedActiveGroupKey = "vscLabeledBookmarks.activeGroup";
        this.savedHideInactiveGroupsKey = "vscLabeledBookmarks.hideInactiveGroups";
        this.savedHideAllKey = "vscLabeledBookmarks.hideAll";
        this.configRoot = "labeledBookmarks";
        this.configKeyColors = "colors";
        this.configKeyUnicodeMarkers = "unicodeMarkers";
        this.configKeyDefaultShape = "defaultShape";
        this.configOverviewRulerLane = "overviewRulerLane";
        this.configLineEndLabelType = "lineEndLabelType";
        this.maxGroupNameLength = 40;
        this.fallbackColor = "00ddddff";
        this.fallbackColorName = "teal";
        this.defaultShape = "bookmark";
        this.ctx = ctx;
        this.treeViewRefreshCallback = treeviewRefreshCallback;
        let gutterIconDirUri = vscode.Uri.joinPath(this.ctx.extensionUri, 'resources', 'gutter_icons');
        this.decorationFactory = new decoration_factory_1.DecorationFactory(gutterIconDirUri, vscode_1.OverviewRulerLane.Center, "bordered");
        this.bookmarks = new Array();
        this.groups = new Array();
        this.defaultGroupName = "default";
        this.activeGroup = new group_1.Group(this.defaultGroupName, this.fallbackColor, this.defaultShape, "", this.decorationFactory);
        this.colors = new Map();
        this.unicodeMarkers = new Map();
        this.shapes = new Map([
            ["bookmark", "bookmark"],
            ["circle", "circle"],
            ["heart", "heart"],
            ["label", "label"],
            ["star", "star"]
        ]);
        this.removedDecorations = new Map();
        this.tempDocumentBookmarks = new Map();
        this.tempGroupBookmarks = new Map();
        this.tempDocumentDecorations = new Map();
        this.readSettings();
        if (this.colors.size < 1) {
            this.colors.set(this.fallbackColorName, this.decorationFactory.normalizeColorFormat(this.fallbackColor));
        }
        this.hideInactiveGroups = false;
        this.hideAll = false;
        this.restoreSavedState();
        this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1);
        this.statusBarItem.command = 'vsc-labeled-bookmarks.selectGroup';
        this.statusBarItem.show();
        this.saveState();
        this.updateDecorations();
    }
    saveState() {
        let serializedGroups = this.groups.map(group => serializable_group_1.SerializableGroup.fromGroup(group));
        this.ctx.workspaceState.update(this.savedGroupsKey, serializedGroups);
        let serializedBookmarks = this.bookmarks.map(bookmark => serializable_bookmark_1.SerializableBookmark.fromBookmark(bookmark));
        this.ctx.workspaceState.update(this.savedBookmarksKey, serializedBookmarks);
        this.ctx.workspaceState.update(this.savedActiveGroupKey, this.activeGroup.name);
        this.ctx.workspaceState.update(this.savedHideInactiveGroupsKey, this.hideInactiveGroups);
        this.ctx.workspaceState.update(this.savedHideAllKey, this.hideAll);
        this.updateStatusBar();
    }
    handleDecorationRemoved(decoration) {
        this.removedDecorations.set(decoration, true);
    }
    handleGroupDecorationUpdated(group) {
        var _a;
        this.tempDocumentDecorations.clear();
        (_a = this.tempGroupBookmarks.get(group)) === null || _a === void 0 ? void 0 : _a.forEach(bookmark => {
            bookmark.initDecoration();
        });
        this.updateDecorations();
        this.treeViewRefreshCallback();
    }
    handleGroupDecorationSwitched(group) {
        var _a;
        this.tempDocumentDecorations.clear();
        (_a = this.tempGroupBookmarks.get(group)) === null || _a === void 0 ? void 0 : _a.forEach(bookmark => {
            bookmark.switchDecoration();
        });
        this.updateDecorations();
        this.treeViewRefreshCallback();
    }
    handleBookmarkDecorationUpdated(bookmark) {
        this.tempDocumentDecorations.delete(bookmark.fsPath);
        this.updateDecorations();
    }
    getGroups() {
        return this.groups;
    }
    getBookmarks() {
        return this.bookmarks;
    }
    getActiveGroup() {
        return this.activeGroup;
    }
    updateDecorations() {
        for (let editor of vscode.window.visibleTextEditors) {
            this.updateEditorDecorations(editor);
        }
        this.removedDecorations.clear();
    }
    getGroupByName(groupName) {
        for (let g of this.groups) {
            if (g.name === groupName) {
                return g;
            }
        }
        return this.activeGroup;
    }
    updateEditorDecorations(textEditor) {
        if (typeof textEditor === "undefined") {
            return;
        }
        let fsPath = textEditor.document.uri.fsPath;
        let editorDecorations = this.getTempDocumentDecorationsList(fsPath);
        for (let [removedDecoration, b] of this.removedDecorations) {
            if (editorDecorations.has(removedDecoration)) {
                continue;
            }
            editorDecorations.set(removedDecoration, []);
        }
        for (let [decoration, ranges] of editorDecorations) {
            textEditor.setDecorations(decoration, ranges);
        }
    }
    onEditorDocumentChanged(event) {
        let fsPath = event.document.uri.fsPath;
        let fileBookmarkList = this.getTempDocumentBookmarkList(fsPath);
        if (fileBookmarkList.length === 0) {
            return;
        }
        let bookmarksChanged = false;
        for (let change of event.contentChanges) {
            let newLineCount = this.getNlCount(change.text);
            let oldFirstLine = change.range.start.line;
            let oldLastLine = change.range.end.line;
            let oldLineCount = oldLastLine - oldFirstLine;
            if (newLineCount === oldLineCount) {
                let updateCount = this.updateBookmarkLineTextInRange(event.document, fileBookmarkList, oldFirstLine, oldLastLine);
                if (updateCount > 0) {
                    this.treeViewRefreshCallback();
                }
                continue;
            }
            if (newLineCount > oldLineCount) {
                let shiftDownBy = newLineCount - oldLineCount;
                let newLastLine = oldFirstLine + newLineCount;
                let firstLinePrefix = event.document.getText(new vscode_1.Range(oldFirstLine, 0, oldFirstLine, change.range.start.character));
                let isFirstLinePrefixEmpty = firstLinePrefix.trim() === "";
                let shiftDownFromLine = (isFirstLinePrefixEmpty ? oldFirstLine : oldFirstLine + 1);
                for (let bookmark of fileBookmarkList) {
                    if (bookmark.lineNumber >= shiftDownFromLine) {
                        bookmark.lineNumber += shiftDownBy;
                        bookmarksChanged = true;
                    }
                    if (bookmark.lineNumber >= oldFirstLine && bookmark.lineNumber <= newLastLine) {
                        this.updateBookmarkLineText(event.document, bookmark);
                        this.treeViewRefreshCallback();
                    }
                }
                continue;
            }
            if (newLineCount < oldLineCount) {
                let shiftUpBy = oldLineCount - newLineCount;
                let newLastLine = oldFirstLine + newLineCount;
                let firstLinePrefix = event.document.getText(new vscode_1.Range(oldFirstLine, 0, oldFirstLine, change.range.start.character));
                let isFirstLineBookkmarkDeletable = firstLinePrefix.trim() === "";
                if (!isFirstLineBookkmarkDeletable) {
                    let firstLineBookmark = fileBookmarkList.find(bookmark => bookmark.lineNumber === oldFirstLine);
                    if (typeof firstLineBookmark === "undefined") {
                        isFirstLineBookkmarkDeletable = true;
                    }
                }
                let deleteFromLine = (isFirstLineBookkmarkDeletable ? oldFirstLine : oldFirstLine + 1);
                let shiftFromLine = deleteFromLine + shiftUpBy;
                for (let bookmark of fileBookmarkList) {
                    if (bookmark.lineNumber < oldFirstLine) {
                        continue;
                    }
                    if (bookmark.lineNumber >= deleteFromLine && bookmark.lineNumber < shiftFromLine) {
                        this.deleteBookmark(bookmark);
                        bookmarksChanged = true;
                        continue;
                    }
                    if (bookmark.lineNumber >= shiftFromLine) {
                        bookmark.lineNumber -= shiftUpBy;
                        bookmarksChanged = true;
                    }
                    if (bookmark.lineNumber >= oldFirstLine && bookmark.lineNumber <= newLastLine) {
                        this.updateBookmarkLineText(event.document, bookmark);
                        this.treeViewRefreshCallback();
                    }
                }
                continue;
            }
        }
        if (bookmarksChanged) {
            this.tempDocumentDecorations.delete(fsPath);
            this.saveState();
            this.updateDecorations();
            this.treeViewRefreshCallback();
        }
    }
    getTempDocumentBookmarkList(fsPath) {
        let list = this.tempDocumentBookmarks.get(fsPath);
        if (typeof list !== "undefined") {
            return list;
        }
        list = this.bookmarks.filter((bookmark) => { return bookmark.fsPath === fsPath; });
        this.tempDocumentBookmarks.set(fsPath, list);
        return list;
    }
    getTempGroupBookmarkList(group) {
        let list = this.tempGroupBookmarks.get(group);
        if (typeof list !== "undefined") {
            return list;
        }
        list = this.bookmarks.filter((bookmark) => { return bookmark.group === group; });
        this.tempGroupBookmarks.set(group, list);
        return list;
    }
    getTempDocumentDecorationsList(fsPath) {
        let editorDecorations = this.tempDocumentDecorations.get(fsPath);
        if (typeof editorDecorations !== "undefined") {
            return editorDecorations;
        }
        let lineDecorations = new Map();
        let fileBookmarks = this.bookmarks
            .filter((bookmark) => {
            return bookmark.fsPath === fsPath && bookmark.getDecoration !== null;
        });
        fileBookmarks.filter(bookmark => bookmark.group === this.activeGroup)
            .forEach(bookmark => {
            let decoration = bookmark.getDecoration();
            if (decoration !== null) {
                lineDecorations.set(bookmark.lineNumber, decoration);
            }
        });
        fileBookmarks.filter(bookmark => bookmark.group !== this.activeGroup)
            .forEach((bookmark) => {
            let decoration = bookmark.getDecoration();
            if (decoration !== null) {
                if (!lineDecorations.has(bookmark.lineNumber)) {
                    lineDecorations.set(bookmark.lineNumber, decoration);
                }
                else {
                    this.handleDecorationRemoved(decoration);
                }
            }
        });
        editorDecorations = new Map();
        for (let [lineNumber, decoration] of lineDecorations) {
            let ranges = editorDecorations.get(decoration);
            if (typeof ranges === "undefined") {
                ranges = new Array();
                editorDecorations.set(decoration, ranges);
            }
            ranges.push(new vscode_1.Range(lineNumber, 0, lineNumber, 0));
        }
        this.tempDocumentDecorations.set(fsPath, editorDecorations);
        return editorDecorations;
    }
    resetTempLists() {
        this.tempDocumentBookmarks.clear();
        this.tempGroupBookmarks.clear();
        this.tempDocumentDecorations.clear();
    }
    updateBookmarkLineTextInRange(document, bookmarks, firstLine, lastLine) {
        let updateCount = 0;
        bookmarks.filter(bookmark => {
            return bookmark.lineNumber >= firstLine && bookmark.lineNumber <= lastLine;
        }).forEach(bookmark => {
            this.updateBookmarkLineText(document, bookmark);
            updateCount++;
        });
        return updateCount;
    }
    updateBookmarkLineText(document, bookmark) {
        let line = document.lineAt(bookmark.lineNumber);
        bookmark.characterNumber = Math.min(bookmark.characterNumber, line.range.end.character);
        bookmark.lineText = line.text.trim();
    }
    actionDeleteOneBookmark(bookmark) {
        this.deleteBookmark(bookmark);
        this.saveState();
        this.updateDecorations();
        this.treeViewRefreshCallback();
    }
    deleteBookmarksOfFile(fsPath, group) {
        this.bookmarks
            .filter(b => (b.fsPath === fsPath && (group === null || group === b.group)))
            .forEach(b => this.deleteBookmark(b));
        this.saveState();
        this.updateDecorations();
        this.treeViewRefreshCallback();
    }
    deleteBookmark(bookmark) {
        let index = this.bookmarks.indexOf(bookmark);
        if (index < 0) {
            return;
        }
        this.bookmarks.splice(index, 1);
        this.tempDocumentBookmarks.delete(bookmark.fsPath);
        this.tempDocumentDecorations.delete(bookmark.fsPath);
        this.tempGroupBookmarks.delete(bookmark.group);
        let bookmarkDecoration = bookmark.getDecoration();
        if (bookmarkDecoration !== null) {
            this.handleDecorationRemoved(bookmarkDecoration);
            this.handleDecorationRemoved(bookmark.group.decoration);
        }
    }
    relabelBookmark(bookmark) {
        var _a;
        let defaultQuickInputText = (_a = bookmark.label) !== null && _a !== void 0 ? _a : '';
        vscode.window.showInputBox({
            placeHolder: "new bookmark label",
            prompt: "Enter new bookmark label",
            value: defaultQuickInputText,
            valueSelection: [0, defaultQuickInputText.length],
        }).then(input => {
            if (typeof input === "undefined") {
                return;
            }
            let newLabel = input.trim();
            if (newLabel === defaultQuickInputText) {
                return;
            }
            if (newLabel.length === 1) {
                let existingBookmark = this.getTempDocumentBookmarkList(bookmark.fsPath)
                    .find((bm) => {
                    return bm.group === bookmark.group
                        && typeof bm.label !== "undefined"
                        && bm.label === newLabel;
                });
                if (typeof existingBookmark !== "undefined") {
                    this.deleteBookmark(existingBookmark);
                }
            }
            if (newLabel.length === 0) {
                newLabel = undefined;
            }
            let newBookmark = new bookmark_1.Bookmark(bookmark.fsPath, bookmark.lineNumber, bookmark.characterNumber, newLabel, bookmark.lineText, bookmark.group, this.decorationFactory);
            this.deleteBookmark(bookmark);
            this.addNewDecoratedBookmark(newBookmark);
            this.bookmarks.sort(bookmark_1.Bookmark.sortByLocation);
            this.tempDocumentDecorations.delete(bookmark.fsPath);
            this.tempDocumentBookmarks.delete(bookmark.fsPath);
            this.tempGroupBookmarks.delete(this.activeGroup);
            this.saveState();
            this.updateDecorations();
            this.treeViewRefreshCallback();
        });
    }
    renameGroup(group) {
        let defaultQuickInputText = group.name;
        vscode.window.showInputBox({
            placeHolder: "new group name",
            prompt: "Enter new group name",
            value: defaultQuickInputText,
            valueSelection: [0, defaultQuickInputText.length],
        }).then(input => {
            if (typeof input === "undefined") {
                return;
            }
            let newName = input.trim();
            if (newName.length === 0) {
                return;
            }
            if (newName === defaultQuickInputText) {
                return;
            }
            if (newName.length > this.maxGroupNameLength) {
                vscode.window.showErrorMessage("Choose a maximum " +
                    this.maxGroupNameLength +
                    " character long group name.");
                return;
            }
            if (typeof this.groups.find(g => {
                return g !== group && g.name === newName;
            }) !== "undefined") {
                vscode.window.showErrorMessage("The entered bookmark group name is already in use");
                return;
            }
            group.name = newName;
            this.saveState();
            this.treeViewRefreshCallback();
            this.updateStatusBar();
        });
    }
    editorActionToggleBookmark(textEditor) {
        if (textEditor.selections.length === 0) {
            return;
        }
        let documentFsPath = textEditor.document.uri.fsPath;
        for (let selection of textEditor.selections) {
            let lineNumber = selection.start.line;
            let characterNumber = selection.start.character;
            let lineText = textEditor.document.lineAt(lineNumber).text.trim();
            this.toggleBookmark(documentFsPath, lineNumber, characterNumber, lineText, this.activeGroup);
        }
        this.updateDecorations();
        this.treeViewRefreshCallback();
    }
    toggleBookmark(fsPath, lineNumber, characterNumber, lineText, group) {
        let existingBookmark = this.getTempDocumentBookmarkList(fsPath)
            .find((bookmark) => { return bookmark.lineNumber === lineNumber && bookmark.group === group; });
        if (typeof existingBookmark !== "undefined") {
            this.deleteBookmark(existingBookmark);
            this.saveState();
            return;
        }
        let bookmark = new bookmark_1.Bookmark(fsPath, lineNumber, characterNumber, undefined, lineText, group, this.decorationFactory);
        this.bookmarks.push(bookmark);
        this.bookmarks.sort(bookmark_1.Bookmark.sortByLocation);
        this.tempDocumentBookmarks.delete(fsPath);
        this.tempDocumentDecorations.delete(fsPath);
        this.tempGroupBookmarks.delete(group);
        this.saveState();
    }
    editorActionToggleLabeledBookmark(textEditor) {
        if (textEditor.selections.length === 0) {
            return;
        }
        let fsPath = textEditor.document.uri.fsPath;
        let lineNumber = textEditor.selection.start.line;
        let existingBookmark = this.getTempDocumentBookmarkList(fsPath)
            .find((bookmark) => { return bookmark.lineNumber === lineNumber && bookmark.group === this.activeGroup; });
        if (typeof existingBookmark !== "undefined") {
            this.deleteBookmark(existingBookmark);
            this.saveState();
            this.updateDecorations();
            this.treeViewRefreshCallback();
            return;
        }
        let selectedText = textEditor.document.getText(textEditor.selection).trim();
        let firstNlPos = selectedText.indexOf("\n");
        if (firstNlPos >= 0) {
            selectedText = selectedText.substring(0, firstNlPos).trim();
        }
        selectedText = selectedText.replace(/[\s\t\r\n]+/, " ").replace("@", "@\u200b");
        vscode.window.showInputBox({
            placeHolder: "label or label@@group or @@group",
            prompt: "Enter label and/or group to be created",
            value: selectedText,
            valueSelection: [0, selectedText.length],
        }).then(input => {
            if (typeof input === "undefined") {
                return;
            }
            input = input.trim();
            if (input === "") {
                return;
            }
            let label = "";
            let groupName = "";
            let separatorPos = input.indexOf('@@');
            if (separatorPos >= 0) {
                label = input.substring(0, separatorPos).trim();
                groupName = input.substring(separatorPos + 2).trim();
            }
            else {
                label = input.replace("@\u200b", "@");
            }
            if (label === "" && groupName === "") {
                return;
            }
            if (groupName.length > this.maxGroupNameLength) {
                vscode.window.showErrorMessage("Choose a maximum " +
                    this.maxGroupNameLength +
                    " character long group name.");
                return;
            }
            if (groupName !== "") {
                this.activateGroup(groupName);
            }
            if (label.length === 1) {
                let existingLabeledBookmark = this.getTempDocumentBookmarkList(fsPath)
                    .find((bookmark) => {
                    return bookmark.group === this.activeGroup
                        && typeof bookmark.label !== "undefined"
                        && bookmark.label === label;
                });
                if (typeof existingLabeledBookmark !== "undefined") {
                    this.deleteBookmark(existingLabeledBookmark);
                }
            }
            if (label !== "") {
                let characterNumber = textEditor.selection.start.character;
                let lineText = textEditor.document.lineAt(lineNumber).text.trim();
                let bookmark = new bookmark_1.Bookmark(fsPath, lineNumber, characterNumber, label, lineText, this.activeGroup, this.decorationFactory);
                this.addNewDecoratedBookmark(bookmark);
                this.bookmarks.sort(bookmark_1.Bookmark.sortByLocation);
            }
            this.tempDocumentDecorations.delete(fsPath);
            this.tempDocumentBookmarks.delete(fsPath);
            this.tempGroupBookmarks.delete(this.activeGroup);
            this.saveState();
            this.updateDecorations();
            this.treeViewRefreshCallback();
        });
    }
    editorActionnavigateToNextBookmark(textEditor) {
        if (textEditor.selections.length === 0) {
            return;
        }
        let documentFsPath = textEditor.document.uri.fsPath;
        let lineNumber = textEditor.selection.start.line;
        let nextBookmark = this.nextBookmark(documentFsPath, lineNumber);
        if (typeof nextBookmark === "undefined") {
            return;
        }
        this.jumpToBookmark(nextBookmark);
    }
    nextBookmark(fsPath, line) {
        let brokenBookmarkCount = 0;
        let groupBookmarkList = this.getTempGroupBookmarkList(this.activeGroup);
        let firstCandidate = groupBookmarkList.find((bookmark, i) => {
            if (bookmark.failedJump) {
                brokenBookmarkCount++;
                return false;
            }
            let fileComparisonResult = bookmark.fsPath.localeCompare(fsPath);
            if (fileComparisonResult < 0) {
                return false;
            }
            if (fileComparisonResult > 0) {
                return true;
            }
            return line < bookmark.lineNumber;
        });
        if (typeof firstCandidate === "undefined" && groupBookmarkList.length > 0) {
            if (groupBookmarkList.length > brokenBookmarkCount) {
                for (let bookmark of groupBookmarkList) {
                    if (!bookmark.failedJump) {
                        return bookmark;
                    }
                }
            }
            vscode.window.showWarningMessage("All bookmarks are broken, time for some cleanup");
        }
        return firstCandidate;
    }
    editorActionNavigateToPreviousBookmark(textEditor) {
        if (textEditor.selections.length === 0) {
            return;
        }
        let documentFsPath = textEditor.document.uri.fsPath;
        let lineNumber = textEditor.selection.start.line;
        let previousBookmark = this.previousBookmark(documentFsPath, lineNumber);
        if (typeof previousBookmark === "undefined") {
            return;
        }
        this.jumpToBookmark(previousBookmark);
    }
    previousBookmark(fsPath, line) {
        let brokenBookmarkCount = 0;
        let groupBookmarkList = this.getTempGroupBookmarkList(this.activeGroup);
        let firstCandidate;
        for (let i = groupBookmarkList.length - 1; i >= 0; i--) {
            let bookmark = groupBookmarkList[i];
            if (bookmark.failedJump) {
                brokenBookmarkCount++;
                continue;
            }
            let fileComparisonResult = bookmark.fsPath.localeCompare(fsPath);
            if (fileComparisonResult > 0) {
                continue;
            }
            if (fileComparisonResult < 0) {
                firstCandidate = bookmark;
                break;
            }
            if (bookmark.lineNumber < line) {
                firstCandidate = bookmark;
                break;
            }
        }
        if (typeof firstCandidate === "undefined" && groupBookmarkList.length > 0) {
            if (groupBookmarkList.length > brokenBookmarkCount) {
                for (let i = groupBookmarkList.length - 1; i >= 0; i--) {
                    if (!groupBookmarkList[i].failedJump) {
                        return groupBookmarkList[i];
                    }
                }
            }
            vscode.window.showWarningMessage("All bookmarks are broken, time for some cleanup");
        }
        return firstCandidate;
    }
    actionExpandSelectionToNextBookmark(editor) {
        let bookmarks = this.getTempDocumentBookmarkList(editor.document.uri.fsPath);
        if (typeof bookmarks === "undefined") {
            return;
        }
        let selection = editor.selection;
        let endLineRange = editor.document.lineAt(selection.end.line).range;
        let selectionEndsAtLineEnd = selection.end.character >= endLineRange.end.character;
        let searchFromLine = selection.end.line;
        if (selectionEndsAtLineEnd) {
            searchFromLine++;
        }
        let nextBookmark = bookmarks.find(bookmark => {
            return bookmark.group === this.activeGroup && bookmark.lineNumber >= searchFromLine;
        });
        if (typeof nextBookmark === "undefined") {
            return;
        }
        let newSelectionEndCharacter;
        if (nextBookmark.lineNumber === selection.end.line) {
            newSelectionEndCharacter = endLineRange.end.character;
        }
        else {
            newSelectionEndCharacter = 0;
        }
        editor.selection = new vscode_1.Selection(selection.start.line, selection.start.character, nextBookmark.lineNumber, newSelectionEndCharacter);
        editor.revealRange(new vscode_1.Range(nextBookmark.lineNumber, newSelectionEndCharacter, nextBookmark.lineNumber, newSelectionEndCharacter));
    }
    actionExpandSelectionToPreviousBookmark(editor) {
        let bookmarks = this.getTempDocumentBookmarkList(editor.document.uri.fsPath);
        if (typeof bookmarks === "undefined") {
            return;
        }
        let selection = editor.selection;
        let startLineRange = editor.document.lineAt(selection.start.line).range;
        let selectionStartsAtLineStart = selection.start.character === 0;
        let searchFromLine = selection.start.line;
        if (selectionStartsAtLineStart) {
            searchFromLine--;
        }
        let nextBookmark;
        for (let i = bookmarks.length - 1; i >= 0; i--) {
            if (bookmarks[i].group === this.activeGroup && bookmarks[i].lineNumber <= searchFromLine) {
                nextBookmark = bookmarks[i];
                break;
            }
        }
        if (typeof nextBookmark === "undefined") {
            return;
        }
        let newSelectionStartCharacter;
        if (nextBookmark.lineNumber === selection.start.line) {
            newSelectionStartCharacter = 0;
        }
        else {
            newSelectionStartCharacter = editor.document.lineAt(nextBookmark.lineNumber).range.end.character;
        }
        editor.selection = new vscode_1.Selection(nextBookmark.lineNumber, newSelectionStartCharacter, selection.end.line, selection.end.character);
        editor.revealRange(new vscode_1.Range(nextBookmark.lineNumber, newSelectionStartCharacter, nextBookmark.lineNumber, newSelectionStartCharacter));
    }
    actionNavigateToBookmark() {
        this.navigateBookmarkList("navigate to bookmark", this.getTempGroupBookmarkList(this.activeGroup), false);
    }
    actionNavigateToBookmarkOfAnyGroup() {
        this.navigateBookmarkList("navigate to bookmark of any bookmark group", this.bookmarks, true);
    }
    navigateBookmarkList(placeholderText, bookmarks, withGroupNames) {
        let currentEditor = vscode.window.activeTextEditor;
        let currentDocument;
        let currentSelection;
        if (typeof currentEditor !== "undefined") {
            currentSelection = currentEditor.selection;
            currentDocument = currentEditor.document;
        }
        let didNavigateBeforeClosing = false;
        let pickItems = bookmarks.map(bookmark => bookmark_pick_item_1.BookmarkPickItem.fromBookmark(bookmark, withGroupNames));
        vscode.window.showQuickPick(pickItems, {
            canPickMany: false,
            matchOnDescription: true,
            placeHolder: placeholderText,
            ignoreFocusOut: true,
            onDidSelectItem: (selected) => {
                didNavigateBeforeClosing = true;
                this.jumpToBookmark(selected.bookmark, true);
            }
        }).then(selected => {
            if (typeof selected !== "undefined") {
                this.jumpToBookmark(selected.bookmark);
                return;
            }
            if (!didNavigateBeforeClosing) {
                return;
            }
            if (typeof currentDocument === "undefined"
                || typeof currentSelection === "undefined"
                || currentDocument === null
                || currentSelection === null) {
                return;
            }
            vscode.window.showTextDocument(currentDocument, { preview: false }).then(textEditor => {
                try {
                    textEditor.selection = currentSelection;
                    textEditor.revealRange(new vscode_1.Range(currentSelection.start, currentSelection.end));
                }
                catch (e) {
                    vscode.window.showWarningMessage("Failed to navigate to origin (1): " + e);
                    return;
                }
            }, rejectReason => {
                vscode.window.showWarningMessage("Failed to navigate to origin (2): " + rejectReason.message);
            });
        });
    }
    actionSetGroupIconShape() {
        let iconText = this.activeGroup.iconText;
        let shapePickItems = new Array();
        for (let [label, id] of this.shapes) {
            label = (this.activeGroup.shape === id ? "● " : "◌ ") + label;
            shapePickItems.push(new shape_pick_item_1.ShapePickItem(id, iconText, label, "vector", ""));
        }
        for (let [name, marker] of this.unicodeMarkers) {
            let label = (this.activeGroup.shape === "unicode" && this.activeGroup.iconText === marker ? "● " : "◌ ");
            label += marker + " " + name;
            shapePickItems.push(new shape_pick_item_1.ShapePickItem("unicode", marker, label, "unicode", ""));
        }
        vscode.window.showQuickPick(shapePickItems, {
            canPickMany: false,
            matchOnDescription: false,
            placeHolder: "select bookmark group icon shape"
        }).then(selected => {
            if (typeof selected !== "undefined") {
                let shape = selected.shape;
                let iconText = selected.iconText;
                this.activeGroup.setShapeAndIconText(shape, iconText);
                this.saveState();
            }
        });
    }
    actionSetGroupIconColor() {
        let colorPickItems = new Array();
        for (let [name, color] of this.colors) {
            let label = (this.activeGroup.color === color ? "● " : "◌ ") + name;
            colorPickItems.push(new color_pick_item_1.ColorPickItem(color, label, "", ""));
        }
        vscode.window.showQuickPick(colorPickItems, {
            canPickMany: false,
            matchOnDescription: false,
            placeHolder: "select bookmark group icon color"
        }).then(selected => {
            if (typeof selected !== "undefined") {
                let color = selected.color;
                this.activeGroup.setColor(color);
                this.saveState();
            }
        });
    }
    actionSelectGroup() {
        let pickItems = this.groups.map(group => group_pick_item_1.GroupPickItem.fromGroup(group, this.getTempGroupBookmarkList(group).length));
        vscode.window.showQuickPick(pickItems, {
            canPickMany: false,
            matchOnDescription: false,
            placeHolder: "select bookmark group"
        }).then(selected => {
            if (typeof selected !== "undefined") {
                this.setActiveGroup(selected.group.name);
            }
        });
    }
    setActiveGroup(groupName) {
        this.activateGroup(groupName);
        this.updateDecorations();
        this.saveState();
    }
    actionAddGroup() {
        vscode.window.showInputBox({
            placeHolder: "group name",
            prompt: "Enter group name to create or switch to"
        }).then(groupName => {
            if (typeof groupName === "undefined") {
                return;
            }
            groupName = groupName.trim();
            if (groupName === "") {
                return;
            }
            if (groupName.length > this.maxGroupNameLength) {
                vscode.window.showErrorMessage("Choose a maximum " +
                    this.maxGroupNameLength +
                    " character long group name.");
                return;
            }
            this.activateGroup(groupName);
            this.updateDecorations();
            this.saveState();
            this.treeViewRefreshCallback();
        });
    }
    actionDeleteGroup() {
        let pickItems = this.groups.map(group => group_pick_item_1.GroupPickItem.fromGroup(group, this.getTempGroupBookmarkList(group).length));
        vscode.window.showQuickPick(pickItems, {
            canPickMany: true,
            matchOnDescription: false,
            placeHolder: "select bookmark groups to be deleted"
        }).then(selecteds => {
            if (typeof selecteds !== "undefined") {
                this.deleteGroups(selecteds.map(pickItem => pickItem.group));
            }
        });
    }
    actionDeleteOneGroup(group) {
        this.deleteGroups([group]);
    }
    deleteGroups(groups) {
        let wasActiveGroupDeleted = false;
        for (let group of groups) {
            wasActiveGroupDeleted || (wasActiveGroupDeleted = group === this.activeGroup);
            this.getTempGroupBookmarkList(group).forEach(bookmark => {
                this.deleteBookmark(bookmark);
            });
            let index = this.groups.indexOf(group);
            if (index >= 0) {
                this.groups.splice(index, 1);
            }
            group.removeDecorations();
            this.tempGroupBookmarks.delete(group);
        }
        if (this.groups.length === 0) {
            this.activateGroup(this.defaultGroupName);
        }
        else if (wasActiveGroupDeleted) {
            this.activateGroup(this.groups[0].name);
        }
        this.updateDecorations();
        this.saveState();
        this.treeViewRefreshCallback();
    }
    actionDeleteBookmark() {
        let currentEditor = vscode.window.activeTextEditor;
        let currentDocument;
        let currentSelection;
        if (typeof currentEditor !== "undefined") {
            currentSelection = currentEditor.selection;
            currentDocument = currentEditor.document;
        }
        let didNavigateBeforeClosing = false;
        let pickItems = this.getTempGroupBookmarkList(this.activeGroup).map(bookmark => bookmark_pick_item_1.BookmarkPickItem.fromBookmark(bookmark, false));
        vscode.window.showQuickPick(pickItems, {
            canPickMany: true,
            matchOnDescription: false,
            placeHolder: "select bookmarks to be deleted",
            ignoreFocusOut: true,
            onDidSelectItem: (selected) => {
                didNavigateBeforeClosing = true;
                this.jumpToBookmark(selected.bookmark, true);
            }
        }).then(selecteds => {
            if (typeof selecteds !== "undefined") {
                for (let selected of selecteds) {
                    this.deleteBookmark(selected.bookmark);
                }
                this.updateDecorations();
                this.saveState();
                this.treeViewRefreshCallback();
            }
            if (!didNavigateBeforeClosing) {
                return;
            }
            if (typeof currentDocument === "undefined"
                || typeof currentSelection === "undefined"
                || currentDocument === null
                || currentSelection === null) {
                return;
            }
            vscode.window.showTextDocument(currentDocument, { preview: false }).then(textEditor => {
                try {
                    textEditor.selection = currentSelection;
                    textEditor.revealRange(new vscode_1.Range(currentSelection.start, currentSelection.end));
                }
                catch (e) {
                    vscode.window.showWarningMessage("Failed to navigate to origin (1): " + e);
                    return;
                }
            }, rejectReason => {
                vscode.window.showWarningMessage("Failed to navigate to origin (2): " + rejectReason.message);
            });
        });
    }
    actionToggleHideAll() {
        this.setHideAll(!this.hideAll);
        this.updateDecorations();
        this.saveState();
    }
    actionToggleHideInactiveGroups() {
        this.setHideInactiveGroups(!this.hideInactiveGroups);
        this.updateDecorations();
        this.saveState();
    }
    actionClearFailedJumpFlags() {
        let clearedFlagCount = 0;
        for (let bookmark of this.bookmarks) {
            if (bookmark.failedJump) {
                bookmark.failedJump = false;
                clearedFlagCount++;
            }
        }
        vscode.window.showInformationMessage("Cleared broken bookmark flags: " + clearedFlagCount);
        this.saveState();
    }
    actionMoveBookmarksFromActiveGroup() {
        let pickItems = this.groups.filter(g => g !== this.activeGroup).map(group => group_pick_item_1.GroupPickItem.fromGroup(group, this.getTempGroupBookmarkList(group).length));
        if (pickItems.length === 0) {
            vscode.window.showWarningMessage("There is no other group to move bookmarks into");
            return;
        }
        vscode.window.showQuickPick(pickItems, {
            canPickMany: false,
            matchOnDescription: false,
            placeHolder: "select destination group to move bookmarks into"
        }).then(selected => {
            if (typeof selected !== "undefined") {
                this.moveBookmarksBetween(this.activeGroup, selected.group);
            }
        });
    }
    moveBookmarksBetween(src, dst) {
        let pickItems = this.getTempGroupBookmarkList(src).map(bookmark => bookmark_pick_item_1.BookmarkPickItem.fromBookmark(bookmark, false));
        vscode.window.showQuickPick(pickItems, {
            canPickMany: true,
            matchOnDescription: false,
            placeHolder: "move bookmarks from " + src.name + " into " + dst.name,
            ignoreFocusOut: true,
        }).then(selecteds => {
            if (typeof selecteds !== "undefined") {
                for (let selected of selecteds) {
                    let oldBookmark = selected.bookmark;
                    this.deleteBookmark(oldBookmark);
                    let newBookmark = new bookmark_1.Bookmark(oldBookmark.fsPath, oldBookmark.lineNumber, oldBookmark.characterNumber, oldBookmark.label, oldBookmark.lineText, dst, this.decorationFactory);
                    this.addNewDecoratedBookmark(newBookmark);
                    this.tempDocumentDecorations.delete(newBookmark.fsPath);
                    this.tempDocumentBookmarks.delete(newBookmark.fsPath);
                    this.tempGroupBookmarks.delete(newBookmark.group);
                }
                this.bookmarks.sort(bookmark_1.Bookmark.sortByLocation);
                this.saveState();
                this.updateDecorations();
                this.treeViewRefreshCallback();
            }
        });
    }
    readSettings() {
        var _a, _b, _c;
        let defaultDefaultShape = "bookmark";
        let config = vscode.workspace.getConfiguration(this.configRoot);
        if (config.has(this.configKeyColors)) {
            try {
                let configColors = config.get(this.configKeyColors);
                this.colors = new Map();
                for (let [index, value] of configColors) {
                    this.colors.set(index, this.decorationFactory.normalizeColorFormat(value));
                }
            }
            catch (e) {
                vscode.window.showWarningMessage("Error reading bookmark color setting");
            }
        }
        if (config.has(this.configKeyUnicodeMarkers)) {
            try {
                let configMarkers = config.get(this.configKeyUnicodeMarkers);
                this.unicodeMarkers = new Map();
                for (let [index, value] of configMarkers) {
                    this.unicodeMarkers.set(index, value);
                }
            }
            catch (e) {
                vscode.window.showWarningMessage("Error reading bookmark unicode marker setting");
            }
        }
        if (config.has(this.configKeyDefaultShape)) {
            let configDefaultShape = (_a = config.get(this.configKeyDefaultShape)) !== null && _a !== void 0 ? _a : "";
            if (this.shapes.has(configDefaultShape)) {
                this.defaultShape = configDefaultShape;
            }
            else {
                vscode.window.showWarningMessage("Error reading bookmark default shape setting, using default");
                this.defaultShape = defaultDefaultShape;
            }
        }
        else {
            this.defaultShape = defaultDefaultShape;
        }
        let configOverviewRulerLane = (_b = config.get(this.configOverviewRulerLane)) !== null && _b !== void 0 ? _b : "center";
        let previousOverviewRulerLane = this.decorationFactory.overviewRulerLane;
        let newOverviewRulerLane;
        switch (configOverviewRulerLane) {
            case "center":
                newOverviewRulerLane = vscode_1.OverviewRulerLane.Center;
                break;
            case "full":
                newOverviewRulerLane = vscode_1.OverviewRulerLane.Full;
                break;
            case "left":
                newOverviewRulerLane = vscode_1.OverviewRulerLane.Left;
                break;
            case "right":
                newOverviewRulerLane = vscode_1.OverviewRulerLane.Right;
                break;
            default:
                newOverviewRulerLane = undefined;
        }
        let newLineEndLabelType = (_c = config.get(this.configLineEndLabelType)) !== null && _c !== void 0 ? _c : "bordered";
        let previousLineEndLabelType = this.decorationFactory.lineEndLabelType;
        if ((typeof previousOverviewRulerLane === "undefined") !== (typeof newOverviewRulerLane === "undefined")
            || previousOverviewRulerLane !== newOverviewRulerLane
            || (typeof previousLineEndLabelType === "undefined") !== (typeof newLineEndLabelType === "undefined")
            || previousLineEndLabelType !== newLineEndLabelType) {
            this.decorationFactory.overviewRulerLane = newOverviewRulerLane;
            this.decorationFactory.lineEndLabelType = newLineEndLabelType;
            this.groups.forEach(group => group.redoDecorations());
            this.bookmarks.forEach(bookmark => bookmark.initDecoration());
        }
    }
    onFilesRenamed(fileRenamedEvent) {
        return __awaiter(this, void 0, void 0, function* () {
            let changedFiles = new Map();
            for (let rename of fileRenamedEvent.files) {
                let stat = yield vscode.workspace.fs.stat(rename.newUri);
                let oldFsPath = rename.oldUri.fsPath;
                let newFsPath = rename.newUri.fsPath;
                if ((stat.type & vscode.FileType.Directory) > 0) {
                    for (let bookmark of this.bookmarks) {
                        if (bookmark.fsPath.startsWith(oldFsPath)) {
                            let originalBookmarkFsPath = bookmark.fsPath;
                            bookmark.fsPath = newFsPath + bookmark.fsPath.substring(oldFsPath.length);
                            changedFiles.set(originalBookmarkFsPath, true);
                            changedFiles.set(bookmark.fsPath, true);
                        }
                    }
                }
                else {
                    for (let bookmark of this.bookmarks) {
                        if (bookmark.fsPath === oldFsPath) {
                            bookmark.fsPath = newFsPath;
                            changedFiles.set(oldFsPath, true);
                            changedFiles.set(newFsPath, true);
                        }
                    }
                }
            }
            for (let [changedFile, b] of changedFiles) {
                this.tempDocumentBookmarks.delete(changedFile);
                this.tempDocumentDecorations.delete(changedFile);
            }
            if (changedFiles.size > 0) {
                this.saveState();
                this.updateDecorations();
                this.treeViewRefreshCallback();
            }
        });
    }
    onFilesDeleted(fileDeleteEvent) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let uri of fileDeleteEvent.files) {
                let deletedFsPath = uri.fsPath;
                let changesWereMade = false;
                for (let bookmark of this.bookmarks) {
                    if (bookmark.fsPath === deletedFsPath) {
                        this.deleteBookmark(bookmark);
                        changesWereMade = true;
                    }
                }
                if (changesWereMade) {
                    this.saveState();
                    this.updateDecorations();
                    this.treeViewRefreshCallback();
                }
            }
        });
    }
    updateStatusBar() {
        this.statusBarItem.text = "$(bookmark) "
            + this.activeGroup.name
            + ": "
            + this.getTempGroupBookmarkList(this.activeGroup).length;
        let hideStatus = "";
        if (this.hideAll) {
            hideStatus = ", all hidden";
        }
        else if (this.hideInactiveGroups) {
            hideStatus = ", inactive groups hidden";
        }
        else {
            hideStatus = ", all visible";
        }
        this.statusBarItem.tooltip = this.groups.length + " group(s)" + hideStatus;
    }
    restoreSavedState() {
        var _a, _b, _c;
        this.hideInactiveGroups = (_a = this.ctx.workspaceState.get(this.savedHideInactiveGroupsKey)) !== null && _a !== void 0 ? _a : false;
        this.hideAll = (_b = this.ctx.workspaceState.get(this.savedHideAllKey)) !== null && _b !== void 0 ? _b : false;
        let activeGroupName = (_c = this.ctx.workspaceState.get(this.savedActiveGroupKey)) !== null && _c !== void 0 ? _c : this.defaultGroupName;
        let serializedGroups = this.ctx.workspaceState.get(this.savedGroupsKey);
        this.groups = new Array();
        if (typeof serializedGroups !== "undefined") {
            try {
                for (let sg of serializedGroups) {
                    this.addNewGroup(group_1.Group.fromSerializableGroup(sg, this.decorationFactory));
                }
                this.groups.sort(group_1.Group.sortByName);
            }
            catch (e) {
                vscode.window.showErrorMessage("Restoring bookmark groups failed (" + e + ")");
            }
        }
        let serializedBookmarks = this.ctx.workspaceState.get(this.savedBookmarksKey);
        this.bookmarks = new Array();
        if (typeof serializedBookmarks !== "undefined") {
            try {
                for (let sb of serializedBookmarks) {
                    let bookmark = bookmark_1.Bookmark.fromSerializableBookMark(sb, this.getGroupByName.bind(this), this.decorationFactory);
                    this.addNewDecoratedBookmark(bookmark);
                }
                this.bookmarks.sort(bookmark_1.Bookmark.sortByLocation);
            }
            catch (e) {
                vscode.window.showErrorMessage("Restoring bookmarks failed (" + e + ")");
            }
        }
        this.resetTempLists();
        this.activateGroup(activeGroupName);
    }
    addNewGroup(group) {
        group.onGroupDecorationUpdated(this.handleGroupDecorationUpdated.bind(this));
        group.onGroupDecorationSwitched(this.handleGroupDecorationSwitched.bind(this));
        group.onDecorationRemoved(this.handleDecorationRemoved.bind(this));
        group.initDecorations();
        this.groups.push(group);
    }
    addNewDecoratedBookmark(bookmark) {
        bookmark.onBookmarkDecorationUpdated(this.handleBookmarkDecorationUpdated.bind(this));
        bookmark.onDecorationRemoved(this.handleDecorationRemoved.bind(this));
        bookmark.initDecoration();
        this.bookmarks.push(bookmark);
    }
    activateGroup(name) {
        let newActiveGroup = this.ensureGroup(name);
        if (newActiveGroup === this.activeGroup) {
            return;
        }
        this.activeGroup.setIsActive(false);
        this.activeGroup = newActiveGroup;
        newActiveGroup.setIsActive(true);
        this.setGroupVisibilities();
        this.tempDocumentDecorations.clear();
    }
    setGroupVisibilities() {
        this.groups.forEach(group => {
            group.setIsVisible(!this.hideAll && (!this.hideInactiveGroups || group.isActive));
        });
    }
    ensureGroup(name) {
        let group = this.groups.find((group) => {
            return group.name === name;
        });
        if (typeof group !== "undefined") {
            return group;
        }
        group = new group_1.Group(name, this.getLeastUsedColor(), this.defaultShape, name, this.decorationFactory);
        this.addNewGroup(group);
        this.groups.sort(group_1.Group.sortByName);
        return group;
    }
    getLeastUsedColor() {
        var _a;
        if (this.colors.size < 1) {
            return this.fallbackColor;
        }
        let usages = new Map();
        for (let [index, color] of this.colors) {
            usages.set(color, 0);
        }
        for (let group of this.groups) {
            let groupColor = group.getColor();
            if (usages.has(groupColor)) {
                usages.set(groupColor, ((_a = usages.get(groupColor)) !== null && _a !== void 0 ? _a : 0) + 1);
            }
        }
        let minUsage = Number.MAX_SAFE_INTEGER;
        let leastUsedColor = "";
        for (let [key, value] of usages) {
            if (minUsage > value) {
                minUsage = value;
                leastUsedColor = key;
            }
        }
        return leastUsedColor;
    }
    setHideInactiveGroups(hideInactiveGroups) {
        if (this.hideInactiveGroups === hideInactiveGroups) {
            return;
        }
        this.hideInactiveGroups = hideInactiveGroups;
        this.setGroupVisibilities();
        this.tempDocumentDecorations.clear();
    }
    setHideAll(hideAll) {
        if (this.hideAll === hideAll) {
            return;
        }
        this.hideAll = hideAll;
        this.setGroupVisibilities();
        this.tempDocumentDecorations.clear();
    }
    getNlCount(text) {
        let nlCount = 0;
        for (let c of text) {
            nlCount += (c === "\n") ? 1 : 0;
        }
        return nlCount;
    }
    getFirstLine(text) {
        let firstNewLinePos = text.indexOf("\n");
        if (firstNewLinePos < 0) {
            return text;
        }
        return text.substring(0, firstNewLinePos + 1);
    }
    getLastLine(text) {
        let lastNewLinePos = text.lastIndexOf("\n");
        if (lastNewLinePos < 0) {
            return text;
        }
        return text.substring(lastNewLinePos + 1);
    }
    jumpToBookmark(bookmark, preview = false) {
        vscode.window.showTextDocument(vscode.Uri.file(bookmark.fsPath), { preview: preview, preserveFocus: preview }).then(textEditor => {
            try {
                let range = new vscode_1.Range(bookmark.lineNumber, bookmark.characterNumber, bookmark.lineNumber, bookmark.characterNumber);
                textEditor.selection = new vscode.Selection(range.start, range.start);
                textEditor.revealRange(range);
            }
            catch (e) {
                bookmark.failedJump = true;
                vscode.window.showWarningMessage("Failed to navigate to bookmark (3): " + e);
                return;
            }
            bookmark.failedJump = false;
        }, rejectReason => {
            bookmark.failedJump = true;
            vscode.window.showWarningMessage("Failed to navigate to bookmark (2): " + rejectReason.message);
        });
    }
    getNearestActiveBookmarkInFile(textEditor, group) {
        if (textEditor.selections.length === 0) {
            return null;
        }
        let fsPath = textEditor.document.uri.fsPath;
        let lineNumber = textEditor.selection.start.line;
        let nearestBeforeLine = -1;
        let nearestBefore = null;
        let nearestAfterline = Number.MAX_SAFE_INTEGER;
        let nearestAfter = null;
        this.getTempDocumentBookmarkList(fsPath)
            .filter(g => (group === null || g.group === group))
            .forEach(bookmark => {
            if (bookmark.lineNumber > nearestBeforeLine && bookmark.lineNumber <= lineNumber) {
                nearestBeforeLine = bookmark.lineNumber;
                nearestBefore = bookmark;
            }
            if (bookmark.lineNumber < nearestAfterline && bookmark.lineNumber >= lineNumber) {
                nearestAfterline = bookmark.lineNumber;
                nearestAfter = bookmark;
            }
        });
        if (nearestBefore === null && nearestAfter === null) {
            return null;
        }
        if (nearestBefore !== null && nearestAfter !== null) {
            if (lineNumber - nearestBeforeLine < nearestAfterline - lineNumber) {
                return nearestBefore;
            }
            return nearestAfter;
        }
        if (nearestBefore !== null) {
            return nearestBefore;
        }
        return nearestAfter;
    }
}
exports.Main = Main;
//# sourceMappingURL=main.js.map
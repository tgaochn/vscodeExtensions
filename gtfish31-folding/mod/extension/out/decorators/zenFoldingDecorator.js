"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const betterFoldingDecorator_1 = require("./betterFoldingDecorator");
const constants_1 = require("../constants");
const bookmarksManager_1 = require("../utils/classes/bookmarksManager");
const foldedLinesManager_1 = require("../utils/classes/foldedLinesManager");
class ZenFoldingDecorator extends betterFoldingDecorator_1.default {
    constructor() {
        super();
        this.bookmarksManager = new bookmarksManager_1.BookmarksManager();
        this.zenFoldingDecoration = vscode_1.window.createTextEditorDecorationType(this.newDecorationOptions(constants_1.DEFAULT_COLLAPSED_TEXT));
    }
    onChange(change) {
        this.bookmarksManager.onChange(change);
    }
    //TODO: clean this up
    updateEditorDecorations(editor) {
        editor.setDecorations(this.zenFoldingDecoration, []);
        if (!editor.visibleRanges.length)
            return;
        const zenLines = this.bookmarksManager.bookmarks.map((b) => b.line);
        const lastVisibleLine = editor.visibleRanges[editor.visibleRanges.length - 1].end.line;
        const cachedFoldedLines = foldedLinesManager_1.default.getFoldedLines(editor);
        const zenFoldedLines = zenLines.filter((line) => cachedFoldedLines?.has(line) || line === lastVisibleLine);
        const decorationRanges = zenFoldedLines.map((line) => new vscode_1.Range(line, 0, line, editor.document.lineAt(line).text.length));
        editor.setDecorations(this.zenFoldingDecoration, decorationRanges);
    }
    //TODO: clean this up
    async createZenFoldsAroundSelection() {
        const editor = vscode_1.window.activeTextEditor;
        if (!editor)
            return;
        const { document } = editor;
        const originalSelection = editor.selection;
        const selectionsToFold = [];
        if (originalSelection.start.line > 0) {
            const firstLine = 0;
            let lastLine = originalSelection.start.line - 1;
            while (lastLine > firstLine + 1 && document.lineAt(lastLine).text.length === 0)
                lastLine--;
            const selectionAbove = new vscode_1.Selection(firstLine, 0, lastLine, document.lineAt(lastLine).text.length);
            selectionsToFold.push(selectionAbove);
        }
        if (originalSelection.end.line < document.lineCount - 1) {
            let firstLine = originalSelection.end.line + 1;
            const lastLine = document.lineCount - 1;
            while (firstLine < lastLine - 1 && document.lineAt(firstLine).text.length === 0)
                firstLine++;
            const selectionAbove = new vscode_1.Selection(firstLine, 0, lastLine, document.lineAt(lastLine).text.length);
            selectionsToFold.push(selectionAbove);
        }
        editor.selections = selectionsToFold;
        for (const selection of selectionsToFold) {
            const firstLine = selection.start.line;
            const endOfFirstLinePosition = new vscode_1.Position(firstLine, document.lineAt(firstLine).text.length);
            this.bookmarksManager.addBookmark(editor, endOfFirstLinePosition);
        }
        await vscode_1.commands.executeCommand("editor.createFoldingRangeFromSelection");
        editor.selection = originalSelection;
    }
    //TODO: clean this up
    async clearZenFolds() {
        const editor = vscode_1.window.activeTextEditor;
        if (!editor)
            return;
        const selection = editor.selection;
        const manualFoldsSelections = this.bookmarksManager.bookmarks.map((b) => new vscode_1.Selection(b.line, 0, b.line, 0));
        editor.selections = manualFoldsSelections;
        await vscode_1.commands.executeCommand("editor.removeManualFoldingRanges");
        this.bookmarksManager.bookmarks = [];
        editor.setDecorations(this.zenFoldingDecoration, []);
        editor.selection = selection;
        await vscode_1.commands.executeCommand("revealLine", { lineNumber: selection.start.line, at: "center" });
    }
    dispose() {
        this.zenFoldingDecoration.dispose();
    }
}
exports.default = ZenFoldingDecorator;
//# sourceMappingURL=zenFoldingDecorator.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const extendedMap_1 = require("./extendedMap");
/**
 * Util class to manage folded lines since vscode does not provide a way to tell if a line is folded or not.
 */
class FoldedLinesManager {
    constructor() {
        this.cachedFoldedLines = new extendedMap_1.default(() => new Set());
    }
    static get instance() {
        this._instance = this._instance ? this._instance : new FoldedLinesManager();
        return this._instance;
    }
    updateAllFoldedLines() {
        for (const editor of vscode_1.window.visibleTextEditors) {
            this.updateFoldedLines(editor);
        }
    }
    updateFoldedLines(editor) {
        const { visibleRanges } = editor;
        if (visibleRanges.length === 0)
            return;
        let cachedLines = this.getFoldedLines(editor);
        const currentFoldedLines = visibleRanges.slice(0, -1).map((range) => range.end.line);
        if (cachedLines.size === 0) {
            this.setFoldedLines(editor, new Set(currentFoldedLines));
            return;
        }
        this.matchFoldedLines(cachedLines, currentFoldedLines);
        this.matchUnfoldedLines(cachedLines, currentFoldedLines, visibleRanges);
        this.setFoldedLines(editor, cachedLines);
    }
    matchFoldedLines(cachedLines, currentFoldedLines) {
        currentFoldedLines.forEach((line) => cachedLines.add(line));
    }
    matchUnfoldedLines(cachedLines, currentFoldedLines, visibleRanges) {
        const foldedLinesSet = new Set(currentFoldedLines);
        const isVisible = (l) => l >= visibleRanges[0].start.line && l < visibleRanges.at(-1).end.line;
        for (const line of cachedLines) {
            if (isVisible(line) && !foldedLinesSet.has(line))
                cachedLines.delete(line);
        }
    }
    isFolded(range, editor) {
        const cachedLines = this.getFoldedLines(editor);
        if (cachedLines.has(range.start.line))
            return true;
        return this.checkRangeAtEndOfDocumentCase(range, editor);
    }
    //TODO: clean this up.
    //Band-aid fix because vscode does not provide a visible range if last folded line is the last line in document.
    checkRangeAtEndOfDocumentCase(range, editor) {
        const lastLine = editor.document.lineCount - 1;
        const justBeforeLastLine = lastLine - 1;
        const rangeAtEndOfDocument = range.end.line === lastLine || range.end.line === justBeforeLastLine;
        const lastVisibleLine = editor.visibleRanges[editor.visibleRanges.length - 1].end.line;
        if (rangeAtEndOfDocument && lastVisibleLine <= range.start.line) {
            this.getFoldedLines(editor).add(range.start.line);
            return true;
        }
        this.getFoldedLines(editor).delete(range.start.line);
        return false;
    }
    getFoldedLines(editor) {
        return this.cachedFoldedLines.get(editor.document.uri);
    }
    setFoldedLines(editor, lines) {
        this.cachedFoldedLines.set(editor.document.uri, lines);
    }
}
exports.default = FoldedLinesManager.instance;
//# sourceMappingURL=foldedLinesManager.js.map
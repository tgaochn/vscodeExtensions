'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vs = require("vscode");
const brackets = require("./brackets");
function jumpLeft() {
    let editor = vs.window.activeTextEditor;
    let curPos = editor.selection.active;
    let document = editor.document;
    let bracketPos = brackets.bracketInDir(document, curPos, "left");
    if (bracketPos) {
        let newSelection = new vs.Selection(bracketPos, bracketPos);
        editor.selection = newSelection;
        editor.revealRange(new vs.Range(bracketPos, bracketPos));
    }
}
exports.jumpLeft = jumpLeft;
function jumpRight() {
    let editor = vs.window.activeTextEditor;
    let curPos = editor.selection.active;
    let document = editor.document;
    let bracketPos = brackets.bracketInDir(document, curPos, "right");
    if (bracketPos) {
        let newSelection = new vs.Selection(bracketPos, bracketPos);
        editor.selection = newSelection;
        editor.revealRange(new vs.Range(bracketPos, bracketPos));
    }
}
exports.jumpRight = jumpRight;
function selectLeft() {
    let editor = vs.window.activeTextEditor;
    let curPos = editor.selection.active;
    let anchorPos = editor.selection.anchor;
    let document = editor.document;
    let bracketPos = brackets.bracketInDir(document, curPos, "left");
    if (bracketPos) {
        let newSelection = new vs.Selection(anchorPos, bracketPos);
        editor.selection = newSelection;
        editor.revealRange(new vs.Range(bracketPos, bracketPos));
    }
}
exports.selectLeft = selectLeft;
function selectRight() {
    let editor = vs.window.activeTextEditor;
    let curPos = editor.selection.active;
    let anchorPos = editor.selection.anchor;
    let document = editor.document;
    let bracketPos = brackets.bracketInDir(document, curPos, "right");
    if (bracketPos) {
        let newSelection = new vs.Selection(anchorPos, bracketPos);
        editor.selection = newSelection;
        editor.revealRange(new vs.Range(bracketPos, bracketPos));
    }
}
exports.selectRight = selectRight;
function ascendLeft() {
    let editor = vs.window.activeTextEditor;
    let curPos = editor.selection.active;
    let document = editor.document;
    let bracketPos = brackets.unmatchedBracketInDir(document, curPos, "left");
    if (bracketPos) {
        let newSelection = new vs.Selection(bracketPos, bracketPos);
        editor.selection = newSelection;
        editor.revealRange(new vs.Range(bracketPos, bracketPos));
    }
}
exports.ascendLeft = ascendLeft;
function ascendRight() {
    let editor = vs.window.activeTextEditor;
    let curPos = editor.selection.active;
    let document = editor.document;
    let bracketPos = brackets.unmatchedBracketInDir(document, curPos, "right");
    if (bracketPos) {
        let newSelection = new vs.Selection(bracketPos, bracketPos);
        editor.selection = newSelection;
        editor.revealRange(new vs.Range(bracketPos, bracketPos));
    }
}
exports.ascendRight = ascendRight;
function ascendSelectLeft() {
    let editor = vs.window.activeTextEditor;
    let curPos = editor.selection.active;
    let anchorPos = editor.selection.anchor;
    let document = editor.document;
    let bracketPos = brackets.unmatchedBracketInDir(document, curPos, "left");
    if (bracketPos) {
        let newSelection = new vs.Selection(anchorPos, bracketPos);
        editor.selection = newSelection;
        editor.revealRange(new vs.Range(bracketPos, bracketPos));
    }
}
exports.ascendSelectLeft = ascendSelectLeft;
function ascendSelectRight() {
    let editor = vs.window.activeTextEditor;
    let curPos = editor.selection.active;
    let anchorPos = editor.selection.anchor;
    let document = editor.document;
    let bracketPos = brackets.unmatchedBracketInDir(document, curPos, "right");
    if (bracketPos) {
        let newSelection = new vs.Selection(anchorPos, bracketPos);
        editor.selection = newSelection;
        editor.revealRange(new vs.Range(bracketPos, bracketPos));
    }
}
exports.ascendSelectRight = ascendSelectRight;
//# sourceMappingURL=commands.js.map
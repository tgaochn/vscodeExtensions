'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    let runInsertion = (newLine) => {
        let editor = vscode.window.activeTextEditor;
        let selections = editor.selections;
        var doc = editor.document;
        editor.edit(function (edit) {
            selections.forEach((selection, index) => {
                for (let i = selection.start.line; i <= selection.end.line; i++) {
                    let selLine = doc.lineAt(i);
                    let insertPos = selLine.range;
                    let insertLineText = selLine.text;
                    // Insert semicolon, if it needs it
                    edit.replace(insertPos, insertComma(insertLineText, newLine));
                }
            });
        }).then(() => {
            if (newLine) {
                // Move cursor to the next line
                vscode.commands.executeCommand("cursorMove", {
                    to: "down",
                    by: "wrappedLine",
                    select: false,
                    value: 1
                }).then(() => {
                    vscode.commands.executeCommand("cursorMove", {
                        to: "wrappedLineEnd",
                        by: "wrappedLine",
                        select: false
                    });
                });
            }
        });
    };
    let disposables = [
        vscode.commands.registerCommand('extension.insertComma', () => {
            runInsertion(false);
        })
    ];
    disposables.forEach((disposable) => context.subscriptions.push(disposable));
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
/**
 * Inserts a semicolon at the end of a text
 * @param str Text that needs a semicolon at the end
 * @param newLine If it will add a new line at the end
 */
function insertComma(str, newLine = false) {
    if (!str.trim().length || str.trim().split('').pop() == ',')
        return str;
    let indentString = getIndentString(str);
    return indentString + str.trim() + ',' + (newLine ? '\n' + indentString : '');
}
exports.insertComma = insertComma;
;
/**
 * Get the indentation string of a line
 * @param str String to get the indentation text
 */
function getIndentString(str) {
    return (str.match(/^\s+/) || ['']).shift();
}
exports.getIndentString = getIndentString;
//# sourceMappingURL=extension.js.map
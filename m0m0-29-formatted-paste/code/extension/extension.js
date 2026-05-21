"use strict";
const vscode = require("vscode");

function activate(context) {
    const disposable = vscode.commands.registerCommand('formatted-paste.trimmed-paste', async () => {
        const clipboard = await vscode.env.clipboard.readText();
        if (!clipboard) {
            vscode.window.showInformationMessage('Clipboard is empty');
            return;
        }

        // Strip leading and trailing whitespace and newlines
        const trimmedText = clipboard.trim();

        const editor = vscode.window.activeTextEditor;
        if (editor) {
            editor.edit((editBuilder) => {
                editor.selections.forEach((selection) => {
                    editBuilder.replace(selection, trimmedText);
                });
            });
        }
    });
    context.subscriptions.push(disposable);
}

function deactivate() { }

module.exports = { activate, deactivate };


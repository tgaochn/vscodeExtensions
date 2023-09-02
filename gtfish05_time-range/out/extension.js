'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const insert_beginning_of_line_1 = require("./insert-beginning-of-line");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    for (const [name, command] of insert_beginning_of_line_1.commands_map) {
        context.subscriptions.push(vscode.commands.registerCommand(name, (option) => { command(option); }));
    }
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map
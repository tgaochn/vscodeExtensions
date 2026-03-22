'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const commands = require("./commands");
const brackets_1 = require("./brackets");
function activate(context) {
    console.log('bracket-jumper activating...registering commands...');
    let jumpLeft = vscode.commands.registerCommand('bracket-jumper.jumpLeft', () => {
        commands.jumpLeft();
    });
    let jumpRight = vscode.commands.registerCommand('bracket-jumper.jumpRight', () => {
        commands.jumpRight();
    });
    let selectLeft = vscode.commands.registerCommand('bracket-jumper.selectLeft', () => {
        commands.selectLeft();
    });
    let selectRight = vscode.commands.registerCommand('bracket-jumper.selectRight', () => {
        commands.selectRight();
    });
    let ascendLeft = vscode.commands.registerCommand('bracket-jumper.ascendLeft', () => {
        commands.ascendLeft();
    });
    let ascendRight = vscode.commands.registerCommand('bracket-jumper.ascendRight', () => {
        commands.ascendRight();
    });
    let ascendSelectLeft = vscode.commands.registerCommand('bracket-jumper.selectAscendLeft', () => {
        commands.ascendSelectLeft();
    });
    let ascendSelectRight = vscode.commands.registerCommand('bracket-jumper.selectAscendRight', () => {
        commands.ascendSelectRight();
    });
    let configListener = vscode.workspace.onDidChangeConfiguration(() => {
        brackets_1.updateLeftRight();
    });
    console.log('Commands registered.');
    context.subscriptions.push(jumpLeft, jumpRight, selectLeft, selectRight, ascendLeft, ascendRight, ascendSelectLeft, ascendSelectRight, configListener);
}
exports.activate = activate;
function deactivate() {
    // Currently do nothing...deregister commands?
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map
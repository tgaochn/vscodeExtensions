"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function (o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function () { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function (o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function (o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function (o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function (o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
function activate(context) {
    const disposable = vscode.commands.registerCommand('join-paste.join-paste', async () => {
        const clipboard = await vscode.env.clipboard.readText();
        if (!clipboard) {
            vscode.window.showInformationMessage('Clipboard is empty');
            return;
        }
        const separator = await vscode.window.showInputBox({
            prompt: 'Join with this string',
            value: ', '
        });
        if (separator === undefined) {
            return;
        }
        const lines = clipboard.split(/[\n\r]+/g);
        const joinedText = lines.join(separator);
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            editor.edit((editBuilder) => {
                editor.selections.forEach((selection) => {
                    editBuilder.replace(selection, joinedText);
                });
            });
        }
    });
    context.subscriptions.push(disposable);

    const joinToClipboardDisposable = vscode.commands.registerCommand('join-paste.join-to-clipboard', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showInformationMessage('No active editor');
            return;
        }

        const selections = editor.selections;
        if (selections.length === 0) {
            vscode.window.showInformationMessage('No text selected');
            return;
        }

        const separator = await vscode.window.showInputBox({
            prompt: 'Join with this string',
            value: ', '
        });
        if (separator === undefined) {
            return;
        }

        const selectedTexts = selections.map(selection => editor.document.getText(selection));
        const joinedText = selectedTexts.join(separator);
        
        await vscode.env.clipboard.writeText(joinedText);
        vscode.window.showInformationMessage('Text joined and copied to clipboard');
    });
    context.subscriptions.push(joinToClipboardDisposable);

    const quickJoinToClipboardDisposable = vscode.commands.registerCommand('join-paste.quick-join-to-clipboard', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showInformationMessage('No active editor');
            return;
        }

        const selections = editor.selections;
        if (selections.length === 0) {
            vscode.window.showInformationMessage('No text selected');
            return;
        }

        const selectedTexts = selections.map(selection => editor.document.getText(selection));
        const joinedText = selectedTexts.join(', ');
        
        await vscode.env.clipboard.writeText(joinedText);
        vscode.window.showInformationMessage('Text joined with comma and copied to clipboard');
    });
    context.subscriptions.push(quickJoinToClipboardDisposable);
}
function deactivate() { }
//# sourceMappingURL=extension.js.map
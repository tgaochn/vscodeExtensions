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
const vscode_1 = require("vscode");
const wrap_1 = require("./wrap");
const wrapSelection = (editor, symbol) => {
    if (!symbol) {
        return;
    }
    const { document, selections } = editor;
    editor.edit((b) => {
        selections.forEach((selection) => {
            if (!selection.isEmpty) {
                const text = document.getText(selection);
                b.replace(selection, wrap_1.default(text, symbol));
            }
        });
    });
};
function activate(context) {
    // context.subscriptions.push(vscode_1.commands.registerCommand("wrapSelection", () => __awaiter(this, void 0, void 0, function* () {
    //     const { activeTextEditor: editor } = vscode_1.window;
    //     const symbol = yield vscode_1.window.showInputBox({ placeHolder: "symbols" });
    //     wrapSelection(editor, symbol);
    // })));

    context.subscriptions.push(vscode_1.commands.registerCommand("wrapSelection", () => __awaiter(this, void 0, void 0, function* () {
        const editor = vscode_1.window.activeTextEditor;
        const options = [];
        const excludedKeys = ['has', 'get', 'update', 'inspect', 'default']; 

        // 遍历用户配置,将标签和描述添加到选项数组中  
        const userPatterns = vscode_1.workspace.getConfiguration("wrapSelection.patterns");
        Object.keys(userPatterns).forEach(key => {
            if (!excludedKeys.includes(key)) {
                options.push({
                  label: key,
                  description: userPatterns[key]
                });
              }
        });

        // 显示快速选择菜单让用户选择一个选项
        const selected = yield vscode_1.window.showQuickPick(options);

        // 使用用户选择的标签来包装选择的代码
        wrapSelection(editor, selected.label);
    })));

    context.subscriptions.push(vscode_1.commands.registerCommand("wrapSelection.pattern", () => {
        const { activeTextEditor: editor } = vscode_1.window;
        const userDefaultPattern = vscode_1.workspace.getConfiguration("wrapSelection.patterns")['default'];
        
        wrapSelection(editor, userDefaultPattern);
        // wrapSelection(editor, "try");
    }));
    context.subscriptions.push(vscode_1.commands.registerCommand("wrapSelection.quote.single", () => {
        const { activeTextEditor: editor } = vscode_1.window;
        wrapSelection(editor, "'");
    }));
    context.subscriptions.push(vscode_1.commands.registerCommand("wrapSelection.quote.double", () => {
        const { activeTextEditor: editor } = vscode_1.window;
        wrapSelection(editor, '"');
    }));
    context.subscriptions.push(vscode_1.commands.registerCommand("wrapSelection.quote.backtick", () => {
        const { activeTextEditor: editor } = vscode_1.window;
        wrapSelection(editor, '`');
    }));
    context.subscriptions.push(vscode_1.commands.registerCommand("wrapSelection.quote.french", () => {
        const { activeTextEditor: editor } = vscode_1.window;
        wrapSelection(editor, "«");
    }));
    context.subscriptions.push(vscode_1.commands.registerCommand("wrapSelection.bracket.square", () => {
        const { activeTextEditor: editor } = vscode_1.window;
        wrapSelection(editor, "[");
    }));
    context.subscriptions.push(vscode_1.commands.registerCommand("wrapSelection.bracket.round", () => {
        const { activeTextEditor: editor } = vscode_1.window;
        wrapSelection(editor, "(");
    }));
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map
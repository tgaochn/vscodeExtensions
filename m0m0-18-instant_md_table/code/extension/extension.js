'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
function activate(context) {
    let disposable_align = vscode.commands.registerCommand('markdown.generateTableWithAlignment', () => __awaiter(this, void 0, void 0, function* () {
        let options = {
            // prompt: "Please insert size of table: \"Rows,Columns\" ",
            // placeHolder: "[Rows],[Columns]  \"3,3\""

            // 0.0.2
            prompt: "Please insert size of table: \"Rows,Columns\" (default: 4,4)",
            placeHolder: "[Rows],[Columns] (default: 4,4)"
        };
        var value = yield vscode.window.showInputBox(options);
        let items = [];
        items.push({ label: 'left', description: 'Align Left' });
        items.push({ label: 'center', description: 'Align Center' });
        items.push({ label: 'right', description: 'Align Right' });
        var align = yield vscode.window.showQuickPick(items);
        console.log(align.label);
        var { valid, rows, columns } = parseInput(value);
        var x = generateString("3", "3", "center");
        console.log(x);
        if (valid) {
            if (insertTextIntoDocument(generateString(rows, columns, align.label))) {
                // 0.0.3
                // vscode.window.showInformationMessage('New markdown table was created...');
            }
        }
    }));
    let disposable = vscode.commands.registerCommand('markdown.generateTable', () => __awaiter(this, void 0, void 0, function* () {
        let options = {
            // prompt: "Please insert size of table: \"Rows,Columns\" ",
            // placeHolder: "[Rows],[Columns]  \"3,3\""

            // 0.0.3
            prompt: "Please insert size of table: \"Rows,Columns\" (default: 4,4)",
            placeHolder: "[Rows],[Columns] (default: 4,4)"
        };
        var value = yield vscode.window.showInputBox(options);
        var { valid, rows, columns } = parseInput(value);
        if (valid) {
            if (insertTextIntoDocument(generateString(rows, columns, "undefined"))) {
                // 0.0.3
                // vscode.window.showInformationMessage('New markdown table was created...');
            }
        }
    }));
    context.subscriptions.push(disposable);
    context.subscriptions.push(disposable_align);
}
exports.activate = activate;
function parseInput(value) {
    var user_input;
    var columns, rows;
    var valid;

    // 0.0.2
    if (value.length == 0){
        rows = "4";
        columns = "4";
        valid = true;
        return { valid, rows, columns };
    }

    var regexp = new RegExp('[0-9]+(,[0-9]+)');
    if (regexp.test(value)) {
        valid = true;
        user_input = value.split(',');
        rows = user_input[0];
        columns = user_input[1];
        return { valid, rows, columns };
    }
    else {
        vscode.window.showInformationMessage('Wrong input format, please use \"Rows,Columns\"');
        valid = false;
        return { valid, rows, columns };
    }
}
exports.parseInput = parseInput;
function insertTextIntoDocument(text) {
    let editor = vscode.window.activeTextEditor;
    if (editor !== undefined) {
        let insertPosition = editor.selection.active;
        editor.edit(edit => {
            edit.insert(insertPosition, text);
        });
        return true;
    }
    else {
        vscode.window.showInformationMessage('Please open a file before generating the table');
        return false;
    }
}
function generateString(rows, columns, alignment) {
    let base_header = "       |";
    var base_seperator;
    switch (alignment) {
        case "center": {
            base_seperator = " :---: |";
            break;
        }
        case "right": {
            base_seperator = "  ---: |";
            break;
        }
        default: {
            base_seperator = "  ---  |";
            break;
        }
    }
    var string_header = "|" + base_header.repeat(columns);
    var string_seperator = "|" + base_seperator.repeat(columns);
    var string_base = (string_header + '\n').repeat(rows);
    return string_header + '\n' + string_seperator + '\n' + string_base + '\n';
}
exports.generateString = generateString;
// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map
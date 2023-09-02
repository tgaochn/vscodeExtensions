'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const g = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_";
const cochineal_light = {
    overviewRulerColor: '#FF99B4',
    backgroundColor: '#FF99B4',
    borderColor: '#FF99B4'
};
const cochineal_dark = {
    overviewRulerColor: '#AE2B52',
    backgroundColor: '#AE2B52',
    borderColor: '#AE2B52'
};
const select_cochineal_light = {
    overviewRulerColor: '#FFB3C7',
    backgroundColor: '#FFB3C7',
    borderColor: '#FFB3C7'
};
const select_cochineal_dark = {
    overviewRulerColor: '#C7506F',
    backgroundColor: '#C7506F',
    borderColor: '#C7506F'
};
var highlight = vscode.window.createTextEditorDecorationType({});
var selecthighlight = vscode.window.createTextEditorDecorationType({});
function activate(context) {
    let subscriptions = [];
    const workbench_configuration = vscode.workspace.getConfiguration('workbench');
    workbench_configuration.update('colorCustomizations', { "editor.selectionBackground": "#FFB3C7" }, true);
    const editor_configuration = vscode.workspace.getConfiguration('editor');
    editor_configuration.update("selectionHighlight", false, true);
    editor_configuration.update("occurrencesHighlight", false, true);
    vscode.window.onDidChangeTextEditorSelection(on_change_select, this, subscriptions);
}
exports.activate = activate;
function on_change_select() {
    var e = vscode.window.activeTextEditor;
    var s = e.document.getText(e.selection);
    highlight.dispose();
    highlight = vscode.window.createTextEditorDecorationType({
        // light: cochineal_light, -- tian: change the color here
        // dark: cochineal_dark
        light: cochineal_light,
        dark: select_cochineal_light
    });
    selecthighlight.dispose();
    selecthighlight = vscode.window.createTextEditorDecorationType({
        // light: select_cochineal_light, -- tian: change the color here
        // dark: select_cochineal_dark
        light: cochineal_dark,
        dark: select_cochineal_dark
    });
    if (s.length > 0 && s.indexOf(' ') < 0 && s.indexOf('\n') < 0) {
        var text = e.document.getText();
        var ranges = [];
        var selectranges = [];
        for (var i = 0; i < text.length;) {
            var pos = text.indexOf(s, i);
            var front = 1;
            var back = 1;
            i = pos + s.length;
            if (pos > 0) {
                for (var j = 0; j < g.length; ++j) {
                    if (text[pos - 1] == g[j]) {
                        front = 0;
                        break;
                    }
                }
            }
            if (i < text.length - 1) {
                for (var j = 0; j < g.length; ++j) {
                    if (text[i] == g[j]) {
                        back = 0;
                        break;
                    }
                }
            }
            if (pos > -1) {
                if (front * back > 0) {
                    ranges.push(new vscode.Range(e.document.positionAt(pos), e.document.positionAt(i)));
                }
            }
            else {
                break;
            }
        }
        e.setDecorations(highlight, ranges);
        selectranges.push(e.selection);
        e.setDecorations(selecthighlight, selectranges);
    }
}
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.commands_map = void 0;
const vscode = require("vscode");
const SPLIT_TEXT = 'extension.splitText';
const SPLIT_TEXT_AND_DELETE_SEPARATOR = 'extension.splitTextAndDeleteSeparator';
const JOIN_TEXT = 'extension.joinText';
const JOIN_TEXT_AND_DELETE_INDENT = 'extension.joinTextAndDeleteIndent';
exports.commands_map = new Map([
    [SPLIT_TEXT, (option) => { splitText(option); }],
    [SPLIT_TEXT_AND_DELETE_SEPARATOR, (option) => { splitTextAndDeleteSeparator(option); }],
    [JOIN_TEXT, (option) => { joinText(option); }],
    [JOIN_TEXT_AND_DELETE_INDENT, (option) => { joinTextAndDeleteIndent(option); }]
]);
// 文字列中の正規表現記号をエスケープする
// 	\t を検索できるように '\' はエスケープしない
function escapeRegExp(s) {
    return s.replace(/[-\/^$*+?.()|[\]{}]/g, "\\$&");
}
/**
 * 指定したセパレータで文字列を分割する
 * @param option コマンドオプション
 */
function splitText(option) {
    if (!option) {
        option = {};
    }
    const defaultSeparator = vscode.workspace.getConfiguration("splitJoinText").get("defaultSeparator");
    const options = {
        ignoreFocusOut: true,
        placeHolder: 'separator letter',
        prompt: 'separator for splitting',
    };
    options.value = defaultSeparator;
    vscode.window.showInputBox(options).then(inputSeparatorCharacter => {
        if (!inputSeparatorCharacter) {
            return;
        }
        if (!vscode.window.activeTextEditor) {
            vscode.window.showInformationMessage('No editor is active');
            return;
        }
        //	正規表現記号をエスケープする
        const separatorCharacter = escapeRegExp(inputSeparatorCharacter);
        const replaceRegexp = new RegExp(separatorCharacter, 'g');
        const editor = vscode.window.activeTextEditor;
        const deleteSeparator = !!option.deleteSeparator;
        //	カーソル行、選択行を取得する
        //	ソートして大きい行の方から置き換える
        const selections = [...editor.selections].sort((a, b) => -(a.start.line - b.start.line));
        editor.edit(ed => {
            selections.forEach(select => {
                //	選択にかかる行は先頭から最後までを置き換える
                let target_range = new vscode.Range(select.start, select.end);
                if (select.isEmpty) {
                    // 選択範囲が無い。カーソル行を処理する
                    const line = editor.document.lineAt(select.start.line);
                    target_range = new vscode.Range(line.range.start, line.range.end);
                }
                let text = editor.document.getText(target_range);
                if (deleteSeparator) {
                    text = text.replaceAll(separatorCharacter + " ", separatorCharacter); // in case of space after the separator
                    text = text.replace(replaceRegexp, "\n");
                }
                else {
                    text = text.replace(replaceRegexp, separatorCharacter + "\n");
                }
                //	置き換える
                ed.replace(target_range, text);
            });
        });
    });
}
/**
 * 分割してセパレーターを削除
 * @param option コマンドオプション
 */
function splitTextAndDeleteSeparator(option) {
    if (!option) {
        option = {};
    }
    option.deleteSeparator = true;
    splitText(option);
}
/**
 * 複数行を連結する。セパレータが指定されればそれを挟んで連結する
 * @param option オプション
 */
function joinText(option) {
    if (!option) {
        option = {};
    }
    const options = {
        ignoreFocusOut: true,
        placeHolder: 'separator letter',
        prompt: 'separator for joining',
    };
    vscode.window.showInputBox(options).then(inputSeparatorStr => {
        if (inputSeparatorStr !== "" && !inputSeparatorStr) {
            return;
        }
        if (!vscode.window.activeTextEditor) {
            vscode.window.showInformationMessage('No editor is active');
            return;
        }
        const separatorCharacter = inputSeparatorStr;
        const editor = vscode.window.activeTextEditor;
        const deleteIndent = !!option.deleteIndent;
        //	カーソル行、選択行を取得する
        //	ソートして大きい行の方から置き換える
        const selections = [...editor.selections].sort((a, b) => -(a.start.line - b.start.line));
        editor.edit(ed => {
            //	選択にかかる行は先頭から最後までを置き換える
            selections.forEach(select => {
                if (select.isEmpty) {
                    // 選択範囲が無い。JOIN対象行が無い
                    return;
                }
                let text = editor.document.getText(select);
                if (deleteIndent) {
                    text = text.replace(/\r?\n\s*(?=.)/g, separatorCharacter).replace(/^\s+/, "");
                }
                else {
                    text = text.replace(/\r?\n(?=.)/g, separatorCharacter);
                }
                //	置き換える
                ed.replace(select, text);
            });
        });
    });
}
function joinTextAndDeleteIndent(option) {
    if (!option) {
        option = {};
    }
    option.deleteIndent = true;
    joinText(option);
}
//# sourceMappingURL=split-join-text.js.map
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const INSERT_BEGINNING_OF_LINE = 'extension.insertTimeRange';
exports.commands_map = new Map([
    [INSERT_BEGINNING_OF_LINE, (option) => { insertTimeRange(option); }],
]);
function AppendZero(obj) {
    if (obj < 10) return "0" + "" + obj;
    else return obj;
}

function insertTimeRange(option) {
    if (!option) {
        option = {};
    }
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showInformationMessage('No editor is active');
        return;
    }
    const defaultInsertWord = vscode.workspace.getConfiguration("insertTimeRange").get("defaultInsertWord");
    const options = {
        ignoreFocusOut: true,
        placeHolder: '30m, 1.5h',
        prompt: 'Input a time lapse(eg 30m, 1.5h)',
    };
    options.value = defaultInsertWord;
    vscode.window.showInputBox(options).then(inputInsertWord => {
        if (!inputInsertWord) {
            return;
        }
        if (!vscode.window.activeTextEditor) {
            vscode.window.showInformationMessage('No editor is active');
            return;
        }

        const eol = editor.document.eol === vscode.EndOfLine.CRLF ? "\r\n" : "\n";
        inputInsertWord = inputInsertWord.replace(/\\t/g, "\t").replace(/(\\r)?\\n/g, eol);
        editor.edit(ed => {
            editor.selections.forEach(select => {
                const target_range = new vscode.Range(select.start.line, 0, select.end.line, select.end.character);
                let text = editor.document.getText(target_range);

                // parse the input box
                var minLapse = 0;
                if (inputInsertWord.endsWith("m")) {
                    minLapse = inputInsertWord.substring(0, inputInsertWord.length - 1);
                    minLapse = parseFloat(minLapse);
                } else if (inputInsertWord.endsWith("min")) {
                    minLapse = inputInsertWord.substring(0, inputInsertWord.length - 3);
                    minLapse = parseFloat(minLapse);
                } else if (inputInsertWord.endsWith("h")) {
                    var hourLapse = inputInsertWord.substring(0, inputInsertWord.length - 1);
                    minLapse = parseFloat(hourLapse) * 60;
                }

                // format date range
                var begDatetime = new Date();
                begDatetime.setMinutes(begDatetime.getMinutes() + 5);
                var endDatetime = new Date();
                endDatetime.setMinutes(begDatetime.getMinutes() + minLapse);
                var begHour = begDatetime.getHours();
                var begMin = begDatetime.getMinutes();
                var endHour = endDatetime.getHours();
                var endMin = endDatetime.getMinutes();
                var timeRange = AppendZero(begHour) + ":" + AppendZero(begMin) + " - " + AppendZero(endHour) + ":" + AppendZero(endMin) + "\n";

                text = timeRange + text.replace(/\n/g, "\n" + inputInsertWord);
                ed.replace(target_range, text);
            });
        });
    });
}
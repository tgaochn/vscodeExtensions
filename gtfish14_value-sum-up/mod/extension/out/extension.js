"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the necessary extensibility types to use in your code below
const vscode_1 = require("vscode");
// This method is called when your extension is activated. Activation is
// controlled by the activation events defined in package.json.
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error).
    // This line of code will only be executed once when your extension is activated.
    console.log('Code sum up is now active!');
    // create a new word counter
    let wordCounter = new WordCounter();
    let controller = new WordCounterController(wordCounter);
    // Add to a list of disposables which are disposed when this extension is deactivated.
    context.subscriptions.push(controller);
    context.subscriptions.push(wordCounter);
}
exports.activate = activate;
// from https://stackoverflow.com/a/42264780/1013
// const NUMERIC_REGEXP = /[-]{0,1}[\d]*[\.]{0,1}[\d]+/g;
const MAX_NUMBER_LENGTH = 8; // max number of digits in a number, 8 digit = 12345.00

class WordCounter {
    constructor() {
        this._statusBarItem = vscode_1.window.createStatusBarItem(vscode_1.StatusBarAlignment.Left);
    }

    updateWordCount() {
        let editor = vscode_1.window.activeTextEditor;
        if (!editor) {
            this._statusBarItem.hide();
            return;
        }

        // more accurate line count
        const lineCnt = editor.selections.reduce((pre, selection) => pre + selection.end.line - selection.start.line + (selection.end.character == 0 ? 0 : 1), 0);
        let statusText = ``;

        // get the numbers from selected lines
        var text = editor.selections.map(selection =>
            editor.document.getText(selection)).join("\n");
        let numList = this._getNumList(text);

        if (lineCnt > 1) {
            statusText += `#Line: ${lineCnt}`;
        }

        if (numList.length > 0) {
            const [minNum, maxNum, sumNum] = numList.reduce(
                ([min, max, sum], num) => [
                    Math.min(min, num),
                    Math.max(max, num),
                    sum + num
                ],
                [numList[0], numList[0], 0]
            );
            const avgNum = sumNum / numList.length;

            const formatNumber = (num) => {
                const fixed = num.toFixed(2); // round to 2 decimal places
                if (fixed.length > MAX_NUMBER_LENGTH) {
                    return num.toExponential(2); // use exponential notation (2 decimal) if the number is too long
                }
                return fixed;
            };

            const sum = formatNumber(sumNum);
            const avg = formatNumber(avgNum);
            const min = formatNumber(minNum);
            const max = formatNumber(maxNum);

            let numText = `Sum: ${sum}; Avg: ${avg}`;
            statusText = statusText.length == 0 ? numText : statusText + '; ' + numText;
            if (statusText.length < MAX_NUMBER_LENGTH * 12) { // if the status text is too long, only show the sum and avg
                statusText += `; Min: ${min}; Max: ${max}`;
            }
        }

        if (statusText.length > 0) {
            this._statusBarItem.text = statusText;
            this._statusBarItem.show();
        } else {
            this._statusBarItem.hide();
        }
    }

    _getNumList(text) {
        // This regex matches integers and floating point numbers
        const regex = /-?\d+(\.\d+)?/g;

        // Use match() to find all occurrences and map them to numbers
        const numbers = (text.match(regex) || []).map(Number);

        return numbers;
    }

    dispose() {
        this._statusBarItem.dispose();
    }
}
class WordCounterController {
    constructor(wordCounter) {
        this._wordCounter = wordCounter;
        // subscribe to selection change and editor activation events
        let subscriptions = [];
        vscode_1.window.onDidChangeTextEditorSelection(this._onEvent, this, subscriptions);
        vscode_1.window.onDidChangeActiveTextEditor(this._onEvent, this, subscriptions);
        // update the counter for the current file
        this._wordCounter.updateWordCount();
        // create a combined disposable from both event subscriptions
        this._disposable = vscode_1.Disposable.from(...subscriptions);
    }
    dispose() {
        this._disposable.dispose();
    }
    _onEvent() {
        this._wordCounter.updateWordCount();
    }
}
//# sourceMappingURL=extension.js.map
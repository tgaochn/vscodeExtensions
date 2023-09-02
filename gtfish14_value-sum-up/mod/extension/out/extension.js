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
const NUMERIC_REGEXP = /[-]{0,1}[\d]*[\.]{0,1}[\d]+/g;
class WordCounter {
    constructor() {
        this._statusBarItem = vscode_1.window.createStatusBarItem(vscode_1.StatusBarAlignment.Left);
    }
    updateWordCount() {
        // Get the current text editor
        let editor = vscode_1.window.activeTextEditor;
        if (!editor) {
            this._statusBarItem.hide();
            return;
        }

        var text = "";
        for (const selection of editor.selections) {
            text += "\n" + editor.document.getText(selection);
        }

        let numLines = this._getWordCount(text);

        if (numLines.length > 0) {
            var minNum = numLines[0]
            var maxNum = numLines[0]
            var sumNum = numLines[0]

            for (var i = 1; i < numLines.length; i++) {
                minNum = Math.min(minNum, numLines[i])
                maxNum = Math.max(maxNum, numLines[i])
                sumNum = sumNum + numLines[i];
            }

            var avgNum = sumNum / numLines.length;

            // Update the status bar around to 2 digit
            this._statusBarItem.text = `Sum: ${sumNum.toFixed(2)}, Avg: ${avgNum.toFixed(2)}, Min: ${minNum.toFixed(2)}, Max: ${maxNum.toFixed(2)}`;
            this._statusBarItem.show();
        } else {
            this._statusBarItem.hide();
        }


    }
    _getWordCount(doc) {
        let lines = doc.trim().split('\n');
        // extracts all the numbers in the selected lines
        // and converts them to floats
        // and if there is a number, get only the first one found
        let numLines = lines.map((line) => {
            const nums = line.match(NUMERIC_REGEXP);
            // the +(thingy) is doing the conversion of string to float
            if (nums && nums.length > 0) {
                return +(nums[0]);
            }
        });
        numLines = numLines.filter(function (x) {
            return x !== undefined;
        });

        return numLines;
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
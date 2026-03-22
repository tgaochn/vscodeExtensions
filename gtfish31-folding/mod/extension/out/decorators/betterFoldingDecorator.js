"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
class BetterFoldingDecorator extends vscode_1.Disposable {
    constructor() {
        super(() => this.dispose());
        this.timeout = undefined;
    }
    triggerUpdateDecorations(editor) {
        if (!this.timeout) {
            this.updateDecorations(editor);
            this.timeout = setTimeout(() => {
                clearTimeout(this.timeout);
                this.timeout = undefined;
            }, 100);
        }
    }
    updateDecorations(editor) {
        if (editor)
            this.updateEditorDecorations(editor);
        else {
            for (const editor of vscode_1.window.visibleTextEditors) {
                this.updateEditorDecorations(editor);
            }
        }
    }
    // This is how Better Folding is able to provide custom collapsedText.
    newDecorationOptions(contentText) {
        return {
            textDecoration: "none; display:none;",
            before: {
                // Apparently if you add width and height (any values), the text will be clickable
                width: "0",
                height: "0",
                contentText,
                color: "grey",
                margin: `0 -${100}% 0 0`,
                textDecoration: "none; cursor: pointer !important;",
            },
        };
    }
}
exports.default = BetterFoldingDecorator;
//# sourceMappingURL=betterFoldingDecorator.js.map
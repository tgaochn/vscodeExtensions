"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuickPickSeparator = void 0;
const vscode_1 = require("vscode");
class QuickPickSeparator {
    constructor(label) {
        this.label = label;
        this.kind = vscode_1.QuickPickItemKind.Separator;
    }
}
exports.QuickPickSeparator = QuickPickSeparator;
//# sourceMappingURL=quick_pick_separator.js.map
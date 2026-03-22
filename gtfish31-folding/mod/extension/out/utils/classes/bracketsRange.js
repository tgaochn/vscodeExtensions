"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
class BracketsRange extends vscode_1.Range {
    constructor(startBracket, endBracket) {
        super(startBracket.token.range.start, endBracket.token.range.end);
        this.startBracket = startBracket;
        this.endBracket = endBracket;
    }
}
exports.default = BracketsRange;
//# sourceMappingURL=bracketsRange.js.map
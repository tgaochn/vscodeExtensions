"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
class Token {
    constructor(type, content, beginIndex, lineIndex, scopes = []) {
        this.type = type;
        this.content = content;
        const startPos = new vscode_1.Position(lineIndex, beginIndex);
        const endPos = startPos.translate(0, content.length);
        this.range = new vscode_1.Range(startPos, endPos);
        this.scopes = scopes;
    }
    offset(amount) {
        this.range = new vscode_1.Range(this.range.start.translate(0, amount), this.range.end.translate(0, amount));
    }
}
exports.default = Token;
//# sourceMappingURL=token.js.map
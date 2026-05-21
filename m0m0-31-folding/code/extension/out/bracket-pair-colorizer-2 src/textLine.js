"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TextLine {
    constructor(ruleStack, lineState, index) {
        this.lineState = lineState;
        this.ruleStack = ruleStack;
        this.index = index;
    }
    getRuleStack() {
        return this.ruleStack;
    }
    // Return a copy of the line while mantaining bracket state. colorRanges is not mantained.
    cloneState() {
        return this.lineState.cloneState();
    }
    getBracketHash() {
        return this.lineState.getBracketHash();
    }
    addBracket(currentChar, index, key, open, scopes) {
        this.lineState.addBracket(key, currentChar, index, this.index, open, scopes);
    }
    getClosingBracket(position) {
        return this.lineState.getClosingBracket(position);
    }
    offset(startIndex, amount) {
        this.lineState.offset(startIndex, amount);
    }
    getAllBrackets() {
        return this.lineState.getAllBrackets();
    }
    addToken(token) {
        this.lineState.addToken(token);
    }
    getAllTokens() {
        return this.lineState.getAllTokens();
    }
}
exports.default = TextLine;
//# sourceMappingURL=textLine.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const singularIndex_1 = require("./singularIndex");
const token_1 = require("./token");
class LineState {
    constructor(settings, languageConfig, previousState) {
        this.tokens = [];
        this.settings = settings;
        this.languageConfig = languageConfig;
        if (previousState !== undefined) {
            this.bracketManager = previousState.colorIndexes;
        }
        else {
            this.bracketManager = new singularIndex_1.default(settings);
        }
    }
    getBracketHash() {
        return this.bracketManager.getHash();
    }
    cloneState() {
        const clone = {
            colorIndexes: this.bracketManager.copyCumulativeState(),
        };
        return new LineState(this.settings, this.languageConfig, clone);
    }
    getClosingBracket(position) {
        return this.bracketManager.getClosingBracket(position);
    }
    offset(startIndex, amount) {
        //TODO: do this for tokens as well.
        this.bracketManager.offset(startIndex, amount);
    }
    addBracket(type, character, beginIndex, lineIndex, open, scopes) {
        const token = new token_1.default(type, character, beginIndex, lineIndex, scopes);
        if (open) {
            this.addOpenBracket(token);
        }
        else {
            this.addCloseBracket(token);
        }
    }
    getAllBrackets() {
        return this.bracketManager.getAllBrackets();
    }
    addOpenBracket(token) {
        this.bracketManager.addOpenBracket(token);
    }
    addCloseBracket(token) {
        this.bracketManager.addCloseBracket(token);
    }
    addToken(token) {
        this.tokens.push(token);
    }
    getAllTokens() {
        return this.tokens;
    }
}
exports.default = LineState;
//# sourceMappingURL=lineState.js.map
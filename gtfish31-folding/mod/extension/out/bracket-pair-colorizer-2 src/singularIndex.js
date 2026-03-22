"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const bracket_1 = require("./bracket");
const bracketClose_1 = require("./bracketClose");
class SingularBracketGroup {
    constructor(settings, previousState) {
        this.allLinesOpenBracketStack = [];
        this.allBracketsOnLine = [];
        this.bracketsHash = "";
        this.settings = settings;
        if (previousState !== undefined) {
            this.allLinesOpenBracketStack = previousState.currentOpenBracketColorIndexes;
        }
    }
    getAllBrackets() {
        return this.allBracketsOnLine;
    }
    addOpenBracket(token) {
        const openBracket = new bracket_1.default(token);
        this.allLinesOpenBracketStack.push(openBracket);
        this.allBracketsOnLine.push(openBracket);
        this.bracketsHash += openBracket.token.content;
    }
    GetAmountOfOpenBrackets(type) {
        return this.allLinesOpenBracketStack.length;
    }
    addCloseBracket(token) {
        if (this.allLinesOpenBracketStack.length > 0) {
            if (this.allLinesOpenBracketStack[this.allLinesOpenBracketStack.length - 1].token.type === token.type) {
                const openBracket = this.allLinesOpenBracketStack.pop();
                const closeBracket = new bracketClose_1.default(token, openBracket);
                this.allBracketsOnLine.push(closeBracket);
                this.bracketsHash += closeBracket.token.content;
                return;
            }
        }
        const orphan = new bracket_1.default(token);
        this.allBracketsOnLine.push(orphan);
        this.bracketsHash += orphan.token.content;
    }
    getClosingBracket(position) {
        for (const bracket of this.allBracketsOnLine) {
            if (!(bracket instanceof bracketClose_1.default)) {
                continue;
            }
            const closeBracket = bracket;
            const openBracket = closeBracket.openBracket;
            const range = new vscode_1.Range(openBracket.token.range.start.translate(0, 1), closeBracket.token.range.end.translate(0, -1));
            if (range.contains(position)) {
                return closeBracket;
            }
        }
    }
    getHash() {
        return this.bracketsHash;
    }
    offset(startIndex, amount) {
        for (const bracket of this.allBracketsOnLine) {
            if (bracket.token.range.start.character >= startIndex) {
                bracket.token.offset(amount);
            }
        }
    }
    copyCumulativeState() {
        return new SingularBracketGroup(this.settings, {
            currentOpenBracketColorIndexes: this.allLinesOpenBracketStack.slice(),
        });
    }
}
exports.default = SingularBracketGroup;
//# sourceMappingURL=singularIndex.js.map
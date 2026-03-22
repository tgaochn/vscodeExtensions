"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BracketRangesProvider = void 0;
const vscode_1 = require("vscode");
const config = require("../configuration");
const utils_1 = require("../utils/functions/utils");
const bracketsManager_1 = require("../bracket-pair-colorizer-2 src/bracketsManager");
const extendedMap_1 = require("../utils/classes/extendedMap");
const betterFoldingRangeProvider_1 = require("./betterFoldingRangeProvider");
class BracketRangesProvider extends betterFoldingRangeProvider_1.default {
    constructor() {
        super();
        this.bracketsManager = new bracketsManager_1.default();
        this.positionToBracketRange = new extendedMap_1.default(() => undefined);
        this.positionToFoldingRange = new extendedMap_1.default(() => undefined);
        this.positionToToken = new extendedMap_1.default(() => undefined);
        this.updateAllDocuments();
    }
    updateAllDocuments() {
        this.bracketsManager.updateAllDocuments();
    }
    async calculateFoldingRanges(document) {
        const tokenizedDocument = await this.bracketsManager.updateDocument(document);
        if (!tokenizedDocument)
            return [];
        const bracketsRanges = (0, utils_1.bracketsToBracketsRanges)(tokenizedDocument.brackets);
        const foldingRanges = this.bracketsRangesToFoldingRanges(bracketsRanges, tokenizedDocument.tokens, document);
        return foldingRanges;
    }
    bracketsRangesToFoldingRanges(bracketsRanges, tokens, document) {
        this.positionToBracketRange.clear();
        this.positionToFoldingRange.clear();
        this.positionToToken.clear();
        this.populatePositionToBracketRangeMap(bracketsRanges);
        this.populatePositionToTokenMap(tokens);
        const foldingRanges = [];
        for (const bracketsRange of bracketsRanges) {
            if (bracketsRange.start.line === bracketsRange.end.line)
                continue;
            const foldingRange = this.toFoldingRange(bracketsRange, document);
            foldingRanges.push(foldingRange);
            this.addToPositionToFoldingRangeMap(foldingRange, document);
        }
        return foldingRanges;
    }
    populatePositionToBracketRangeMap(bracketsRanges) {
        for (const bracketsRange of bracketsRanges) {
            const line = bracketsRange.start.line;
            const column = bracketsRange.start.character;
            this.positionToBracketRange.set([line, column], bracketsRange);
        }
    }
    populatePositionToTokenMap(tokens) {
        for (const token of tokens) {
            const line = token.range.start.line;
            const column = token.range.start.character;
            this.positionToToken.set([line, column], token);
        }
    }
    addToPositionToFoldingRangeMap(foldingRange, document) {
        const line = foldingRange.start;
        const column = foldingRange.startColumn ?? document.lineAt(line).text.length;
        this.positionToFoldingRange.set([line, column], foldingRange);
    }
    toFoldingRange(bracketsRange, document) {
        const foldClosingBrackets = config.foldClosingBrackets();
        const showFoldedBrackets = config.showFoldedBrackets();
        let start = bracketsRange.start.line;
        let end = bracketsRange.end.line - (foldClosingBrackets ? 0 : 1);
        let startColumn = this.getStartColumn(bracketsRange);
        let collapsedText = this.getCollapsedText(bracketsRange, document);
        if (showFoldedBrackets) {
            [end, collapsedText] = this.appendPostFoldingRangeText(bracketsRange, collapsedText, document);
        }
        return { start, end, startColumn, collapsedText };
    }
    getStartColumn(bracketsRange) {
        const showFoldedBrackets = config.showFoldedBrackets();
        if (!showFoldedBrackets)
            return undefined;
        return bracketsRange.start.character; //Position.character is confusingly the column.
    }
    getCollapsedText(bracketsRange, document, shallow = false) {
        let collapsedText = "…";
        const showFoldedBodyLinesCount = config.showFoldedBodyLinesCount();
        if (showFoldedBodyLinesCount) {
            collapsedText = this.getFoldedLinesCountCollapsedText(bracketsRange);
        }
        const showFunctionParameters = config.showFunctionParameters();
        if (showFunctionParameters && bracketsRange.startBracket.token.content === "(") {
            collapsedText = this.getFunctionParamsCollapsedText(bracketsRange, document);
        }
        const showObjectPreviews = config.showObjectPreviews();
        if (showObjectPreviews && this.isObjectLiteral(bracketsRange) && !shallow) {
            collapsedText = this.getObjectLiteralCollapsedText(bracketsRange, document);
        }
        const showFoldedBrackets = config.showFoldedBrackets();
        if (showFoldedBrackets) {
            collapsedText = this.surroundWithBrackets(bracketsRange, collapsedText);
        }
        return collapsedText;
    }
    getFunctionParamsCollapsedText(bracketsRange, document) {
        const paramTokens = [];
        let line = bracketsRange.start.line;
        let column = bracketsRange.start.character + 1;
        while (new vscode_1.Position(line, column).isBefore(bracketsRange.end)) {
            const bracketRange = this.positionToBracketRange.get([line, column]);
            if (bracketRange?.startBracket.token.content === "(") {
                column = bracketRange.end.character;
                line = bracketRange.end.line;
            }
            const token = this.positionToToken.get([line, column]);
            if (token) {
                paramTokens.push(token.content);
                column = token.range.end.character;
            }
            if (column >= document.lineAt(line).text.length) {
                line++;
                column = -1;
            }
            column++;
        }
        return paramTokens.length ? paramTokens.join(", ") : "…";
    }
    isObjectLiteral(bracketsRange) {
        if (bracketsRange.startBracket.token.content === "{") {
            const { scopes } = bracketsRange.startBracket.token;
            if (scopes.some((scope) => scope.startsWith("punctuation.definition.dict.begin")))
                return true;
            if (scopes.some((scope) => scope.startsWith("meta.objectliteral")))
                return true;
        }
        return false;
    }
    getObjectLiteralCollapsedText(bracketsRange, document) {
        let collapsedText = "";
        let foundText = false;
        let line = bracketsRange.start.line;
        let column = bracketsRange.start.character + 1;
        let lineText = document.lineAt(line).text;
        while (new vscode_1.Position(line, column).isBefore(bracketsRange.end)) {
            const [end, rangeCollapsedText] = this.getShallowCollapsedText([line, column], document);
            if (rangeCollapsedText) {
                collapsedText += rangeCollapsedText;
                line = end + 1;
                break;
            }
            if (column >= lineText.length) {
                line++;
                column = -1;
                lineText = document.lineAt(line).text;
                if (foundText)
                    break;
            }
            if (lineText[column]) {
                foundText = true;
                collapsedText += lineText[column];
            }
            column++;
        }
        if (line < bracketsRange.end.line) {
            collapsedText += "…";
        }
        return " " + collapsedText + " ";
    }
    getShallowCollapsedText([line, column], document) {
        const bracketsRange = this.positionToBracketRange.get([line, column]);
        const emptyBracketsRange = bracketsRange?.startBracket.token.range.end.isEqual(bracketsRange.endBracket.token.range.start);
        if (bracketsRange && !emptyBracketsRange) {
            const currentRangeCollapsedText = this.getCollapsedText(bracketsRange, document, true);
            return this.appendPostFoldingRangeText(bracketsRange, currentRangeCollapsedText, document);
        }
        return [line, ""];
    }
    surroundWithBrackets(bracketsRange, collapsedText) {
        return `${bracketsRange.startBracket.token.content}${collapsedText}${bracketsRange.endBracket.token.content}`;
    }
    getFoldedLinesCountCollapsedText(bracketsRange) {
        let linesCount = bracketsRange.end.line - bracketsRange.start.line - 1;
        linesCount = Math.max(linesCount, 0); //For empty ranges, the start and end lines are the same.
        const line = linesCount === 1 ? "line" : "lines";
        return ` ⋯ ${linesCount} ${line} ⋯ `;
    }
    appendPostFoldingRangeText(bracketsRange, initialCollapsedText, document) {
        const chainFoldingRanges = config.chainFoldingRanges();
        let end = bracketsRange.end.line;
        let collapsedText = initialCollapsedText;
        const line = bracketsRange.end.line;
        const lineContent = document.lineAt(line).text;
        for (let column = bracketsRange.end.character; column < lineContent.length; column++) {
            const foldingRange = this.positionToFoldingRange.get([line, column]);
            if (chainFoldingRanges && foldingRange) {
                end = foldingRange.end;
                collapsedText += foldingRange.collapsedText;
                break;
            }
            collapsedText += lineContent[column];
        }
        return [end, collapsedText];
    }
    restart() {
        super.restart();
        this.bracketsManager = new bracketsManager_1.default();
        this.positionToFoldingRange.clear();
    }
}
exports.BracketRangesProvider = BracketRangesProvider;
//# sourceMappingURL=bracketRangesProvider.js.map
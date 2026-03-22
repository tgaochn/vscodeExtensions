"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bracketsToBracketsRanges = exports.rangeToInlineRange = exports.foldingRangeToRange = exports.groupArrayToMap = void 0;
const vscode_1 = require("vscode");
const bracketClose_1 = require("../../bracket-pair-colorizer-2 src/bracketClose");
const bracketsRange_1 = require("../classes/bracketsRange");
function groupArrayToMap(array, getValue, defaultValue) {
    const map = new Map();
    for (const element of array) {
        const value = getValue(element) ?? defaultValue;
        if (value === undefined || value === null)
            continue;
        const valueCollection = map.get(value);
        if (!valueCollection) {
            map.set(value, [element]);
        }
        else {
            valueCollection.push(element);
        }
    }
    return map;
}
exports.groupArrayToMap = groupArrayToMap;
function foldingRangeToRange(document) {
    return (foldingRange) => new vscode_1.Range(foldingRange.start, foldingRange.startColumn ?? document.lineAt(foldingRange.start).text.length, foldingRange.end, document.lineAt(foldingRange.end).text.length);
}
exports.foldingRangeToRange = foldingRangeToRange;
function rangeToInlineRange(document) {
    return (range) => new vscode_1.Range(range.start.line, range.start.character, range.start.line, document.lineAt(range.start).text.length);
}
exports.rangeToInlineRange = rangeToInlineRange;
function bracketsToBracketsRanges(brackets, sortBy = "end") {
    const ranges = [];
    for (let i = brackets.length - 1; i >= 0; i--) {
        const bracket = brackets[i];
        if (bracket instanceof bracketClose_1.default) {
            const openBracket = bracket.openBracket;
            if (openBracket) {
                const bracketsRange = new bracketsRange_1.default(openBracket, bracket);
                ranges.push(bracketsRange);
            }
        }
    }
    ranges.sort((a, b) => {
        if (a.end.isAfter(b.end)) {
            if (a.contains(b)) {
                return 1;
            }
            return -1;
        }
        if (b.contains(a)) {
            return -1;
        }
        return 1;
    });
    return sortBy === "start" ? ranges.reverse() : ranges;
}
exports.bracketsToBracketsRanges = bracketsToBracketsRanges;
//# sourceMappingURL=utils.js.map
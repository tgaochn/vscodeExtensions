"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const config = require("../configuration");
const betterFoldingRangeProvider_1 = require("./betterFoldingRangeProvider");
const REGION_REGEX = /#region (.*)\n(?:.|\n)*?#endregion/g;
class RegionRangesProvider extends betterFoldingRangeProvider_1.default {
    async calculateFoldingRanges(document) {
        if (!config.showOnlyRegionsDescriptions())
            return [];
        const ranges = [];
        let match;
        while ((match = REGION_REGEX.exec(document.getText()))) {
            if (!match?.[0] || !match?.[1])
                continue;
            const startPosition = document.positionAt(match.index);
            const endPosition = document.positionAt(match.index + match[0].length);
            if (startPosition.line !== endPosition.line) {
                ranges.push({
                    start: startPosition.line,
                    end: endPosition.line,
                    kind: vscode_1.FoldingRangeKind.Region,
                    collapsedText: match[1],
                    startColumn: document.lineAt(startPosition.line).firstNonWhitespaceCharacterIndex,
                });
            }
        }
        return ranges;
    }
}
exports.default = RegionRangesProvider;
//# sourceMappingURL=regionRangesProvider.js.map
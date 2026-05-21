"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.showObjectPreviews = exports.chainFoldingRanges = exports.showFunctionParameters = exports.showOnlyRegionsDescriptions = exports.excludedLanguages = exports.showFoldedBrackets = exports.showFoldedBodyLinesCount = exports.foldClosingTags = exports.foldClosingBrackets = void 0;
const vscode_1 = require("vscode");
const constants_1 = require("./constants");
function foldClosingBrackets() {
    return vscode_1.workspace.getConfiguration(constants_1.CONFIG_ID).get("foldClosingBrackets") ?? false;
}
exports.foldClosingBrackets = foldClosingBrackets;
function foldClosingTags() {
    return vscode_1.workspace.getConfiguration(constants_1.CONFIG_ID).get("foldClosingTags") ?? false;
}
exports.foldClosingTags = foldClosingTags;
function showFoldedBodyLinesCount() {
    return vscode_1.workspace.getConfiguration(constants_1.CONFIG_ID).get("showFoldedBodyLinesCount") ?? false;
}
exports.showFoldedBodyLinesCount = showFoldedBodyLinesCount;
function showFoldedBrackets() {
    return vscode_1.workspace.getConfiguration(constants_1.CONFIG_ID).get("showFoldedBrackets") && foldClosingBrackets();
}
exports.showFoldedBrackets = showFoldedBrackets;
function excludedLanguages() {
    return vscode_1.workspace.getConfiguration(constants_1.CONFIG_ID).get("excludedLanguages") ?? [];
}
exports.excludedLanguages = excludedLanguages;
function showOnlyRegionsDescriptions() {
    return vscode_1.workspace.getConfiguration(constants_1.CONFIG_ID).get("showOnlyRegionsDescriptions") ?? false;
}
exports.showOnlyRegionsDescriptions = showOnlyRegionsDescriptions;
function showFunctionParameters() {
    return vscode_1.workspace.getConfiguration(constants_1.CONFIG_ID).get("showFunctionParameters") && showFoldedBrackets();
}
exports.showFunctionParameters = showFunctionParameters;
function chainFoldingRanges() {
    return vscode_1.workspace.getConfiguration(constants_1.CONFIG_ID).get("chainFoldingRanges") && showFoldedBrackets();
}
exports.chainFoldingRanges = chainFoldingRanges;
function showObjectPreviews() {
    return vscode_1.workspace.getConfiguration(constants_1.CONFIG_ID).get("showObjectPreviews") && showFoldedBrackets();
}
exports.showObjectPreviews = showObjectPreviews;
//# sourceMappingURL=configuration.js.map
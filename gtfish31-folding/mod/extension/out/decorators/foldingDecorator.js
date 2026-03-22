"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const extendedMap_1 = require("../utils/classes/extendedMap");
const utils_1 = require("../utils/functions/utils");
const config = require("../configuration");
const foldedLinesManager_1 = require("../utils/classes/foldedLinesManager");
const constants_1 = require("../constants");
const betterFoldingDecorator_1 = require("./betterFoldingDecorator");
class FoldingDecorator extends betterFoldingDecorator_1.default {
    constructor(providers) {
        super();
        this.providers = {};
        this.decorations = new extendedMap_1.default(() => ({}));
        for (const [selector, provider] of providers) {
            this.registerFoldingRangeProvider(selector, provider);
        }
    }
    registerFoldingRangeProvider(selector, provider) {
        if (!this.providers[selector]) {
            this.providers[selector] = [];
        }
        this.providers[selector].push(provider);
    }
    async updateEditorDecorations(editor) {
        const foldingRanges = await this.getRanges(editor.document);
        const newDecorations = this.addToDecorations(foldingRanges, this.getDecorations(editor));
        this.applyDecorations(editor, foldingRanges, newDecorations);
    }
    clearDecorations() {
        for (const decorations of this.decorations.values()) {
            for (const decoration of Object.values(decorations)) {
                decoration.dispose();
            }
        }
    }
    async getRanges(document) {
        const excludedLanguages = config.excludedLanguages();
        if (excludedLanguages.includes(document.languageId))
            return [];
        const ranges = [];
        const languageProviders = this.providers[document.languageId] ?? [];
        const universalProviders = this.providers["*"] ?? [];
        const allProviders = [...languageProviders, ...universalProviders];
        for (const provider of allProviders) {
            const providerRanges = await provider.provideFoldingRanges(document);
            ranges.push(...providerRanges);
        }
        return ranges;
    }
    addToDecorations(foldingRanges, decorations) {
        for (const foldingRange of foldingRanges) {
            const collapsedText = foldingRange.collapsedText ?? constants_1.DEFAULT_COLLAPSED_TEXT;
            if (!(collapsedText in decorations)) {
                const newDecorationOptions = this.newDecorationOptions(collapsedText);
                decorations[collapsedText] = vscode_1.window.createTextEditorDecorationType(newDecorationOptions);
            }
        }
        return decorations;
    }
    applyDecorations(editor, foldingRanges, decorations) {
        const collapsedTextToFoldingRanges = (0, utils_1.groupArrayToMap)(foldingRanges, (foldingRange) => foldingRange.collapsedText, constants_1.DEFAULT_COLLAPSED_TEXT);
        for (const [collapsedText, decoration] of Object.entries(decorations)) {
            const foldingRanges = collapsedTextToFoldingRanges.get(collapsedText);
            if (!foldingRanges)
                continue;
            const ranges = foldingRanges.map((0, utils_1.foldingRangeToRange)(editor.document));
            const foldedRanges = [];
            for (const range of ranges) {
                if (foldedLinesManager_1.default.isFolded(range, editor))
                    foldedRanges.push(range);
            }
            const inlineFoldedRanges = foldedRanges.map((0, utils_1.rangeToInlineRange)(editor.document));
            editor.setDecorations(decoration, inlineFoldedRanges);
        }
    }
    getDecorations(editor) {
        return this.decorations.get(editor.document.uri);
    }
    dispose() {
        this.clearDecorations();
    }
}
exports.default = FoldingDecorator;
//# sourceMappingURL=foldingDecorator.js.map
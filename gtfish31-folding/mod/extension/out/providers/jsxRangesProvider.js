"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const typescript_estree_1 = require("@typescript-eslint/typescript-estree");
const config = require("../configuration");
const betterFoldingRangeProvider_1 = require("./betterFoldingRangeProvider");
class JsxRangesProvider extends betterFoldingRangeProvider_1.default {
    constructor() {
        super();
    }
    async calculateFoldingRanges(document) {
        const jsxElements = [];
        try {
            const ast = (0, typescript_estree_1.parse)(document.getText(), { jsx: true, loc: true, range: true });
            this.visit(ast, jsxElements);
            return this.jsxElementsToFoldingRanges(jsxElements, document);
        }
        catch (e) {
            return this.provideFoldingRanges(document);
        }
    }
    visit(node, jsxElements) {
        if (Array.isArray(node)) {
            for (const child of node)
                this.visit(child, jsxElements);
            return;
        }
        if (!this.isBaseNode(node))
            return;
        if (node.loc.end.line - node.loc.start.line > 0) {
            for (const child of Object.values(node)) {
                this.visit(child, jsxElements);
            }
            if (this.isJsxElement(node)) {
                jsxElements.push(node);
            }
        }
    }
    isBaseNode(node) {
        return Boolean(node) && node.hasOwnProperty("type");
    }
    isJsxElement(node) {
        return node.type === "JSXElement";
    }
    async jsxElementsToFoldingRanges(jsxElements, document) {
        const foldingRanges = [];
        const foldClosingTags = config.foldClosingTags();
        for (const jsxElement of jsxElements) {
            const start = jsxElement.loc.start.line - 1;
            const end = jsxElement.loc.end.line - 1 - (foldClosingTags ? 0 : 1);
            const startColumn = this.getStartColumn(jsxElement);
            const collapsedText = this.getCollapsedText(jsxElement, document);
            foldingRanges.push({ start, end, startColumn, collapsedText });
        }
        return foldingRanges;
    }
    getStartColumn(jsxElement) {
        const hasAttributes = jsxElement.openingElement.attributes.length > 0;
        const nameEndColumn = jsxElement.openingElement.name.loc.end.column;
        const tagEndColumn = jsxElement.openingElement.loc.end.column;
        const startColumn = hasAttributes ? nameEndColumn : tagEndColumn;
        return startColumn;
    }
    getCollapsedText(jsxElement, document) {
        if (!jsxElement.closingElement) {
            return "…/>";
        }
        let collapsedText = "…";
        if (config.showFoldedBodyLinesCount()) {
            collapsedText = this.getFoldedLinesCountCollapsedText(jsxElement);
        }
        const hasAttributes = jsxElement.openingElement.attributes.length > 0;
        const foldClosingTags = config.foldClosingTags();
        const { start, end } = jsxElement.closingElement.loc;
        const closingElementRange = new vscode_1.Range(start.line - 1, start.column, end.line - 1, end.column);
        const closingElementText = document.getText(closingElementRange);
        return (hasAttributes ? "…>" : "") + collapsedText + (foldClosingTags ? closingElementText : "");
    }
    getFoldedLinesCountCollapsedText(jsxElement) {
        const linesCount = jsxElement.loc.end.line - jsxElement.loc.start.line - 1;
        return `… ${linesCount} lines …`;
    }
}
exports.default = JsxRangesProvider;
//# sourceMappingURL=jsxRangesProvider.js.map
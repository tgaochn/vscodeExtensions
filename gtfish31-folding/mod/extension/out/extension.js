"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode_1 = require("vscode");
const bracketRangesProvider_1 = require("./providers/bracketRangesProvider");
const constants_1 = require("./constants");
const foldingDecorator_1 = require("./decorators/foldingDecorator");
const config = require("./configuration");
const regionRangesProvider_1 = require("./providers/regionRangesProvider");
const jsxRangesProvider_1 = require("./providers/jsxRangesProvider");
const foldedLinesManager_1 = require("./utils/classes/foldedLinesManager");
const zenFoldingDecorator_1 = require("./decorators/zenFoldingDecorator");
const bracketRangesProvider = new bracketRangesProvider_1.BracketRangesProvider();
const providers = [
    ["*", bracketRangesProvider],
    ["*", new regionRangesProvider_1.default()],
    ["javascriptreact", new jsxRangesProvider_1.default()],
    ["typescriptreact", new jsxRangesProvider_1.default()],
];
let foldingDecorator = new foldingDecorator_1.default(providers);
let zenFoldingDecorator = new zenFoldingDecorator_1.default();
const registeredLanguages = new Set();
function activate(context) {
    context.subscriptions.push(foldingDecorator, vscode_1.workspace.onDidChangeConfiguration((event) => {
        if (event.affectsConfiguration(constants_1.CONFIG_ID)) {
            restart();
            updateAllDocuments();
        }
    }), vscode_1.window.onDidChangeVisibleTextEditors(() => {
        updateAllDocuments();
        registerProviders(context);
    }), vscode_1.workspace.onDidChangeTextDocument((e) => {
        zenFoldingDecorator.onChange(e);
        providers.forEach(([_, provider]) => provider.updateRanges(e.document));
    }), vscode_1.window.onDidChangeTextEditorVisibleRanges((e) => {
        foldedLinesManager_1.default.updateFoldedLines(e.textEditor);
        zenFoldingDecorator.triggerUpdateDecorations(e.textEditor);
        foldingDecorator.triggerUpdateDecorations(e.textEditor);
    }), vscode_1.commands.registerCommand(constants_1.CREATE_ZEN_FOLDS_COMMAND, () => zenFoldingDecorator.createZenFoldsAroundSelection()), vscode_1.commands.registerCommand(constants_1.CLEAR_ZEN_FOLDS_COMMAND, () => zenFoldingDecorator.clearZenFolds()));
    registerProviders(context);
    updateAllDocuments();
}
exports.activate = activate;
function registerProviders(context) {
    const excludedLanguages = config.excludedLanguages();
    for (const editor of vscode_1.window.visibleTextEditors) {
        const languageId = editor.document.languageId;
        if (!registeredLanguages.has(languageId) && !excludedLanguages.includes(languageId)) {
            registeredLanguages.add(languageId);
            for (const [selector, provider] of providers) {
                if (selector === languageId || selector === "*")
                    registerProvider(context, languageId, provider);
            }
        }
    }
}
// Courtesy of vscode-explicit-fold,
// apparently if you delay the folding provider, it can override the default language folding provider.
function registerProvider(context, selector, provider) {
    setTimeout(() => {
        context.subscriptions.push(vscode_1.languages.registerFoldingRangeProvider(selector, provider));
    }, 2000);
}
function updateAllDocuments() {
    bracketRangesProvider.updateAllDocuments();
    for (const e of vscode_1.window.visibleTextEditors) {
        providers.forEach(([_, provider]) => provider.updateRanges(e.document));
    }
    //Delayed since vscode does not provide the right visible ranges right away when opening a new document.
    setTimeout(async () => {
        for (const e of vscode_1.window.visibleTextEditors) {
            providers.forEach(([_, provider]) => provider.updateRanges(e.document));
        }
        foldedLinesManager_1.default.updateAllFoldedLines();
        zenFoldingDecorator.triggerUpdateDecorations();
        foldingDecorator.triggerUpdateDecorations();
    }, 500);
}
function restart() {
    providers.forEach(([_, provider]) => provider.restart());
    foldingDecorator.dispose();
    foldingDecorator = new foldingDecorator_1.default(providers);
}
function deactivate() {
    foldingDecorator.dispose();
    zenFoldingDecorator.dispose();
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map
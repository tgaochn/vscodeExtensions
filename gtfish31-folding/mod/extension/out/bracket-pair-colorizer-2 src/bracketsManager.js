"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const documentDecoration_1 = require("./documentDecoration");
const settings_1 = require("./settings");
class BracketsManager {
    constructor() {
        this.documents = new Map();
        this.settings = new settings_1.default();
    }
    Dispose() {
        this.documents.forEach((document, key) => {
            document.dispose();
        });
    }
    async updateDocument(document) {
        // console.log("updateDocument");
        const documentDecoration = await this.getDocumentDecorations(document);
        if (documentDecoration) {
            return documentDecoration.tokenizeDocument();
        }
    }
    async onDidOpenTextDocument(document) {
        // console.log("onDidOpenTextDocument");
        const documentDecoration = await this.getDocumentDecorations(document);
        if (documentDecoration) {
            documentDecoration.tokenizeDocument();
        }
    }
    async onDidChangeTextDocument(event) {
        // console.log("onDidChangeTextDocument");
        const documentDecoration = await this.getDocumentDecorations(event.document);
        if (documentDecoration) {
            documentDecoration.onDidChangeTextDocument(event.contentChanges);
        }
    }
    onDidCloseTextDocument(closedDocument) {
        // console.log("onDidCloseTextDocument");
        const uri = closedDocument.uri.toString();
        const document = this.documents.get(uri);
        if (document !== undefined) {
            // console.log("Disposing " + uri);
            document.dispose();
            this.documents.delete(uri);
        }
    }
    updateAllDocuments() {
        // console.log("updateAllDocuments");
        for (const editor of vscode_1.window.visibleTextEditors) {
            this.updateDocument(editor.document);
        }
    }
    async getDocumentDecorations(document) {
        if (!this.isValidDocument(document)) {
            return;
        }
        const uri = document.uri.toString();
        // console.log("Looking for " + uri + " from cache");
        let documentDecorations = this.documents.get(uri);
        // if (documentDecorations === undefined) {
        const languageConfig = this.tryGetLanguageConfig(document.languageId);
        if (!languageConfig) {
            // console.log("Could not find tokenizer for " + document.languageId);
            return;
        }
        if (languageConfig instanceof Promise) {
            // console.log("Found Tokenizer promise for " + document.languageId);
            return languageConfig.then(async (grammar) => {
                if (grammar) {
                    return this.getDocumentDecorations(document);
                }
            });
        }
        // console.log("Found Tokenizer for " + document.languageId);
        documentDecorations = new documentDecoration_1.default(document, languageConfig, this.settings);
        // console.log("Adding " + uri + " to cache");
        this.documents.set(uri, documentDecorations);
        // }
        // console.log("Retrieved " + uri + " from cache");
        return documentDecorations;
    }
    tryGetLanguageConfig(languageID) {
        return this.settings.TextMateLoader.tryGetLanguageConfig(languageID);
    }
    isValidDocument(document) {
        if (document === undefined) {
            // console.warn("Ignoring undefined document");
            return false;
        }
        if (document.lineCount === 0) {
            // console.warn("Ignoring document with 0 line counter");
            return false;
        }
        if (document.uri.scheme === "vscode") {
            // console.log("Ignoring document with 'vscode' uri");
            return false;
        }
        if (document.uri.scheme === "output") {
            // console.log("Ignoring document with 'output' uri");
            return false;
        }
        if (this.settings.excludedLanguages.has(document.languageId)) {
            // console.log("Ignoring document because language id was ignored in settings");
            return false;
        }
        return true;
    }
}
exports.default = BracketsManager;
//# sourceMappingURL=bracketsManager.js.map
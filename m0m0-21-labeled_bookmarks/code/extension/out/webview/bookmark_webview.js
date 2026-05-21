"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookmarkWebview = void 0;
const vscode = require("vscode");
const path = require("path");
const vscode_1 = require("vscode");
const main_page_1 = require("./main_page");
const export_page_1 = require("./export_page");
const import_page_1 = require("./import_page");
const move_page_1 = require("./move_page");
const switch_page_1 = require("./switch_page");
const arrange_page_1 = require("./arrange_page");
const export_document_page_1 = require("./export_document_page");
class BookmarkWebview {
    constructor(ctx, bookmarkDataProvider, storageManager, actionOptions, storageTypeOptions, decorationFactory) {
        if (actionOptions.size === 0
            || storageTypeOptions.size === 0) {
            throw new Error("Webview initialization failed");
        }
        ;
        this.ctx = ctx;
        this.bookmarkDataProvider = bookmarkDataProvider;
        this.storageManager = storageManager;
        this.actionOptions = actionOptions;
        this.storageTypeOptions = storageTypeOptions;
        this.decorationFactory = decorationFactory;
        this.jsUrl = "";
        this.cssUrl = "";
        this.pages = new Map();
        let mainPage = new main_page_1.MainPage(this);
        this.addPage(mainPage);
        this.activePage = mainPage;
        this.addPage(new export_page_1.ExportPage(storageManager, this));
        this.addPage(new import_page_1.ImportPage(storageManager, this));
        this.addPage(new move_page_1.MovePage(storageManager, this));
        this.addPage(new switch_page_1.SwitchPage(storageManager, this));
        this.addPage(new arrange_page_1.ArrangePage(this));
        this.addPage(new export_document_page_1.ExportDocumentPage(this));
    }
    addPage(page) {
        this.pages.set(page.getName(), page);
    }
    reveal() {
        if (typeof this.panel === "undefined") {
            this.panel = vscode.window.createWebviewPanel('labeledBookmarks', 'Labeled Bookmarks', vscode.ViewColumn.Active, {
                enableScripts: true,
                enableFindWidget: true,
                localResourceRoots: [vscode.Uri.file(this.ctx.extensionPath)],
                retainContextWhenHidden: true,
            });
        }
        this.panel.reveal();
        if (typeof this.panel === "undefined") {
            throw new Error("Could not initialize webview.");
        }
        this.jsUrl = this.pathElementsToUrl(["resources", "webview.js"]);
        this.cssUrl = this.pathElementsToUrl(["resources", "webview.css"]);
        this.panel.iconPath = vscode_1.Uri.file(path.join(this.ctx.extensionPath, "resources", "vsc-labeled-bookmarks-logo.png"));
        this.panel.webview.onDidReceiveMessage(this.receiveMessageFromWebview.bind(this), undefined, this.ctx.subscriptions);
        this.panel.onDidDispose(() => {
            this.panel = undefined;
        });
        this.refreshView();
    }
    pathToUrl(path) {
        if (typeof this.panel === "undefined") {
            throw new Error("Webview is uninitialized.");
        }
        return this.panel.webview.asWebviewUri(vscode_1.Uri.file(path)).toString();
    }
    pathElementsToUrl(pathElements) {
        if (typeof this.panel === "undefined") {
            throw new Error("Webview is uninitialized.");
        }
        pathElements.unshift(this.ctx.extensionPath);
        return this.panel.webview.asWebviewUri(vscode_1.Uri.file(path.join(...pathElements))).toString();
    }
    uriToUrl(uri) {
        if (typeof this.panel === "undefined") {
            throw new Error("Webview is uninitialized.");
        }
        return this.panel.webview.asWebviewUri(uri).toString();
    }
    getGroupListFormControls(groups, groupName) {
        let html = "";
        for (let g of groups) {
            let [svg, _fileNamePostfix] = this.decorationFactory.generateSvg(g.shape, g.color, g.iconText);
            let controlName = `valueGroup.${groupName}.${g.name}`;
            html += `<div>
                    <label>
                        <input type="checkbox" name="${controlName}" id="${controlName}">
                         
                        <svg viewBox="0 0 32 32" class="group-icon">${svg}</svg>
                        ${g.name}
                    </label>
                </div>`;
        }
        ;
        return html;
    }
    sendMessageToWebView(message) {
        if (typeof this.panel === "undefined") {
            throw new Error("Webview is uninitialized.");
        }
        this.panel.webview.postMessage(message);
        // vscode.window.showInformationMessage(JSON.stringify(message));
    }
    setHtmlContent(selector, html) {
        this.sendMessageToWebView({
            operation: "setHtml",
            selector: selector,
            html: html,
        });
    }
    receiveMessageFromWebview(message) {
        var _a, _b, _c, _d;
        let operation = (_a = message.operation) !== null && _a !== void 0 ? _a : "";
        let name = (_b = message.name) !== null && _b !== void 0 ? _b : "";
        let value = (_c = message.value) !== null && _c !== void 0 ? _c : "";
        if (operation === "show" && name === "page") {
            this.switchToPage(value);
            return;
        }
        if (operation === "selectFile") {
            let aWorkspaceFolder = vscode.workspace.workspaceFolders
                ? (_d = vscode.workspace.workspaceFolders[0]) === null || _d === void 0 ? void 0 : _d.uri
                : undefined;
            if (value === "read") {
                vscode.window.showOpenDialog({
                    canSelectFiles: true,
                    canSelectFolders: false,
                    canSelectMany: false,
                    defaultUri: aWorkspaceFolder,
                    filters: { "json": ["json"] },
                    title: "Labeled Bookmarks: select file to read",
                }).then((result) => {
                    if (typeof result !== "undefined") {
                        this.sendMessageToWebView({
                            operation: "set",
                            name: name,
                            value: result[0].fsPath,
                        });
                    }
                });
                return;
            }
            if (value === "write") {
                vscode.window.showSaveDialog({
                    defaultUri: aWorkspaceFolder,
                    filters: { "json": ["json"] },
                    saveLabel: undefined,
                    title: "Labeled Bookmarks: select file to write to",
                }).then((result) => {
                    if (typeof result !== "undefined") {
                        this.sendMessageToWebView({
                            operation: "set",
                            name: name,
                            value: result.fsPath,
                        });
                    }
                });
                return;
            }
        }
        // todo handle unhadled incoming message
        vscode.window.showInformationMessage(JSON.stringify(message));
        this.activePage.processMessage(operation, name, value);
    }
    refreshView() {
        if (typeof this.panel === "undefined") {
            throw new Error("Wwebview is uninitialized.");
        }
        this.getWebviewContents().then((contents) => {
            if (typeof this.panel === "undefined") {
                throw new Error("Wwebview is uninitialized.");
            }
            this.panel.webview.html = contents;
        });
    }
    switchToPage(pageName) {
        if (!this.pages.has(pageName)) {
            pageName = "main";
        }
        let page = this.pages.get(pageName);
        if (typeof page === "undefined") {
            return;
        }
        this.activePage = page;
        this.refreshView();
    }
    getWebviewContents() {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof this.panel === "undefined") {
                throw new Error("Webview is uninitialized.");
            }
            return `<!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta
                        http-equiv="Content-Security-Policy"
                        content="default-src 'none';
                            img-src ${this.panel.webview.cspSource} https:;
                            script-src ${this.panel.webview.cspSource};
                            style-src ${this.panel.webview.cspSource};
                            "/>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Cat Coding</title>
                    <link rel="stylesheet" href="${this.cssUrl}" />
                    <script src="${this.jsUrl}" defer></script> 
                </head>
                <body>
                    ${yield this.activePage.getContent()}
                </body>
            </html>`;
        });
    }
}
exports.BookmarkWebview = BookmarkWebview;
//# sourceMappingURL=bookmark_webview.js.map
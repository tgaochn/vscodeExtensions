"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookmarkWebView = void 0;
const vscode = require("vscode");
const path = require("path");
const vscode_1 = require("vscode");
const WebviewFormState_1 = require("./WebviewFormState");
class BookmarkWebView {
    constructor(ctx, bookmarkDataProvider, actionOptions, storageTypeOptions) {
        if (actionOptions.size === 0
            || storageTypeOptions.size === 0) {
            throw new Error("Webview initialization failed");
        }
        ;
        this.formState = new WebviewFormState_1.WebviewFormState();
        this.ctx = ctx;
        this.bookmarkDataProvider = bookmarkDataProvider;
        this.actionOptions = actionOptions;
        this.storageTypeOptions = storageTypeOptions;
        this.panel = vscode.window.createWebviewPanel('labeledBookmarks', 'Labeled Bookmarks', vscode.ViewColumn.Active, {
            enableScripts: true,
            enableFindWidget: false,
            localResourceRoots: [vscode.Uri.file(this.ctx.extensionPath)],
        });
        if (typeof this.panel === "undefined") {
            throw new Error("Could not initialize webview.");
        }
        this.logoImageUrl = this.toWebviewUrl(["resources", "vsc-labeled-bookmarks-logo.png"]);
        this.panel.iconPath = vscode_1.Uri.file(path.join(this.ctx.extensionPath, "resources", "vsc-labeled-bookmarks-logo.png"));
        this.panel.webview.html = this.getWebviewContents();
        this.panel.webview.onDidReceiveMessage(this.receiveMessageFromWebview, undefined, this.ctx.subscriptions);
        // things to handle:
        // this.panel.onDidChangeViewState();
        // this.panel.onDidDispose();
    }
    toWebviewUrl(pathElements) {
        pathElements.unshift(this.ctx.extensionPath);
        return this.panel.webview.asWebviewUri(vscode_1.Uri.file(path.join(...pathElements))).toString();
    }
    sendMessageToWebView(message) {
        this.panel.webview.postMessage(message);
    }
    receiveMessageFromWebview(message) {
        // todo handle incoming message
    }
    getWebviewContents() {
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
            <style type="text/css">
                body {
                    font-family: var(--vscode-editor-font-family);
                    font-weight: var(--vscode-editor-font-weight);
                    font-size: var(--vscode-editor-font-size);
                }

                #labeled-bookmarks-logo{
                    width: 50px;
                    height: 50px;
                }
            </style>
        </head>
        <body>
            <script>
            const vscode = acquireVsCodeApi();

            // post message to the extension
            vscode.postMessage({});

            // receive messages from the extension
            window.addEventListener('message', event => {
                const message = event.data; // The JSON data our extension sent
            });
            </script>

            <h1>Heading 1</h1>
            <h2>Heading 2</h2>
            <h3>Heading 3</h3>
            <p>Asdk kajdsf kjash fkjasdh fkajsdhf kjasdh fkjashfdk asdkfh kjf</p>
            <img src="` + this.logoImageUrl + `" id="labeled-bookmarks-logo"/>
        </body>
        </html>`;
    }
}
exports.BookmarkWebView = BookmarkWebView;
//# sourceMappingURL=webview.js.map
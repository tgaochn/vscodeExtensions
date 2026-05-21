"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebViewContent = void 0;
class WebViewContent {
    constructor(webviewContentHelper) {
        this.name = "abstract";
        this.params = new Map();
        this.webviewContentHelper = webviewContentHelper;
    }
    getName() {
        return this.name;
    }
    ;
    processMessage(operation, name, value) {
        switch (operation) {
            case "set":
                this.params.set(name, value);
                break;
        }
    }
    getContent() {
        return Promise.resolve(``);
    }
    refreshAfterAction() {
        var _a;
        if ((_a = this.storageActionResult) === null || _a === void 0 ? void 0 : _a.success) {
            this.webviewContentHelper.refreshView();
            return;
        }
        this.webviewContentHelper.setHtmlContent("#" + WebViewContent.resultContainerId, this.getStorageActionContentInner());
    }
    getStorageActionContent() {
        return `<div id="${WebViewContent.resultContainerId}">${this.getStorageActionContentInner()}</div>`;
    }
    getStorageActionContentInner() {
        if (typeof this.storageActionResult === "undefined") {
            return "";
        }
        let result = this.storageActionResult;
        let outcome = result.success
            ? "success"
            : "failure";
        let content = `
            <p>
                ${new Date(result.timestamp).toLocaleString()} - ${outcome}
            </p>
            <p
        `;
        if (result.infos.length + result.warnings.length + result.errors.length === 0) {
            return content;
        }
        content += "<p>";
        result.errors.forEach((em) => {
            content += `<span class="error-message">${em}</span><br />`;
        });
        result.warnings.forEach((wm) => {
            content += `<span class="warning-message">${wm}</span><br />`;
        });
        result.infos.forEach((im) => {
            content += `${im}<br />`;
        });
        content += "</p>";
        return content;
    }
    ;
}
exports.WebViewContent = WebViewContent;
WebViewContent.resultContainerId = "actionResult";
//# sourceMappingURL=webview_content.js.map
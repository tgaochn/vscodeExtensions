"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExportAsDocumentPage = void 0;
const webview_content_1 = require("./webview_content");
const header_content_1 = require("./header_content");
class ExportAsDocumentPage extends webview_content_1.WebViewContent {
    constructor() {
        super();
        this.name = "exportAsDocument";
        this.header = new header_content_1.HeaderContent("Export as Document");
    }
    getContent() {
        return this.header.getContent();
    }
}
exports.ExportAsDocumentPage = ExportAsDocumentPage;
//# sourceMappingURL=export_as_document.js.map
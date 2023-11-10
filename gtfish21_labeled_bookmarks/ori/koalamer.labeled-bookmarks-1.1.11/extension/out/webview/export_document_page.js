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
exports.ExportDocumentPage = void 0;
const webview_content_1 = require("./webview_content");
const header_content_1 = require("./header_content");
class ExportDocumentPage extends webview_content_1.WebViewContent {
    constructor(webviewContentHelper) {
        super(webviewContentHelper);
        this.name = "exportAsDocument";
        this.header = new header_content_1.HeaderContent(webviewContentHelper, "Export as Document", this.name);
    }
    getContent() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.header.getContent();
        });
    }
}
exports.ExportDocumentPage = ExportDocumentPage;
//# sourceMappingURL=export_document_page.js.map
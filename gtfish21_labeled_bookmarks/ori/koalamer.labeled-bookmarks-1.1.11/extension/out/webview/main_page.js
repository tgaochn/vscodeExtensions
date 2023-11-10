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
exports.MainPage = void 0;
const header_content_1 = require("./header_content");
const webview_content_1 = require("./webview_content");
class MainPage extends webview_content_1.WebViewContent {
    constructor(webviewContentHelper) {
        super(webviewContentHelper);
        this.name = "main";
        this.header = new header_content_1.HeaderContent(webviewContentHelper, "", this.name);
    }
    getContent() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.header.getContent()) + `
            <div class="card-grid-container">
                <div data-page="exportTo">
                    <h3>Export to JSON</h3>
                    <p>Exports to JSON file. Skips bookmarks that are outside the
                        opened workspace folders. Replaces workspace folder paths
                        with placeholders.</p>
                </div>
                <div data-page="importFrom">
                    <h3>Import from JSON</h3>
                    <p>Imports from JSON file. Skips bookmarks that are outside
                        the opened workspace folders. Requires matching the imported
                        workspace folders to the ones in this workspace.</p>
                </div>
                <div data-page="moveTo">
                    <h3>Move Database</h3>
                    <p>Moves bookmark database from the current location to a new
                        one. Wipes the previously used location afterwards.</p>
                </div>
                <div data-page="switchTo">
                    <h3>Switch Database</h3>
                    <p>Use another database (file or the workspace state). Leaves
                        the previously used database location unchanged, so you
                        can return using it later.</p>
                </div>
                <div data-page="arrange">
                    <h3>Arrange Bookmarks</h3>
                    <p>Move bookmarks between groups.</p>
                </div>
                <div data-page="exportAsDocument">
                    <h3>Export as Document</h3>
                    <p>Export bookmark data as HTML or MD.</p>
                </div>
            </div>
        `;
        });
    }
}
exports.MainPage = MainPage;
//# sourceMappingURL=main_page.js.map
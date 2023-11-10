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
exports.ArrangePage = void 0;
const webview_content_1 = require("./webview_content");
const header_content_1 = require("./header_content");
class ArrangePage extends webview_content_1.WebViewContent {
    constructor(webviewContentHelper) {
        super(webviewContentHelper);
        this.name = "arrange";
        this.header = new header_content_1.HeaderContent(webviewContentHelper, "Arrange", this.name);
    }
    getContent() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.header.getContent();
        });
    }
}
exports.ArrangePage = ArrangePage;
//# sourceMappingURL=arrange_page.js.map
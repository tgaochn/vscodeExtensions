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
exports.HeaderContent = void 0;
const webview_content_1 = require("./webview_content");
class HeaderContent extends webview_content_1.WebViewContent {
    constructor(webviewContentHelper, subTitle, page) {
        super(webviewContentHelper);
        this.subTitle = subTitle;
        this.page = page;
    }
    getContent() {
        return __awaiter(this, void 0, void 0, function* () {
            let subTitle = "";
            let mainLink = "";
            if (this.subTitle !== "") {
                subTitle = ` - ${this.subTitle}`;
                mainLink = `
                <h3 class="header-link"><a data-page="main" href="">back to main</a></h3>
                <h3 class="header-link"><a data-page="${this.page}" href="" data-date="${new Date().toLocaleString()}">reload</a></h3>
            `;
            }
            return `${mainLink}
            <h1>Labeled Bookmarks${subTitle}</h1>
            <hr />
            `;
        });
    }
}
exports.HeaderContent = HeaderContent;
//# sourceMappingURL=header_content.js.map
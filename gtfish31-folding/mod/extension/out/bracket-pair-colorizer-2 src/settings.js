"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const textMateLoader_1 = require("./textMateLoader");
const config = require("../configuration");
class Settings {
    constructor() {
        this.TextMateLoader = new textMateLoader_1.default();
        this.isDisposed = false;
        const excludedLanguages = config.excludedLanguages();
        this.excludedLanguages = new Set(excludedLanguages);
    }
}
exports.default = Settings;
//# sourceMappingURL=settings.js.map
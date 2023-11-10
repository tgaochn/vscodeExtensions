"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const vscode_1 = require("vscode");
class Logger {
    constructor(name, isEnabled = true) {
        this.name = name;
        this.isEnabled = false;
        this.output = null;
        this.setIsEnabled(isEnabled);
    }
    setIsEnabled(isEnabled) {
        if (isEnabled && this.output === null) {
            this.output = vscode_1.window.createOutputChannel(this.name);
        }
        this.isEnabled = isEnabled;
    }
    log(message) {
        var _a;
        if (!this.isEnabled) {
            return;
        }
        let date = new Date();
        (_a = this.output) === null || _a === void 0 ? void 0 : _a.appendLine(date.toISOString() + " " + message);
    }
}
exports.Logger = Logger;
//# sourceMappingURL=logger.js.map
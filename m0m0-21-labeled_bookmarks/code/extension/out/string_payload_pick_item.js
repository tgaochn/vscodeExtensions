"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringPayloadPickItem = void 0;
const vscode_1 = require("vscode");
class StringPayloadPickItem {
    constructor(payload, label, description) {
        this.payload = payload;
        this.alwaysShow = true;
        this.description = description;
        this.detail = "";
        this.kind = vscode_1.QuickPickItemKind.Default;
        this.label = label;
        this.picked = false;
    }
    static newSeparator(label) {
        let separator = new StringPayloadPickItem("", label, "");
        separator.kind = vscode_1.QuickPickItemKind.Separator;
        return separator;
    }
}
exports.StringPayloadPickItem = StringPayloadPickItem;
//# sourceMappingURL=string_payload_pick_item.js.map
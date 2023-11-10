"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageMenuPickItem = void 0;
const vscode_1 = require("vscode");
class StorageMenuPickItem {
    constructor(payload, label, description) {
        this.payload = payload;
        this.alwaysShow = true;
        this.description = description;
        this.detail = "";
        this.kind = vscode_1.QuickPickItemKind.Default;
        this.label = label;
        this.picked = false;
    }
}
exports.StorageMenuPickItem = StorageMenuPickItem;
//# sourceMappingURL=storage_menu_pick_item.js.map
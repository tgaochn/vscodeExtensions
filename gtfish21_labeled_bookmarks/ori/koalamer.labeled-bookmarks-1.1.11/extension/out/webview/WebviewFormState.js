"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebviewState = void 0;
class WebviewState {
    constructor() {
        this.action = "none";
        this.targetStorageType = "";
        this.targetStoragePath = "";
        this.selectedGroups = [];
        this.folderAssignments = new Map();
        this.fileMapping = new Map();
    }
}
exports.WebviewState = WebviewState;
//# sourceMappingURL=WebviewFormState.js.map
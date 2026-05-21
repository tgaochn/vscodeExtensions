"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageActionResult = void 0;
class StorageActionResult {
    constructor(success, infos, warnings, errors) {
        this.success = success;
        this.timestamp = Date.now();
        this.infos = infos;
        this.warnings = warnings;
        this.errors = errors;
    }
    static simpleSuccess() {
        return new StorageActionResult(true, [], [], []);
    }
    static simpleError(errorMessage) {
        return new StorageActionResult(false, [], [], [errorMessage]);
    }
}
exports.StorageActionResult = StorageActionResult;
//# sourceMappingURL=storage_action_result.js.map
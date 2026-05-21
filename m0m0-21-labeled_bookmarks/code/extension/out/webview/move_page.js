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
exports.MovePage = void 0;
const webview_content_1 = require("./webview_content");
const header_content_1 = require("./header_content");
const storage_action_result_1 = require("../storage/storage_action_result");
class MovePage extends webview_content_1.WebViewContent {
    constructor(storageManager, webviewContentHelper) {
        super(webviewContentHelper);
        this.name = "moveTo";
        this.header = new header_content_1.HeaderContent(webviewContentHelper, "Move Database", this.name);
        this.webviewContentHelper = webviewContentHelper;
        this.storageManger = storageManager;
    }
    processMessage(operation, name, formData) {
        var _a, _b;
        if (operation === "submit" && name === "moveTo") {
            let params = JSON.parse(formData);
            let storageType = (_a = params.storageType) !== null && _a !== void 0 ? _a : "";
            let targetFile = (_b = params.targetFile) !== null && _b !== void 0 ? _b : "";
            if (storageType === "") {
                this.storageActionResult = storage_action_result_1.StorageActionResult.simpleError("No storage type selected.");
                this.refreshAfterAction();
                return;
            }
            if (storageType === "file" && targetFile === "") {
                this.storageActionResult = storage_action_result_1.StorageActionResult.simpleError("No target file selected.");
                this.refreshAfterAction();
                return;
            }
            this.storageManger.executeStorageAction("moveTo", storageType, targetFile, [], new Map()).then((storageActionResult) => {
                this.storageActionResult = storageActionResult;
                this.refreshAfterAction();
            });
        }
    }
    getContent() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.header.getContent()) +
                (yield this.bodyContent())
                + this.getStorageActionContent();
        });
    }
    bodyContent() {
        return __awaiter(this, void 0, void 0, function* () {
            let currentType = this.storageManger.getActiveStorage().getStorageType();
            let currentPath = this.storageManger.getActiveStorage().getStoragePath();
            let currentStorageText;
            if (currentType === "workspaceState") {
                currentStorageText = "workspace state";
            }
            else {
                currentStorageText = "JSON file: " + currentPath;
            }
            return `<form name="moveTo">
            <h2>Current location</h2>
            <p>
                ${currentStorageText}
            </p>
            <h2>Select new location</h2>
            <p>
                <div>
                    <label>
                        <input type="radio" name="storageType" value="workspaceState">
                        workspace state
                    </label>
                </div>
                <div class="file-selection">
                    <label><input type="radio" name="storageType" value="file"> JSON file</label>
                    <input
                        type="button"
                        class="file-selector"
                        data-file-input-name="targetFile"
                        data-access-type="write"
                        value="..."
                    />
                    <input
                        type="text"
                        name="targetFile"
                        readonly
                        placeholder="no file selected"
                    />
                </div>
            </p>
            <hr />
            <p>
                <input
                    type="button"
                    class="submit"
                    value="Move"
                    data-form="moveTo"
                />
            </p>
        </form>`;
        });
    }
}
exports.MovePage = MovePage;
//# sourceMappingURL=move_page.js.map
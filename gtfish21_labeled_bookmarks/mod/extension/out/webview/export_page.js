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
exports.ExportPage = void 0;
const webview_content_1 = require("./webview_content");
const header_content_1 = require("./header_content");
const storage_action_result_1 = require("../storage/storage_action_result");
class ExportPage extends webview_content_1.WebViewContent {
    constructor(storageManager, webviewContentHelper) {
        super(webviewContentHelper);
        this.name = "exportTo";
        this.header = new header_content_1.HeaderContent(webviewContentHelper, "Export", this.name);
        this.storageManger = storageManager;
    }
    processMessage(operation, name, formData) {
        var _a, _b;
        if (operation === "submit" && name === "export") {
            let params = JSON.parse(formData);
            let exportFile = (_a = params.exportFile) !== null && _a !== void 0 ? _a : "";
            let selectedGroups = (_b = params.groups) !== null && _b !== void 0 ? _b : [];
            if (exportFile === "") {
                this.storageActionResult = storage_action_result_1.StorageActionResult.simpleError("No export file selected.");
                this.refreshAfterAction();
                return;
            }
            if (selectedGroups.length === 0) {
                this.storageActionResult = storage_action_result_1.StorageActionResult.simpleError("No groups were selected.");
                this.refreshAfterAction();
                return;
            }
            this.storageManger.executeStorageAction("exportTo", "file", exportFile, selectedGroups, new Map()).then((storageActionResult) => {
                this.storageActionResult = storageActionResult;
                this.refreshAfterAction();
            });
        }
    }
    getContent() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.header.getContent())
                + (yield this.bodyContent())
                + this.getStorageActionContent();
        });
    }
    bodyContent() {
        return __awaiter(this, void 0, void 0, function* () {
            let activeStorageGroupControls = this.webviewContentHelper.getGroupListFormControls(this.storageManger.getActiveStorage().getGroups(), "groups");
            return `<form name="export">
            <h2>Select bookmark groups</h2>
            <p class="group-selection">
                ` + activeStorageGroupControls + `
            </p>

            <h2>Select target file</h2>
            <p class="file-selection">
                <input
                    type="button"
                    class="file-selector"
                    data-file-input-name="exportFile"
                    data-access-type="write"
                    value="..."
                />
                <input
                    type="text"
                    name="exportFile"
                    readonly
                    placeholder="no file selected"
                />
            </p>
 
            <hr />
            <p>
                <input
                    type="button"
                    class="submit"
                    value="Export"
                    data-form="export"
                />
            </p>
        </form>`;
        });
    }
}
exports.ExportPage = ExportPage;
//# sourceMappingURL=export_page.js.map
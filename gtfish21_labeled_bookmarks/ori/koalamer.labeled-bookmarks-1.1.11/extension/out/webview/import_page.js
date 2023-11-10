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
exports.ImportPage = void 0;
const vscode = require("vscode");
const webview_content_1 = require("./webview_content");
const header_content_1 = require("./header_content");
const storage_action_result_1 = require("../storage/storage_action_result");
const bookmark_storage_dummy_1 = require("../storage/bookmark_storage_dummy");
const bookmark_storage_in_file_1 = require("../storage/bookmark_storage_in_file");
class ImportPage extends webview_content_1.WebViewContent {
    constructor(storageManager, webviewContentHelper) {
        super(webviewContentHelper);
        this.importFilePath = "";
        this.importStorage = new bookmark_storage_dummy_1.BookmarkStorageDummy();
        this.selectedGroups = [];
        this.conflictResolutionMode = "rename";
        this.pathMapping = new Map();
        this.name = "importFrom";
        this.header = new header_content_1.HeaderContent(webviewContentHelper, "Import", this.name);
        this.storageManger = storageManager;
    }
    processMessage(operation, name, formData) {
        this.asyncProcessMessageMessage(operation, name, formData);
    }
    asyncProcessMessageMessage(operation, name, formData) {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function* () {
            if (operation === "submit" && name === "importFile") {
                let params = JSON.parse(formData);
                this.importFilePath = (_a = params.importFilePath) !== null && _a !== void 0 ? _a : "";
                this.selectedGroups = (_b = params.groups) !== null && _b !== void 0 ? _b : [];
                this.conflictResolutionMode = (_c = params.conflictResolution) !== null && _c !== void 0 ? _c : "";
                let incomingPaths = (_d = params.incomingPaths) !== null && _d !== void 0 ? _d : [];
                let assignedPaths = (_e = params.assignedPaths) !== null && _e !== void 0 ? _e : [];
                this.pathMapping = new Map();
                incomingPaths.forEach((v, key) => {
                    if (assignedPaths.length <= key) {
                        return;
                    }
                    let assignedPath = assignedPaths[key];
                    this.pathMapping.set(v, assignedPath);
                });
                if (this.importFilePath === "") {
                    this.storageActionResult = storage_action_result_1.StorageActionResult.simpleError("No export file selected.");
                    this.refreshAfterAction();
                    return;
                }
                this.importStorage = new bookmark_storage_in_file_1.BookmarkStorageInFile(vscode.Uri.file(this.importFilePath));
                try {
                    yield this.importStorage.readStorage();
                }
                catch (e) {
                    this.storageActionResult = storage_action_result_1.StorageActionResult.simpleError("Reading the storage file failed.");
                    this.refreshAfterAction();
                    return;
                }
                if (this.selectedGroups.length === 0) {
                    this.storageActionResult = storage_action_result_1.StorageActionResult.simpleError("No groups were selected.");
                    this.refreshAfterAction();
                    return;
                }
                if (!ImportPage.conflictResolutionModes.has(this.conflictResolutionMode)) {
                    this.storageActionResult = storage_action_result_1.StorageActionResult.simpleError("Invalid conflisct resolution mode.");
                    this.refreshAfterAction();
                    return;
                }
                // todo path mapping errors can be warnings runtime
                this.storageManger.executeStorageAction("exportTo", "file", this.importFilePath, this.selectedGroups, this.pathMapping).then((storageActionResult) => {
                    this.storageActionResult = storageActionResult;
                    this.refreshAfterAction();
                });
            }
        });
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
            let importFilePath = "";
            let activeStorageGroupControls = "";
            // let activeStorageGroupControls = this.webviewContentHelper.getGroupListFormControls(
            //     this.storageManger.getActiveStorage().getGroups(),
            //     "groups"
            // );
            return `<form name="export">
            <h2>Select source file</h2>
            <p class="file-selection">
                <input
                    type="button"
                    class="file-selector"
                    data-file-input-name="importFile"
                    data-access-type="read"
                    value="..."
                />
                <input
                    type="text"
                    name="importFile"
                    readonly
                    placeholder="no file selected"
                />
            </p>

            <h2>Select bookmark groups</h2>
            <p class="group-selection">
                ` + activeStorageGroupControls + `
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
exports.ImportPage = ImportPage;
ImportPage.conflictResolutionModes = new Map([
    ["skip", "keep existing groups"],
    ["merge", "merge contents of groups"],
    ["replace", "replace existing groups with imported"],
    ["rename", "rename incoming group"]
]);
//# sourceMappingURL=import_page.js.map
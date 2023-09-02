"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const util = require("./util");
const environment_1 = require("./environment");
const fileCreator_1 = require("./fileCreator");
function activate(context) {
    context.subscriptions.push(vscode.commands.registerCommand('templateGenerator.newFile', function (e) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield util.checkTemplatesFolder();
                let targetFolderPath = e && e.fsPath ? e.fsPath : vscode.workspace.rootPath;
                let fileCreator = new fileCreator_1.FileCreator(targetFolderPath);
                yield fileCreator.run();
            }
            catch (error) {
                vscode.window.showErrorMessage(`Template Generator: ${error.message}`);
            }
        });
    }));
    context.subscriptions.push(vscode.commands.registerCommand('templateGenerator.openTemplatesFolder', function () {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield util.checkTemplatesFolder();
                let uri = vscode.Uri.file(environment_1.default.templatesFolderPath);
                vscode.commands.executeCommand('vscode.openFolder', uri, true);
            }
            catch (error) {
                vscode.window.showErrorMessage(`Template Generator: ${error.message}`);
            }
        });
    }));
    environment_1.default.context = context;
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map
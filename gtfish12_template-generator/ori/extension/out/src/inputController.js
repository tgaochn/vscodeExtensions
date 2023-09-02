"use strict";
/**
 * @File   : inputController.ts
 * @Author : DengSir (tdaddon@163.com)
 * @Link   : https://dengsir.github.io/
 */
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
const validateNameRegex = (() => {
    if (process.platform === 'win32') {
        return /[/?*:|<>\\]/;
    }
    else if (process.platform === 'darwin') {
        return /[/:]/;
    }
    else {
        return /\//;
    }
})();
class InputController {
    constructor() { }
    showTemplatePicker(templates) {
        return __awaiter(this, void 0, void 0, function* () {
            let template = yield vscode.window.showQuickPick(templates, {
                placeHolder: 'Select file/folder template:',
            });
            return template;
        });
    }
    showNameInput() {
        return __awaiter(this, void 0, void 0, function* () {
            let fileName = yield vscode.window.showInputBox({
                placeHolder: 'Input file/folder name',
                validateInput: text => (validateNameRegex.test(text) ? 'Invalidate file name' : null),
            });
            return fileName;
        });
    }
    run(templates) {
        return __awaiter(this, void 0, void 0, function* () {
            let template = yield this.showTemplatePicker(templates);
            if (!template) {
                return {};
            }
            let fileName = yield this.showNameInput();
            if (!fileName) {
                return {};
            }
            return { template, fileName };
        });
    }
}
exports.InputController = InputController;
//# sourceMappingURL=inputController.js.map
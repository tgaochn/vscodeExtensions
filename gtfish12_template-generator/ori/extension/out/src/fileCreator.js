"use strict";
/**
 * @File   : fileCreator.ts
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
const fs = require("fs");
const path = require("path");
const mkdirp = require("mkdirp");
const environment_1 = require("./environment");
const template_1 = require("./template");
const inputController_1 = require("./inputController");
class FileCreator {
    constructor(targetFolderPath) {
        environment_1.default.targetFolderPath = targetFolderPath;
        this.templates = fs
            .readdirSync(environment_1.default.templatesFolderPath)
            .filter(f => !f.startsWith('.'))
            .map(f => new template_1.Template(f))
            .sort((a, b) => (a.weight < b.weight && -1) || (a.weight > b.weight && 1) || 0);
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            let template = yield this.askTemplate();
            if (!template) {
                return;
            }
            if (fs.existsSync(template.targetPath)) {
                throw Error('Target file/folder exists, can`t create.');
            }
            try {
                this.createTemplate(template);
            }
            catch (error) {
                throw Error('Create file/folder failed.');
            }
        });
    }
    askTemplate() {
        return __awaiter(this, void 0, void 0, function* () {
            let inputController = new inputController_1.InputController();
            let { template, fileName } = yield inputController.run(this.templates);
            if (!template) {
                return;
            }
            environment_1.default.fileName = fileName;
            return template;
        });
    }
    createTemplate(template) {
        for (let templateFile of template.templateFiles) {
            mkdirp.sync(path.dirname(templateFile.targetPath));
            fs.writeFileSync(templateFile.targetPath, templateFile.content);
        }
        let openFileConfig = environment_1.default.config.get(template.isFile() ? 'openFileByFileTemplate' : 'openFilesByFolderTemplate');
        if (openFileConfig) {
            for (let templateFile of template.templateFiles) {
                let uri = vscode.Uri.file(templateFile.targetPath);
                vscode.commands.executeCommand('vscode.open', uri);
            }
        }
    }
}
exports.FileCreator = FileCreator;
//# sourceMappingURL=fileCreator.js.map
"use strict";
/**
 * @File   : template.ts
 * @Author : DengSir (tdaddon@163.com)
 * @Link   : https://dengsir.github.io/
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const util = require("./util");
const decorators_1 = require("./decorators");
const templateFile_1 = require("./templateFile");
class Template {
    constructor(templatePath) {
        this.templatePath = templatePath;
        this._isFile = fs.statSync(util.absTemplatePath(templatePath)).isFile();
    }
    get label() {
        return util.convert(this.templatePath, true);
    }
    get weight() {
        return `${this.isFile() ? '0' : '1'}${this.label}`;
    }
    get description() {
        return this.isFile() ? 'File' : 'Folder';
    }
    get templateName() {
        return util.convert(this.templatePath);
    }
    get targetPath() {
        return util.absTargetPath(this.templateName);
    }
    get templateFiles() {
        return this.initTemplateFiles(this.templatePath);
    }
    initTemplateFiles(templatePath, templateFiles = []) {
        let fullPath = util.absTemplatePath(templatePath);
        let stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            fs.readdirSync(fullPath).map(f => this.initTemplateFiles(path.join(templatePath, f), templateFiles));
        }
        else if (stat.isFile()) {
            templateFiles.push(new templateFile_1.TemplateFile(templatePath));
        }
        return templateFiles;
    }
    isFile() {
        return this._isFile;
    }
}
__decorate([
    decorators_1.once()
], Template.prototype, "label", null);
__decorate([
    decorators_1.once()
], Template.prototype, "weight", null);
__decorate([
    decorators_1.once()
], Template.prototype, "templateName", null);
__decorate([
    decorators_1.once()
], Template.prototype, "targetPath", null);
__decorate([
    decorators_1.once()
], Template.prototype, "templateFiles", null);
exports.Template = Template;
//# sourceMappingURL=template.js.map
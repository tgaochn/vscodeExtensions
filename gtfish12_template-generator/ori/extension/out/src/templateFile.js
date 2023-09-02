"use strict";
/**
 * @File   : templateFile.ts
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
const util = require("./util");
const decorators_1 = require("./decorators");
class TemplateFile {
    constructor(templatePath) {
        this.templatePath = templatePath;
    }
    get targetPath() {
        return util.absTargetPath(util.convert(this.templatePath));
    }
    get content() {
        return util.convert(this.read());
    }
    read() {
        return fs.readFileSync(util.absTemplatePath(this.templatePath)).toString();
    }
}
__decorate([
    decorators_1.once()
], TemplateFile.prototype, "targetPath", null);
__decorate([
    decorators_1.once()
], TemplateFile.prototype, "content", null);
exports.TemplateFile = TemplateFile;
//# sourceMappingURL=templateFile.js.map
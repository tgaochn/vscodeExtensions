"use strict";
/**
 * @File   : environment.ts
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
const vscode = require("vscode");
const path = require("path");
const os = require("os");
const _ = require("lodash");
const decorators_1 = require("./decorators");
class Fields {
    get name() {
        return this._name;
    }
    get camelCaseName() {
        return _.camelCase(this._name);
    }
    get pascalCaseName() {
        return _.chain(this._name)
            .camelCase()
            .upperFirst()
            .value();
    }
    get snakeCaseName() {
        return _.snakeCase(this._name);
    }
    get kebabCaseName() {
        return _.kebabCase(this._name);
    }
    get lowerDotCaseName() {
        return this.snakeCaseName.replace(/_/g, '.');
    }
    set name(name) {
        this._name = name;
        this._camelCaseName = null;
        this._pascalCaseName = null;
        this._snakeCaseName = null;
        this._kebabCaseName = null;
        this._lowerDotCaseName = null;
    }
    get date() {
        return new Date().toLocaleString();
    }
    get author() {
        return this.config.get('fields.author');
    }
    get email() {
        return this.config.get('fields.email');
    }
    get link() {
        return this.config.get('fields.link');
    }
    get config() {
        return vscode.workspace.getConfiguration('templateGenerator');
    }
}
__decorate([
    decorators_1.once('_camelCaseName')
], Fields.prototype, "camelCaseName", null);
__decorate([
    decorators_1.once('_pascalCaseName')
], Fields.prototype, "pascalCaseName", null);
__decorate([
    decorators_1.once('_snakeCaseName')
], Fields.prototype, "snakeCaseName", null);
__decorate([
    decorators_1.once('_kebabCaseName')
], Fields.prototype, "kebabCaseName", null);
__decorate([
    decorators_1.once('_lowerDotCaseName')
], Fields.prototype, "lowerDotCaseName", null);
exports.Fields = Fields;
class Environment {
    constructor() {
        this.fields = new Fields();
    }
    get config() {
        return vscode.workspace.getConfiguration('templateGenerator');
    }
    get templatesFolderPath() {
        return this.config.get('templatesPath') || path.join(os.homedir(), '.vscode/templates');
    }
    set fileName(fileName) {
        this.fields.name = fileName;
    }
}
exports.Environment = Environment;
exports.default = new Environment();
//# sourceMappingURL=environment.js.map
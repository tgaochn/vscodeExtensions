"use strict";
/**
 * @File   : util.ts
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
const path = require("path");
const fs = require("mz/fs");
const environment_1 = require("./environment");
function convert(content, ignore_variables) {
    return content.replace(/\{__(name|email|author|link|date|delete|camelCaseName|pascalCaseName|snakeCaseName|kebabCaseName|lowerDotCaseName)__\.?([^{}]*)\}/g, (_, key, description) => (!ignore_variables ? environment_1.default.fields[key] || '' : description));
}
exports.convert = convert;
function absTemplatePath(...args) {
    return path.join(environment_1.default.templatesFolderPath, ...args);
}
exports.absTemplatePath = absTemplatePath;
function absTargetPath(...args) {
    return path.join(environment_1.default.targetFolderPath, ...args);
}
exports.absTargetPath = absTargetPath;
function copyFile(src, dst) {
    return new Promise((resolve, reject) => {
        fs
            .createReadStream(src)
            .pipe(fs.createWriteStream(dst))
            .on('close', err => {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
}
function copyFolder(src, dst) {
    return __awaiter(this, void 0, void 0, function* () {
        let stats = yield fs.stat(dst).catch(e => undefined);
        if (stats && !stats.isDirectory()) {
            throw Error('not folder');
        }
        yield fs.mkdir(dst);
        yield Promise.all((yield fs.readdir(src)).map((file) => __awaiter(this, void 0, void 0, function* () {
            let source = path.join(src, file);
            let target = path.join(dst, file);
            let stats = yield fs.stat(source);
            if (stats.isDirectory()) {
                yield copyFolder(source, target);
            }
            else if (stats.isFile()) {
                yield copyFile(source, target);
            }
        })));
    });
}
function checkTemplatesFolder() {
    return __awaiter(this, void 0, void 0, function* () {
        let templatesFolderPath = environment_1.default.templatesFolderPath;
        if (!(yield fs.exists(templatesFolderPath))) {
            yield copyFolder(path.join(environment_1.default.context.extensionPath, 'templates'), templatesFolderPath);
            return yield fs.exists(templatesFolderPath);
        }
        let stat = yield fs.stat(templatesFolderPath);
        if (!stat.isDirectory()) {
            return false;
        }
        return true;
    });
}
exports.checkTemplatesFolder = checkTemplatesFolder;
//# sourceMappingURL=util.js.map
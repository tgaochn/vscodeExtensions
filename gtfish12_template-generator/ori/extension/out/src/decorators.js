"use strict";
/**
 * @File   : decorators.ts
 * @Author : DengSir (tdaddon@163.com)
 * @Link   : https://dengsir.github.io/
 * @Date   : 2018-3-1 10:34:07
 */
Object.defineProperty(exports, "__esModule", { value: true });
function once(privateKey) {
    return function (target, propertyKey, descriptor) {
        let getter = descriptor.get;
        if (!privateKey) {
            privateKey = Symbol(propertyKey);
        }
        descriptor.get = function () {
            return (this[privateKey] = this[privateKey] || getter.call(this));
        };
    };
}
exports.once = once;
//# sourceMappingURL=decorators.js.map
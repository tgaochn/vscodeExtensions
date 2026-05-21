"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ExtendedMap {
    constructor(defaultValueFunction) {
        this.defaultValueFunction = defaultValueFunction;
        this.map = new Map();
    }
    get(key) {
        if (!this.map.has(key.toString())) {
            this.map.set(key.toString(), this.defaultValueFunction(key));
        }
        return this.map.get(key.toString());
    }
    has(key) {
        return this.map.has(key.toString());
    }
    set(key, value) {
        this.map.set(key.toString(), value);
        return this;
    }
    clear() {
        this.map.clear();
    }
    values() {
        return this.map.values();
    }
}
exports.default = ExtendedMap;
//# sourceMappingURL=extendedMap.js.map
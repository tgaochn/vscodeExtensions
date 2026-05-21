"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const extendedMap_1 = require("../utils/classes/extendedMap");
class BetterFoldingRangeProvider {
    constructor() {
        this.documentToFoldingRanges = new extendedMap_1.default(async () => []);
    }
    async provideFoldingRanges(document) {
        return this.documentToFoldingRanges.get(document.uri);
    }
    updateRanges(document) {
        this.documentToFoldingRanges.set(document.uri, this.calculateFoldingRanges(document));
    }
    restart() {
        this.documentToFoldingRanges.clear();
    }
}
exports.default = BetterFoldingRangeProvider;
//# sourceMappingURL=betterFoldingRangeProvider.js.map
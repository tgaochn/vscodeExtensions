"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bookmark = void 0;
class Bookmark {
    constructor(fsPath, lineNumber, characterNumber, label, lineText, group, decorationFactory) {
        this.fsPath = fsPath;
        this.lineNumber = lineNumber;
        this.characterNumber = characterNumber;
        this.label = label;
        this.lineText = lineText;
        this.failedJump = false;
        this.isLineNumberChanged = false;
        this.group = group;
        this.decorationFactory = decorationFactory;
        this.ownDecoration = null;
        this.bookmarkDecorationUpdatedHandler = (bookmark) => { return; };
        this.decorationRemovedHandler = (decoration) => { return; };
    }
    static fromSerializableBookMark(serialized, groupGetter, decorationFactory) {
        return new Bookmark(serialized.fsPath, serialized.lineNumber, serialized.characterNumber, serialized.label, serialized.lineText, groupGetter(serialized.groupName), decorationFactory);
    }
    static sortByLocation(a, b) {
        return a.fsPath.localeCompare(b.fsPath)
            || (a.lineNumber - b.lineNumber)
            || (a.characterNumber - b.characterNumber);
    }
    resetIsLineNumberChangedFlag() {
        this.isLineNumberChanged = false;
    }
    setLineAndCharacterNumbers(lineNumber, characterNumber) {
        this.characterNumber = characterNumber;
        if (lineNumber === this.lineNumber) {
            return;
        }
        this.lineNumber = lineNumber;
        this.isLineNumberChanged = true;
    }
    getDecoration() {
        if (this.group.isActive && this.group.isVisible) {
            return this.ownDecoration || this.group.getActiveDecoration();
        }
        else {
            return this.group.getActiveDecoration();
        }
    }
    onBookmarkDecorationUpdated(fn) {
        this.bookmarkDecorationUpdatedHandler = fn;
    }
    onDecorationRemoved(fn) {
        this.decorationRemovedHandler = fn;
    }
    initDecoration() {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof this.label === "undefined") {
                return;
            }
            let previousDecoration = this.ownDecoration;
            let tempSvg;
            [this.ownDecoration, tempSvg] = yield this.decorationFactory.create(this.group.shape, this.group.color, this.group.iconText, this.label);
            if (previousDecoration !== null) {
                this.decorationRemovedHandler(previousDecoration);
            }
            this.bookmarkDecorationUpdatedHandler(this);
        });
    }
    switchDecoration() {
        if (this.ownDecoration !== null) {
            this.decorationRemovedHandler(this.ownDecoration);
        }
        this.bookmarkDecorationUpdatedHandler(this);
    }
}
exports.Bookmark = Bookmark;
//# sourceMappingURL=bookmark.js.map
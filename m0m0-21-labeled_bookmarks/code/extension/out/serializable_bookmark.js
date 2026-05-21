"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SerializableBookmark = void 0;
class SerializableBookmark {
    constructor(fsPath, lineNumber, characterNumber, label, lineText, groupName) {
        this.fsPath = fsPath;
        this.lineNumber = lineNumber;
        this.characterNumber = characterNumber;
        this.label = label;
        this.lineText = lineText;
        this.isLineNumberChanged = false;
        this.groupName = groupName;
    }
    static fromBookmark(bookmark) {
        return new SerializableBookmark(bookmark.fsPath, bookmark.lineNumber, bookmark.characterNumber, bookmark.label, bookmark.lineText, bookmark.group.name);
    }
}
exports.SerializableBookmark = SerializableBookmark;
//# sourceMappingURL=serializable_bookmark.js.map
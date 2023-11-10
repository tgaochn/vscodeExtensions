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
    static copyOne(sbm) {
        return new SerializableBookmark(sbm.fsPath, sbm.lineNumber, sbm.characterNumber, sbm.label, sbm.lineText, sbm.groupName);
    }
    static copyList(list) {
        let newList = new Array();
        for (const sb of list) {
            let copy = SerializableBookmark.copyOne(sb);
            newList.push(copy);
        }
        ;
        return newList;
    }
}
exports.SerializableBookmark = SerializableBookmark;
//# sourceMappingURL=serializable_bookmark.js.map
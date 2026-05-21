"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupPickItem = void 0;
class GroupPickItem {
    constructor(group, label, description, detail, picked = false, alwaysShow = false) {
        this.group = group;
        this.label = label;
        this.description = description;
        this.detail = detail;
        this.picked = picked;
        this.alwaysShow = alwaysShow;
    }
    static fromGroup(group, bookmarkCount) {
        let label = group.name;
        label = (group.isActive ? "● " : "◌ ") + label;
        let description = " $(bookmark) " + bookmarkCount;
        let detail = "";
        return new GroupPickItem(group, label, description, detail);
    }
}
exports.GroupPickItem = GroupPickItem;
//# sourceMappingURL=group_pick_item.js.map
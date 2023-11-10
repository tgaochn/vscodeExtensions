"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SerializableGroup = void 0;
class SerializableGroup {
    constructor(name, color, shape, iconText) {
        this.name = name;
        this.color = color;
        this.shape = shape;
        this.iconText = iconText;
    }
    static fromGroup(group) {
        return new SerializableGroup(group.name, group.color, group.shape, group.iconText);
    }
    static copyOne(g) {
        return new SerializableGroup(g.name, g.color, g.shape, g.iconText);
    }
    static copyList(list) {
        let newList = new Array();
        for (let sg of list) {
            let copy = SerializableGroup.copyOne(sg);
            newList.push(copy);
        }
        ;
        return newList;
    }
}
exports.SerializableGroup = SerializableGroup;
//# sourceMappingURL=serializable_group.js.map
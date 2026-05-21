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
exports.Group = void 0;
class Group {
    constructor(name, color, shape, iconText, decorationFactory) {
        this.decorationFactory = decorationFactory;
        this.name = name;
        this.color = this.decorationFactory.normalizeColorFormat(color);
        this.shape = shape;
        this.iconText = iconText;
        this.inactiveColor = this.color.substring(0, 6) + Group.inactiveTransparency;
        this.isActive = false;
        this.isVisible = false;
        this.isInitialized = false;
        this.decoration = this.decorationFactory.placeholderDecoration;
        this.decorationSvg = this.decorationFactory.placeholderDecorationUri;
        this.inactiveDecoration = this.decorationFactory.placeholderDecoration;
        this.inactiveDecorationSvg = this.decorationFactory.placeholderDecorationUri;
        this.groupDecorationUpdatedHandler = (group) => { return; };
        this.groupDecorationSwitchedHandler = (group) => { return; };
        this.decorationRemovedHandler = (decoration) => { return; };
    }
    static fromSerializableGroup(sg, decorationFactory) {
        return new Group(sg.name, sg.color, sg.shape, sg.iconText, decorationFactory);
    }
    static sortByName(a, b) {
        return a.name.localeCompare(b.name);
    }
    onGroupDecorationUpdated(fn) {
        this.groupDecorationUpdatedHandler = fn;
    }
    onGroupDecorationSwitched(fn) {
        this.groupDecorationSwitchedHandler = fn;
    }
    onDecorationRemoved(fn) {
        this.decorationRemovedHandler = fn;
    }
    initDecorations() {
        return __awaiter(this, void 0, void 0, function* () {
            [this.decoration, this.decorationSvg] = yield this.decorationFactory.create(this.shape, this.color, this.iconText);
            [this.inactiveDecoration, this.inactiveDecorationSvg] = yield this.decorationFactory.create(this.shape, this.inactiveColor, this.iconText);
            this.isInitialized = true;
            this.groupDecorationUpdatedHandler(this);
        });
    }
    getColor() {
        return this.color;
    }
    getActiveDecoration() {
        if (!this.isVisible || !this.isInitialized) {
            return null;
        }
        if (this.isActive) {
            return this.decoration;
        }
        return this.inactiveDecoration;
    }
    setIsActive(isActive) {
        if (this.isActive === isActive) {
            return;
        }
        let activeDecoration = this.getActiveDecoration();
        if (activeDecoration !== null) {
            this.decorationRemovedHandler(activeDecoration);
        }
        this.isActive = isActive;
        this.groupDecorationSwitchedHandler(this);
    }
    setIsVisible(isVisible) {
        if (this.isVisible === isVisible) {
            return;
        }
        let activeDecoration = this.getActiveDecoration();
        if (activeDecoration !== null) {
            this.decorationRemovedHandler(activeDecoration);
        }
        this.isVisible = isVisible;
        this.groupDecorationSwitchedHandler(this);
    }
    setShapeAndIconText(shape, iconText) {
        if (this.shape === shape && this.iconText === iconText) {
            return;
        }
        this.removeDecorations();
        this.shape = shape;
        this.iconText = iconText;
        this.initDecorations();
    }
    setColor(color) {
        if (this.color === color) {
            return;
        }
        this.removeDecorations();
        this.color = this.decorationFactory.normalizeColorFormat(color);
        this.inactiveColor = this.color.substring(0, 6) + Group.inactiveTransparency;
        this.initDecorations();
    }
    redoDecorations() {
        this.removeDecorations();
        this.initDecorations();
    }
    removeDecorations() {
        this.isInitialized = false;
        this.decorationRemovedHandler(this.decoration);
        this.decorationRemovedHandler(this.inactiveDecoration);
    }
}
exports.Group = Group;
Group.inactiveTransparency = "33";
//# sourceMappingURL=group.js.map
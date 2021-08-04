"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompositeIndex = void 0;
const decoratorMeta_1 = require("../decoratorMeta");
function CompositeIndex(fields = {}, hasAncestor = false) {
    return (target) => {
        decoratorMeta_1.decoratorMeta.addEntityCompositeIndex(target, fields, hasAncestor);
    };
}
exports.CompositeIndex = CompositeIndex;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Field = void 0;
const decoratorMeta_1 = require("../decoratorMeta");
function Field(options = {}) {
    return (target, fieldName) => {
        decoratorMeta_1.decoratorMeta.addEntityFieldMeta(target.constructor, fieldName, Object.assign({ generateId: false, index: false, excludeFromIndexes: [] }, options));
    };
}
exports.Field = Field;

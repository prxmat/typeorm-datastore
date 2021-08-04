"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeforeInsert = void 0;
const decoratorMeta_1 = require("../../decoratorMeta");
// tslint:disable-next-line:variable-name
const BeforeInsert = () => {
    return (target, propertyKey, descriptor) => {
        decoratorMeta_1.decoratorMeta.addHookOfBeforeInsert(target.constructor, propertyKey);
    };
};
exports.BeforeInsert = BeforeInsert;

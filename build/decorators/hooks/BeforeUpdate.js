"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeforeUpdate = void 0;
const decoratorMeta_1 = require("../../decoratorMeta");
// tslint:disable-next-line:variable-name
const BeforeUpdate = () => {
    return (target, propertyKey, descriptor) => {
        decoratorMeta_1.decoratorMeta.addHookOfBeforeUpdate(target.constructor, propertyKey);
    };
};
exports.BeforeUpdate = BeforeUpdate;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeforeDelete = void 0;
const decoratorMeta_1 = require("../../decoratorMeta");
// tslint:disable-next-line:variable-name
const BeforeDelete = () => {
    return (target, propertyKey, descriptor) => {
        decoratorMeta_1.decoratorMeta.addHookOfBeforeDelete(target.constructor, propertyKey);
    };
};
exports.BeforeDelete = BeforeDelete;

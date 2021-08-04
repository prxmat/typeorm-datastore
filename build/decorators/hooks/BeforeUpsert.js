"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeforeUpsert = void 0;
const decoratorMeta_1 = require("../../decoratorMeta");
// tslint:disable-next-line:variable-name
const BeforeUpsert = () => {
    return (target, propertyKey, descriptor) => {
        decoratorMeta_1.decoratorMeta.addHookOfBeforeUpsert(target.constructor, propertyKey);
    };
};
exports.BeforeUpsert = BeforeUpsert;

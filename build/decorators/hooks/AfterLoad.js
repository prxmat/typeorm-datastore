"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AfterLoad = void 0;
const decoratorMeta_1 = require("../../decoratorMeta");
// tslint:disable-next-line:variable-name
const AfterLoad = () => {
    return (target, propertyKey, descriptor) => {
        decoratorMeta_1.decoratorMeta.addHookOfAfterLoad(target.constructor, propertyKey);
    };
};
exports.AfterLoad = AfterLoad;

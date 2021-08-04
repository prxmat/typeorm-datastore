"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseEntity = void 0;
const DatastoreEntity = __importStar(require("@google-cloud/datastore/build/src/entity"));
const decoratorMeta_1 = require("./decoratorMeta");
class BaseEntity {
    constructor() {
        const entityMeta = decoratorMeta_1.decoratorMeta.entityMetaMap.get(this.constructor);
        // we need to pre-fill the followings
        this._kind = entityMeta.kind;
        this._namespace = entityMeta.namespace;
        Object.defineProperty(this, "_kind", {
            value: entityMeta.kind,
            enumerable: entityMeta.enumerable,
            writable: true,
            configurable: true,
        });
        Object.defineProperty(this, "_namespace", {
            value: entityMeta.namespace,
            enumerable: entityMeta.enumerable,
            writable: true,
            configurable: true,
        });
        Object.defineProperty(this, "_ancestorKey", {
            value: undefined,
            enumerable: entityMeta.enumerable,
            writable: true,
            configurable: true,
        });
    }
    getKey() {
        const key = new DatastoreEntity.entity.Key({ namespace: this._namespace, path: [this._kind] });
        if (typeof this._id === "number") {
            key.id = this._id.toString();
        }
        else if (typeof this._id === "string") {
            key.name = this._id;
        }
        if (this._ancestorKey) {
            key.parent = this._ancestorKey;
        }
        return key;
    }
}
exports.BaseEntity = BaseEntity;

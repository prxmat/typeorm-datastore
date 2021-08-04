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
exports.typeDatastoreOrm = void 0;
const DatastoreEntity = __importStar(require("@google-cloud/datastore/build/src/entity"));
const BaseEntity_1 = require("./BaseEntity");
const decoratorMeta_1 = require("./decoratorMeta");
const TypeDatastoreOrmError_1 = require("./errors/TypeDatastoreOrmError");
class TypeDatastoreOrm {
    constructor() {
        this.useFriendlyErrorStack = true;
    }
    /** @internal */
    getFriendlyErrorStack() {
        if (this.useFriendlyErrorStack) {
            return new Error().stack;
        }
    }
    /** @internal */
    getInsertData(entity) {
        const key = entity.getKey();
        const data = this.getData(entity);
        // make the key able to have auto generate
        let isGenerateId = decoratorMeta_1.decoratorMeta.isGenerateId(entity.constructor);
        // if we not generate id, we need to make sure key is not empty
        if (this.isEmptyKey(key)) {
            if (isGenerateId) {
                // we set this to undefined since it may be 0 or ""
                key.id = undefined;
            }
            else {
                throw new TypeDatastoreOrmError_1.TypeDatastoreOrmError(`_id must not be 0, empty string or undefined.`);
            }
        }
        else {
            // set the flag to false if key is not empty
            isGenerateId = false;
        }
        const excludeFromIndexes = decoratorMeta_1.decoratorMeta.getExcludeFromIndexes(entity.constructor);
        const insertData = {
            key,
            excludeFromIndexes,
            data,
        };
        return { insertData, isGenerateId };
    }
    /** @internal */
    getUpdateData(entity) {
        const key = entity.getKey();
        const data = this.getData(entity);
        const excludeFromIndexes = decoratorMeta_1.decoratorMeta.getExcludeFromIndexes(entity.constructor);
        const updateData = {
            key,
            excludeFromIndexes,
            data,
        };
        return { updateData };
    }
    /** @internal */
    getData(entity) {
        const fieldNames = decoratorMeta_1.decoratorMeta.getEntityFieldNames(entity.constructor);
        const data = {};
        for (const fieldName of fieldNames) {
            if (fieldName !== "_id") {
                data[fieldName] = entity[fieldName];
            }
        }
        return data;
    }
    /** @internal */
    loadEntity(classObject, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = data[DatastoreEntity.entity.KEY_SYMBOL];
            const entityFields = decoratorMeta_1.decoratorMeta.getEntityFieldMetaList(classObject);
            const entity = new classObject();
            entity._namespace = key.namespace;
            entity._kind = key.kind;
            for (const [fieldName, options] of entityFields.entries()) {
                if (fieldName in data) {
                    entity[fieldName] = data[fieldName];
                }
            }
            // fill up the _id
            if (key.id) {
                entity._id = Number(key.id);
            }
            else if (key.name) {
                entity._id = key.name;
            }
            if (key.parent) {
                entity._ancestorKey = key.parent;
            }
            yield this.runHookOfAfterLoad(entity);
            return entity;
        });
    }
    /** @internal */
    normalizeAndValidateKeys(values, namespace, kind) {
        const keys = values.map(x => this.normalizeAsKey(x, namespace, kind));
        this.validateKey(keys, namespace, kind);
        return keys;
    }
    /** @internal */
    normalizeAndValidateKey(value, namespace, kind) {
        const key = this.normalizeAsKey(value, namespace, kind);
        this.validateKey(key, namespace, kind);
        return key;
    }
    /** @internal */
    normalizeAsKey(value, namespace, kind) {
        if (value instanceof BaseEntity_1.BaseEntity) {
            return value.getKey();
        }
        else if (value instanceof DatastoreEntity.entity.Key) {
            return value;
        }
        else {
            return new DatastoreEntity.entity.Key({ namespace, path: [kind, value] });
        }
    }
    /** @internal */
    isEmptyKey(key) {
        if (key.id === "0" || key.name === "" || (key.id === undefined && key.name === undefined)) {
            return true;
        }
        return false;
    }
    /** @internal */
    validateKey(keys, namespace, kind, checkEmptyKey = true) {
        for (const key of (Array.isArray(keys) ? keys : [keys])) {
            if (key.namespace !== namespace) {
                throw new TypeDatastoreOrmError_1.TypeDatastoreOrmError(`Namespace not match. Entity namespace is "${key.namespace}". While the expected namespace is "${namespace}".`);
            }
            if (key.kind !== kind) {
                throw new TypeDatastoreOrmError_1.TypeDatastoreOrmError(`Kind not match. Entity kind is "${key.kind}". While the expected kind is "${kind}".`);
            }
            if (checkEmptyKey && this.isEmptyKey(key)) {
                throw new TypeDatastoreOrmError_1.TypeDatastoreOrmError(`_id must not be 0, empty string or undefined.`);
            }
        }
    }
    /** @internal */
    validateEntity(entities, namespace, kind, checkEmptyKey = true) {
        for (const entity of (Array.isArray(entities) ? entities : [entities])) {
            this.validateKey(entity.getKey(), namespace, kind, checkEmptyKey);
        }
    }
    /** @internal */
    runHookOfBeforeInsert(entities) {
        for (const entity of (Array.isArray(entities) ? entities : [entities])) {
            const hook = decoratorMeta_1.decoratorMeta.getHookOfBeforeInsert(entity.constructor);
            if (hook) {
                entity[hook]("beforeInsert");
            }
        }
    }
    /** @internal */
    runHookOfBeforeUpsert(entities) {
        for (const entity of (Array.isArray(entities) ? entities : [entities])) {
            const hook = decoratorMeta_1.decoratorMeta.getHookOfBeforeUpsert(entity.constructor);
            if (hook) {
                entity[hook]("beforeUpsert");
            }
        }
    }
    /** @internal */
    runHookOfBeforeUpdate(entities) {
        for (const entity of (Array.isArray(entities) ? entities : [entities])) {
            const hook = decoratorMeta_1.decoratorMeta.getHookOfBeforeUpdate(entity.constructor);
            if (hook) {
                entity[hook]("beforeUpdate");
            }
        }
    }
    /** @internal */
    runHookOfBeforeDelete(entities) {
        for (const entity of (Array.isArray(entities) ? entities : [entities])) {
            const hook = decoratorMeta_1.decoratorMeta.getHookOfBeforeDelete(entity.constructor);
            if (hook) {
                entity[hook]("beforeDelete");
            }
        }
    }
    /** @internal */
    runHookOfAfterLoad(entity) {
        const hook = decoratorMeta_1.decoratorMeta.getHookOfAfterLoad(entity.constructor);
        if (hook) {
            entity[hook]("afterLoad");
        }
    }
}
exports.typeDatastoreOrm = new TypeDatastoreOrm();

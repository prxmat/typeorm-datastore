"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decoratorMeta = void 0;
const TypeDatastoreOrmError_1 = require("./errors/TypeDatastoreOrmError");
class DecoratorMeta {
    constructor() {
        this.entityMetaMap = new Map();
        this.entityFieldMetaListMap = new Map();
        this.compositeIndexListMap = new Map();
        this.entityHookOfBeforeInsertMap = new Map();
        this.entityHookOfBeforeUpsertMap = new Map();
        this.entityHookOfBeforeUpdateMap = new Map();
        this.entityHookOfBeforeDeleteMap = new Map();
        this.entityHookOfAfterLoadMap = new Map();
    }
    addEntityMeta(classObject, options) {
        this.entityMetaMap.set(classObject, options);
    }
    hasEntityMeta(classObject) {
        return this.entityMetaMap.has(classObject);
    }
    getEntityMeta(classObject) {
        const entityMeta = this.entityMetaMap.get(classObject);
        if (!entityMeta) {
            throw new TypeDatastoreOrmError_1.TypeDatastoreOrmError(`(${classObject.name}) Entity must define with class decorator @Entity().`);
        }
        return entityMeta;
    }
    addEntityCompositeIndex(classObject, fields, hasAncestor) {
        if (!this.compositeIndexListMap.has(classObject)) {
            this.compositeIndexListMap.set(classObject, []);
        }
        const compositeIndexList = this.compositeIndexListMap.get(classObject);
        compositeIndexList.push({
            fields,
            hasAncestor,
        });
    }
    getEntityCompositeIndexList(classObject) {
        const entityCompositeIndexes = this.compositeIndexListMap.get(classObject);
        return entityCompositeIndexes || [];
    }
    // this allow overriding of settings
    addEntityFieldMeta(classObject, fieldName, options) {
        let map = this.entityFieldMetaListMap.get(classObject);
        if (!map) {
            map = new Map();
            this.entityFieldMetaListMap.set(classObject, map);
        }
        map.set(fieldName, options);
    }
    hasEntityFieldMetaList(classObject) {
        return this.entityFieldMetaListMap.has(classObject);
    }
    hasEntityFieldMeta(classObject, fieldName) {
        const entityFieldMeta = this.entityFieldMetaListMap.get(classObject);
        return entityFieldMeta ? entityFieldMeta.has(fieldName) : false;
    }
    getEntityFieldMetaList(classObject) {
        return this.entityFieldMetaListMap.get(classObject);
    }
    getEntityFieldNames(classObject) {
        const map = this.entityFieldMetaListMap.get(classObject);
        return Array.from(map.keys());
    }
    addHookOfBeforeInsert(classObject, propertyKey) {
        this.entityHookOfBeforeInsertMap.set(classObject, propertyKey);
    }
    getHookOfBeforeInsert(classObject) {
        return this.entityHookOfBeforeInsertMap.get(classObject);
    }
    addHookOfBeforeUpsert(classObject, propertyKey) {
        this.entityHookOfBeforeUpsertMap.set(classObject, propertyKey);
    }
    getHookOfBeforeUpsert(classObject) {
        return this.entityHookOfBeforeUpsertMap.get(classObject);
    }
    addHookOfBeforeUpdate(classObject, propertyKey) {
        this.entityHookOfBeforeUpdateMap.set(classObject, propertyKey);
    }
    getHookOfBeforeUpdate(classObject) {
        return this.entityHookOfBeforeUpdateMap.get(classObject);
    }
    addHookOfBeforeDelete(classObject, propertyKey) {
        this.entityHookOfBeforeDeleteMap.set(classObject, propertyKey);
    }
    getHookOfBeforeDelete(classObject) {
        return this.entityHookOfBeforeDeleteMap.get(classObject);
    }
    addHookOfAfterLoad(classObject, propertyKey) {
        this.entityHookOfAfterLoadMap.set(classObject, propertyKey);
    }
    getHookOfAfterLoad(classObject) {
        return this.entityHookOfAfterLoadMap.get(classObject);
    }
    mergeHooks(classObject, subClassObject) {
        for (const map of [this.entityHookOfAfterLoadMap, this.entityHookOfBeforeInsertMap,
            this.entityHookOfBeforeUpsertMap, this.entityHookOfBeforeUpdateMap, this.entityHookOfBeforeDeleteMap]) {
            if (!map.has(classObject)) {
                const propertyKey = map.get(subClassObject);
                if (propertyKey) {
                    map.set(classObject, propertyKey);
                }
            }
        }
    }
    isGenerateId(classObject) {
        const map = this.entityFieldMetaListMap.get(classObject);
        const fieldMap = map.get("_id");
        return !!(fieldMap.generateId);
    }
    getExcludeFromIndexes(target) {
        const entityMeta = this.getEntityMeta(target);
        return entityMeta.excludeFromIndexes;
    }
}
exports.decoratorMeta = new DecoratorMeta();

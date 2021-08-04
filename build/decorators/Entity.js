"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entity = void 0;
const BaseEntity_1 = require("../BaseEntity");
const decoratorMeta_1 = require("../decoratorMeta");
const TypeDatastoreOrmError_1 = require("../errors/TypeDatastoreOrmError");
function Entity(options = {}) {
    return (target) => {
        // we search the subclass decorators as well
        let subClassTarget = Object.getPrototypeOf(target);
        while (true) {
            // no more sub class
            if (!(subClassTarget instanceof Function)) {
                break;
            }
            if (subClassTarget !== BaseEntity_1.BaseEntity) {
                // copy the fields from subclass
                if (decoratorMeta_1.decoratorMeta.hasEntityFieldMetaList(subClassTarget)) {
                    const subClassEntityFieldMeta = decoratorMeta_1.decoratorMeta.getEntityFieldMetaList(subClassTarget);
                    for (const [fieldName, entityFieldMetaOptions] of subClassEntityFieldMeta.entries()) {
                        if (!decoratorMeta_1.decoratorMeta.hasEntityFieldMeta(target, fieldName)) {
                            decoratorMeta_1.decoratorMeta.addEntityFieldMeta(target, fieldName, entityFieldMetaOptions);
                        }
                    }
                }
                // copy the hooks from subclass
                decoratorMeta_1.decoratorMeta.mergeHooks(target, subClassTarget);
            }
            // continue to find sub class
            subClassTarget = Object.getPrototypeOf(subClassTarget);
        }
        // check if has id
        if (!decoratorMeta_1.decoratorMeta.hasEntityFieldMetaList(target)) {
            throw new TypeDatastoreOrmError_1.TypeDatastoreOrmError(`(${target.name}) Entity must define an _id field with property decorator @Field().`);
        }
        const entityFieldMeta = decoratorMeta_1.decoratorMeta.getEntityFieldMetaList(target);
        const fieldNames = Array.from(entityFieldMeta.keys());
        // check if we have a id column
        if (!fieldNames.includes("_id")) {
            throw new TypeDatastoreOrmError_1.TypeDatastoreOrmError(`(${target.name}) Entity must define an _id field with property decorator @Field().`);
        }
        // create exclude from indexes
        const excludeFromIndexes = [];
        for (const [fieldName, entityFieldMetaOptions] of entityFieldMeta.entries()) {
            if (!entityFieldMetaOptions.index) {
                // we don't have to exclude id, it's always indexed in ASC
                if (fieldName !== "_id") {
                    excludeFromIndexes.push(fieldName);
                }
            }
            else if (entityFieldMetaOptions.excludeFromIndexes.length) {
                for (const subColumn of entityFieldMetaOptions.excludeFromIndexes) {
                    excludeFromIndexes.push(`${subColumn}`);
                }
            }
        }
        // add entity meta
        decoratorMeta_1.decoratorMeta.addEntityMeta(target, {
            kind: options.kind || target.name,
            namespace: options.namespace === "" ? undefined : options.namespace,
            excludeFromIndexes,
            enumerable: options.enumerable || false,
        });
    };
}
exports.Entity = Entity;

"use strict";
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
exports.Session = void 0;
const BaseEntity_1 = require("../BaseEntity");
const TypeDatastoreOrmError_1 = require("../errors/TypeDatastoreOrmError");
const typeDatastoreOrm_1 = require("../typeDatastoreOrm");
class Session {
    constructor(options) {
        // prevent duplicate
        this.generateIdEntities = new Map();
        // hook use
        this.insertEntities = [];
        this.upsertEntities = [];
        this.updateEntities = [];
        this.deleteEntities = [];
        this.transaction = options.transaction;
    }
    /** @internal */
    allocateIds(key, total) {
        return __awaiter(this, void 0, void 0, function* () {
            const [ids] = yield this.transaction.allocateIds(key, total);
            return ids.map(x => Number(x.id));
        });
    }
    /** @internal */
    findOne(classObject, key) {
        return __awaiter(this, void 0, void 0, function* () {
            const [data] = yield this.transaction.get(key);
            if (data) {
                return yield typeDatastoreOrm_1.typeDatastoreOrm.loadEntity(classObject, data);
            }
        });
    }
    /** @internal */
    findMany(classObject, keys) {
        return __awaiter(this, void 0, void 0, function* () {
            const [results] = yield this.transaction.get(keys);
            const entities = [];
            if (results) {
                for (const data of results) {
                    const entity = yield typeDatastoreOrm_1.typeDatastoreOrm.loadEntity(classObject, data);
                    entities.push(entity);
                }
            }
            return entities;
        });
    }
    /** @internal */
    insert(entities) {
        typeDatastoreOrm_1.typeDatastoreOrm.runHookOfBeforeInsert(entities);
        for (const entity of Array.isArray(entities) ? entities : [entities]) {
            const { isGenerateId, insertData } = this._internalInsertOne(entity);
            this.transaction.insert(insertData);
            // hook use
            this.insertEntities.push(entity);
        }
    }
    /** @internal */
    upsert(entities) {
        typeDatastoreOrm_1.typeDatastoreOrm.runHookOfBeforeUpsert(entities);
        for (const entity of Array.isArray(entities) ? entities : [entities]) {
            const { isGenerateId, insertData } = this._internalInsertOne(entity);
            this.transaction.upsert(insertData);
            // hook use
            this.upsertEntities.push(entity);
        }
    }
    /** @internal */
    update(entities) {
        typeDatastoreOrm_1.typeDatastoreOrm.runHookOfBeforeUpdate(entities);
        for (const entity of Array.isArray(entities) ? entities : [entities]) {
            const { updateData } = typeDatastoreOrm_1.typeDatastoreOrm.getUpdateData(entity);
            this.transaction.update(updateData);
            // hook use
            this.updateEntities.push(entity);
        }
    }
    /** @internal */
    delete(entities) {
        for (const entity of (Array.isArray(entities) ? entities : [entities])) {
            const key = typeDatastoreOrm_1.typeDatastoreOrm.normalizeAsKey(entity, entity._namespace, entity._kind);
            this.transaction.delete(key);
            if (entity instanceof BaseEntity_1.BaseEntity) {
                typeDatastoreOrm_1.typeDatastoreOrm.runHookOfBeforeDelete(entity);
                this.deleteEntities.push(entity);
            }
        }
    }
    /** @internal */
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.transaction.run();
        });
    }
    /** @internal */
    commit() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.transaction.skipCommit) {
                const [response] = yield this.transaction.commit();
                const mutationResults = response.mutationResults;
                // update back the auto generate id
                for (const [entity, key] of this.generateIdEntities.entries()) {
                    entity._id = Number(key.id);
                }
            }
        });
    }
    rollback() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.transaction.rollback();
        });
    }
    _internalInsertOne(entity) {
        const data = typeDatastoreOrm_1.typeDatastoreOrm.getInsertData(entity);
        if (data.isGenerateId) {
            if (this.generateIdEntities.has(entity)) {
                throw new TypeDatastoreOrmError_1.TypeDatastoreOrmError(`You cannot insert the same entity.`);
            }
            this.generateIdEntities.set(entity, data.insertData.key);
        }
        return data;
    }
}
exports.Session = Session;

import * as Datastore from "@google-cloud/datastore";
import * as DatastoreEntity from "@google-cloud/datastore/build/src/entity";
import {BaseEntity} from "../BaseEntity";
import {TypeDatastoreOrmError} from "../errors/TypeDatastoreOrmError";
import {typeDatastoreOrm} from "../typeDatastoreOrm";
import {IEntityKeyType, IGetInsertData} from "../types";

export class Session {
    public readonly transaction: Datastore.Transaction;

    // prevent duplicate
    private readonly generateIdEntities: Map<BaseEntity, DatastoreEntity.entity.Key> = new Map();

    // hook use
    private readonly insertEntities: BaseEntity[] = [];
    private readonly upsertEntities: BaseEntity[] = [];
    private readonly updateEntities: BaseEntity[] = [];
    private readonly deleteEntities: BaseEntity[] = [];

    constructor(options: {transaction: Datastore.Transaction}) {
        this.transaction = options.transaction;
    }

    /** @internal */
    public async allocateIds(key: DatastoreEntity.entity.Key, total: number): Promise<number[]> {
        const [ids] = await this.transaction.allocateIds(key, total);
        return ids.map(x => Number(x.id));
    }

    /** @internal */
    public async findOne<T extends typeof BaseEntity>(classObject: T, key: DatastoreEntity.entity.Key) {
        const [data] = await this.transaction.get(key);
        if (data) {
            return await typeDatastoreOrm.loadEntity(classObject, data);
        }
    }

    /** @internal */
    public async findMany<T extends typeof BaseEntity>(classObject: T, keys: DatastoreEntity.entity.Key[]) {
        const [results] = await this.transaction.get(keys);
        const entities: Array<InstanceType<T>> = [];
        if (results) {
            for (const data of results) {
                const entity = await typeDatastoreOrm.loadEntity(classObject, data);
                entities.push(entity);
            }
        }

        return entities;
    }

    /** @internal */
    public insert<T extends BaseEntity>(entities: T | T[]) {
        typeDatastoreOrm.runHookOfBeforeInsert(entities);

        for (const entity of Array.isArray(entities) ? entities : [entities]) {
            const {isGenerateId, insertData} = this._internalInsertOne(entity);
            this.transaction.insert(insertData);

            // hook use
            this.insertEntities.push(entity);
        }
    }

    /** @internal */
    public upsert<T extends BaseEntity>(entities: T | T[]) {
        typeDatastoreOrm.runHookOfBeforeUpsert(entities);

        for (const entity of Array.isArray(entities) ? entities : [entities]) {
            const {isGenerateId, insertData} = this._internalInsertOne(entity);
            this.transaction.upsert(insertData);

            // hook use
            this.upsertEntities.push(entity);
        }
    }

    /** @internal */
    public update<T extends BaseEntity>(entities: T | T[]) {
        typeDatastoreOrm.runHookOfBeforeUpdate(entities);

        for (const entity of Array.isArray(entities) ? entities : [entities]) {
            const {updateData} = typeDatastoreOrm.getUpdateData(entity);
            this.transaction.update(updateData);

            // hook use
            this.updateEntities.push(entity);
        }
    }

    /** @internal */

    public delete<P extends IEntityKeyType<typeof BaseEntity> | Array<IEntityKeyType<typeof BaseEntity>>>(entities: P): void {

        for (const entity of (Array.isArray(entities) ? entities : [entities])) {
            const key = typeDatastoreOrm.normalizeAsKey(entity, entity._namespace, entity._kind);
            this.transaction.delete(key);

            if (entity instanceof BaseEntity) {
                typeDatastoreOrm.runHookOfBeforeDelete(entity);

                this.deleteEntities.push(entity);
            }
        }
    }

    /** @internal */
    public async run() {
        await this.transaction.run();
    }

    /** @internal */
    public async commit() {
        if (!this.transaction.skipCommit) {
            const [response] = await this.transaction.commit();
            const mutationResults = response.mutationResults!;

            // update back the auto generate id
            for (const [entity, key] of this.generateIdEntities.entries()) {
                entity._id = Number(key.id);
            }
        }
    }

    public async rollback() {
        await this.transaction.rollback();
    }

    private _internalInsertOne<T extends BaseEntity>(entity: T): IGetInsertData {
        const data = typeDatastoreOrm.getInsertData(entity);
        if (data.isGenerateId) {
            if (this.generateIdEntities.has(entity)) {
                throw new TypeDatastoreOrmError(`You cannot insert the same entity.`);
            }

            this.generateIdEntities.set(entity, data.insertData.key);
        }

        return data;
    }
}
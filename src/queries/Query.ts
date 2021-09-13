import { QueryAsyncIterator } from './QueryAsyncIterator';
import {BaseEntity} from "../BaseEntity";
import {MAX_ENTITIES} from "../constants";
import {typeDatastoreOrm} from "../typeDatastoreOrm";
import {IQueryParams} from "../types";
import {BaseQuery} from "./BaseQuery";

export class Query<T extends typeof BaseEntity, KT extends BaseEntity> extends BaseQuery<KT> {
    public readonly classObject: T;

    constructor(options: IQueryParams<T>) {
        super({datastore: options.datastore, namespace: options.namespace, kind: options.kind, query: options.query});
        this.classObject = options.classObject;
    }

    public getAsyncIterator() {
        if (this.query.limitVal === -1) {
            this.query.limit(MAX_ENTITIES);
        }

        return new QueryAsyncIterator({query: this.query, classObject: this.classObject});
    }

    public async findOne() {
        const data = await super.findOne();
        if (data) {
            return await typeDatastoreOrm.loadEntity(this.classObject, data);
        }
    }

    public async findMany() {
        const results = await super.findMany();
        const entities: Array<InstanceType<T>> = [];

        for (const data of results) {
            const entity = await typeDatastoreOrm.loadEntity(this.classObject, data);
            entities.push(entity);
        }

        return entities;
    }
}
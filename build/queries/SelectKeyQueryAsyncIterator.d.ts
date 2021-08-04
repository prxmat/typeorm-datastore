import * as Datastore from "@google-cloud/datastore";
import * as DatastoreEntity from "@google-cloud/datastore/build/src/entity";
import { BaseEntity } from "../BaseEntity";
interface IAsyncIterator<T> {
    next(value?: any): Promise<IteratorResult<T[]>>;
}
export declare class SelectKeyQueryAsyncIterator<T extends typeof BaseEntity> {
    readonly query: Datastore.Query;
    isClosed: boolean;
    constructor(options: {
        query: Datastore.Query;
    });
    close(): void;
    [Symbol.asyncIterator](): IAsyncIterator<DatastoreEntity.entity.Key>;
}
export {};

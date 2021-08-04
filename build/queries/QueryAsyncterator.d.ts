import * as Datastore from "@google-cloud/datastore";
import { BaseEntity } from "../BaseEntity";
interface IAsyncIterator<T> {
    next(value?: any): Promise<IteratorResult<T[]>>;
}
export declare class QueryAsyncIterator<T extends typeof BaseEntity> {
    readonly query: Datastore.Query;
    readonly classObject: T;
    isClosed: boolean;
    constructor(options: {
        classObject: T;
        query: Datastore.Query;
    });
    close(): void;
    [Symbol.asyncIterator](): IAsyncIterator<InstanceType<T>>;
}
export {};

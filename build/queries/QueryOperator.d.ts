import * as Datastore from "@google-cloud/datastore";
import { Query } from "@google-cloud/datastore/build/src";
import * as DatastoreEntity from "@google-cloud/datastore/build/src/entity";
export declare class QueryOperator<V extends any> {
    private fieldName;
    private query;
    private datastore;
    private namespace;
    private kind;
    private ancestorKey?;
    constructor(options: {
        fieldName: string;
        query: Query;
        datastore: Datastore.Datastore;
        namespace: string | undefined;
        kind: string;
        ancestorKey?: DatastoreEntity.entity.Key;
    });
    eq(value: V): void;
    le(value: V): this;
    lt(value: V): this;
    ge(value: V): this;
    gt(value: V): this;
    private _operation;
}

import * as DatastoreEntity from "@google-cloud/datastore/build/src/entity";
export declare class BaseEntity {
    _id: any;
    _namespace: string | undefined;
    _kind: string;
    _ancestorKey?: DatastoreEntity.entity.Key;
    constructor();
    getKey(): DatastoreEntity.entity.Key;
}

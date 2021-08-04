import * as Datastore from "@google-cloud/datastore";
import { Query } from "@google-cloud/datastore/build/src";
import * as DatastoreEntity from "@google-cloud/datastore/build/src/entity";
import * as DatastoreQuery from "@google-cloud/datastore/build/src/query";
import { BaseEntity } from "./BaseEntity";
export declare type IKey = DatastoreEntity.entity.Key;
export declare type IOrderOptions = DatastoreQuery.OrderOptions;
export declare type IStats = {
    timestamp: Date;
    builtin_index_bytes: number;
    composite_index_bytes: number;
    count: number;
    bytes: number;
    entity_bytes: number;
    builtin_index_count: number;
    composite_index_count: number;
};
export declare type IClassObject = new (...args: any[]) => any;
export declare type IEntityMetaOptions = {
    kind: string;
    namespace: string | undefined;
    excludeFromIndexes: string[];
    enumerable: boolean;
};
export declare type IEntityFieldMetaOptions = {
    generateId: boolean;
    index: boolean;
    excludeFromIndexes: string[];
};
export declare type IEntityKeyType<T extends typeof BaseEntity> = InstanceType<T> | InstanceType<T>["_id"] | DatastoreEntity.entity.Key;
export declare type IEntityFieldIndex = {
    _id: "asc" | "desc";
} | {
    [key: string]: "asc" | "desc";
};
export declare type IEntityCompositeIndex = {
    fields: IEntityFieldIndex;
    hasAncestor: boolean;
};
export declare type IEntityCompositeIndexList = IEntityCompositeIndex[];
export declare type IRepositoryParams<T> = {
    datastore: Datastore.Datastore;
    classObject: T;
    namespace: string | undefined;
    kind: string;
};
export declare type IDatastoreSaveData = {
    key: DatastoreEntity.entity.Key;
    excludeFromIndexes: string[];
    data: any;
};
export declare type IGetInsertData = {
    insertData: IDatastoreSaveData;
    isGenerateId: boolean;
};
export declare type IGetUpdateData = {
    updateData: IDatastoreSaveData;
};
export declare type IConnectionOptions = {
    keyFilename: string;
} | {
    clientEmail: string;
    privateKey: string;
};
export declare type ICreateValues<T extends BaseEntity> = {
    [P in Exclude<keyof T, "getKey">]?: T[P];
};
export declare type IFieldName<T extends BaseEntity> = Exclude<keyof T, keyof BaseEntity>;
export declare type IFieldNames<T extends BaseEntity> = Array<IFieldName<T>>;
export declare type ITransactionManagerOptions = {
    maxRetry: number;
    retryDelay: number;
    readOnly: boolean;
};
export declare type ITransactionManagerParams = {
    datastore: Datastore.Datastore;
    maxRetry: number;
    retryDelay: number;
    readOnly: boolean;
};
export declare type ILockManagerOptions = {
    namespace?: string;
    kind?: string;
    expiresIn: number;
    retryDelay?: number;
    maxRetry?: number;
};
export declare type ILockManagerParams = {
    datastore: Datastore.Datastore;
    namespace?: string;
    kind?: string;
    expiresIn: number;
    maxRetry: number;
    retryDelay: number;
};
export declare type ILockParams<T> = IRepositoryParams<T> & {
    lockKey: string;
    expiresIn: number;
    maxRetry: number;
    retryDelay: number;
};
export declare type ILockCallback<T extends any> = () => Promise<T>;
export declare type ILockResult<T> = {
    value: T;
};
export declare type IIndexResaveHelperParams<T> = IRepositoryParams<T>;
export declare type IIncrementHelperOptions = {
    maxRetry?: number;
    retryDelay?: number;
};
export declare type IIncrementHelperParams<T> = IRepositoryParams<T> & {
    maxRetry: number;
    retryDelay: number;
};
export declare type IBaseQueryParams = {
    datastore: Datastore.Datastore;
    namespace: string | undefined;
    kind: string;
    query: Query;
};
export declare type IQueryParams<T> = {
    classObject: T;
} & IBaseQueryParams;
export declare type IStrongTypeQueryOptions = {};
export declare type IWeakTypeQueryOptions = {
    weakType: true;
};
export declare type IFilterValue<T> = T extends Array<infer U> ? (U | U[]) : T;

import * as Datastore from "@google-cloud/datastore";
import { ILockParams, ILockResult } from "../types";
import { LockEntity } from "./LockEntity";
export declare class Lock<T extends typeof LockEntity> {
    datastore: Datastore.Datastore;
    classObject: T;
    namespace: string | undefined;
    kind: string;
    expiresIn: number;
    maxRetry: number;
    retryDelay: number;
    lockKey: string;
    _id: string;
    randomId: string;
    constructor(options: ILockParams<T>);
    start<R extends any>(callback: () => Promise<R>): Promise<ILockResult<R>>;
    acquire(): Promise<{
        totalRetry: number;
    }>;
    release(): Promise<void>;
}

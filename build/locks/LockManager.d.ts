import * as Datastore from "@google-cloud/datastore";
import { ILockCallback, ILockManagerParams } from "../types";
import { LockEntity } from "./LockEntity";
export declare class LockManager {
    readonly datastore: Datastore.Datastore;
    readonly classObject: typeof LockEntity;
    readonly namespace: string | undefined;
    readonly kind: string;
    readonly expiresIn: number;
    readonly maxRetry: number;
    readonly retryDelay: number;
    constructor(options: ILockManagerParams);
    start<R extends any>(lockKey: string, callback: ILockCallback<R>): Promise<{
        value: R;
    }>;
}

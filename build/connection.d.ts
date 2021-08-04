import * as Datastore from "@google-cloud/datastore";
import { BaseEntity } from "./BaseEntity";
import { DatastoreAdmin } from "./DatastoreAdmin";
import { LockManager } from "./locks/LockManager";
import { Repository } from "./Repository";
import { TransactionManager } from "./transactions/TransactionManager";
import { ILockManagerOptions, ITransactionManagerOptions } from "./types";
export declare class Connection {
    readonly datastore: Datastore.Datastore;
    constructor(options: {
        datastore: Datastore.Datastore;
    });
    getRepository<T extends typeof BaseEntity>(classObject: T, options?: {
        namespace?: string;
        kind?: string;
    }): Repository<T>;
    getTransactionManager(options?: Partial<ITransactionManagerOptions>): TransactionManager;
    getLockManager(options: ILockManagerOptions): LockManager;
    getAdmin(): DatastoreAdmin;
}

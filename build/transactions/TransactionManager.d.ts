import * as Datastore from "@google-cloud/datastore";
import { ITransactionManagerParams } from "../types";
import { Session } from "./Session";
declare type ITransactionResult<T> = {
    value: T;
    hasCommitted: boolean;
    totalRetry: number;
};
export declare class TransactionManager {
    readonly datastore: Datastore.Datastore;
    readonly maxRetry: number;
    readonly retryDelay: number;
    readonly readOnly: boolean;
    constructor(options: ITransactionManagerParams);
    start<T extends any>(callback: (session: Session) => Promise<T>): Promise<ITransactionResult<T>>;
}
export {};

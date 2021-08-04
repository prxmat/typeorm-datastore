import * as Datastore from "@google-cloud/datastore";
export declare class Session {
    readonly transaction: Datastore.Transaction;
    private readonly generateIdEntities;
    private readonly insertEntities;
    private readonly upsertEntities;
    private readonly updateEntities;
    private readonly deleteEntities;
    constructor(options: {
        transaction: Datastore.Transaction;
    });
    rollback(): Promise<void>;
    private _internalInsertOne;
}

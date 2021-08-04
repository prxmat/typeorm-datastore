import * as Datastore from "@google-cloud/datastore";
import { IStats } from "./types";
export declare class DatastoreAdmin {
    datastore: Datastore.Datastore;
    constructor(options: {
        datastore: Datastore.Datastore;
    });
    getNamespaces(): Promise<any[]>;
    getKinds(): Promise<string[]>;
    getNamespaceKinds(namespace: string): Promise<string[]>;
    getStats(): Promise<IStats>;
    getKindStats(kind: string): Promise<IStats | undefined>;
    getNamespaceKindStats(namespace: string, kind: string): Promise<IStats | undefined>;
    getNamespaceTotal(namespace: string): Promise<IStats | undefined>;
    getNamespaceKindProperties(namespace: string, kind: string): Promise<any[]>;
    private _getStats;
    private _getProperties;
    private _runQuery;
}

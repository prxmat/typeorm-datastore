import * as Datastore from "@google-cloud/datastore";
import { Query } from "@google-cloud/datastore/build/src";
import { BaseEntity } from "../BaseEntity";
import { BaseQuery } from "./BaseQuery";
import { SelectKeyQueryAsyncIterator } from "./SelectKeyQueryAsyncIterator";
export declare class SelectKeyQuery<KT extends BaseEntity> extends BaseQuery<KT> {
    constructor(options: {
        datastore: Datastore.Datastore;
        namespace: string | undefined;
        kind: string;
        query: Query;
    });
    getAsyncIterator(): SelectKeyQueryAsyncIterator<typeof BaseEntity>;
    findOne(): Promise<Datastore.Key | undefined>;
    findMany(): Promise<Datastore.Key[]>;
}

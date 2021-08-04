import * as Datastore from "@google-cloud/datastore";
import { BaseEntity } from "./BaseEntity";
import { IncrementHelper } from "./helpers/IncrementHelper";
import { IndexResaveHelper } from "./helpers/IndexResaveHelper";
import { Query } from "./queries/Query";
import { SelectKeyQuery } from "./queries/SelectKeyQuery";
import { Session } from "./transactions/Session";
import { ICreateValues, IEntityKeyType, IIncrementHelperOptions, IRepositoryParams, IStrongTypeQueryOptions, IWeakTypeQueryOptions } from "./types";
export declare class Repository<T extends typeof BaseEntity> {
    readonly datastore: Datastore.Datastore;
    readonly classObject: T;
    readonly namespace: string | undefined;
    readonly kind: string;
    constructor(options: IRepositoryParams<T>);
    create(values?: ICreateValues<InstanceType<T>>): InstanceType<T>;
    findOne(id: IEntityKeyType<T>): Promise<InstanceType<T> | undefined>;
    findOneWithSession(id: IEntityKeyType<T>, session: Session): Promise<InstanceType<T> | undefined>;
    findMany(ids: Array<IEntityKeyType<T>>): Promise<Array<InstanceType<T>>>;
    findManyWithSessions(ids: Array<IEntityKeyType<T>>, session: Session): Promise<Array<InstanceType<T>>>;
    query(options?: IStrongTypeQueryOptions): Query<T, InstanceType<T>>;
    query(options?: IWeakTypeQueryOptions): Query<T, any>;
    queryWithSession(session: Session, options?: IStrongTypeQueryOptions): Query<T, InstanceType<T>>;
    queryWithSession(session: Session, options?: IWeakTypeQueryOptions): Query<T, any>;
    selectKeyQuery(options?: IStrongTypeQueryOptions): SelectKeyQuery<InstanceType<T>>;
    selectKeyQuery(options?: IWeakTypeQueryOptions): SelectKeyQuery<any>;
    selectKeyQueryWithSession(session: Session, options?: IStrongTypeQueryOptions): SelectKeyQuery<InstanceType<T>>;
    selectKeyQueryWithSession(session: Session, options?: IWeakTypeQueryOptions): SelectKeyQuery<any>;
    allocateIds(total: number): Promise<number[]>;
    allocateIdsWithSession(total: number, session: Session): Promise<number[]>;
    insert<P extends InstanceType<T> | Array<InstanceType<T>>>(entities: P): Promise<P>;
    insertWithSession<P extends InstanceType<T> | Array<InstanceType<T>>>(entities: P, session: Session): void;
    upsert<P extends InstanceType<T> | Array<InstanceType<T>>>(entities: P): Promise<P>;
    upsertWithSession<P extends InstanceType<T> | Array<InstanceType<T>>>(entities: P, session: Session): void;
    update<P extends InstanceType<T> | Array<InstanceType<T>>>(entities: P): Promise<P>;
    updateWithSession<P extends InstanceType<T> | Array<InstanceType<T>>>(entities: P, session: Session): void;
    delete<P extends IEntityKeyType<T> | Array<IEntityKeyType<T>>>(entities: P): Promise<P>;
    deleteWithSession<P extends IEntityKeyType<T> | Array<IEntityKeyType<T>>>(entities: P, session: Session): void;
    truncate(): Promise<number>;
    getUrl(): Promise<string>;
    getIndexResaveHelper(): IndexResaveHelper<T>;
    getIncrementHelper(options?: IIncrementHelperOptions): IncrementHelper<T>;
    private _internalInsert;
}

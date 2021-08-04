import { BaseEntity } from "../BaseEntity";
import { IEntityKeyType, IFieldName, IIncrementHelperParams } from "../types";
export declare class IncrementHelper<T extends typeof BaseEntity> {
    private datastore;
    private classObject;
    private namespace;
    private kind;
    private maxRetry;
    private retryDelay;
    constructor(options: IIncrementHelperParams<T>);
    increment(id: IEntityKeyType<T>, fieldName: IFieldName<InstanceType<T>>, increment?: number): Promise<number>;
}

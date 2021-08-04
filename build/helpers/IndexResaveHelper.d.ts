import { BaseEntity } from "../BaseEntity";
import { IFieldName, IFieldNames, IIndexResaveHelperParams } from "../types";
export declare class IndexResaveHelper<T extends typeof BaseEntity> {
    private datastore;
    private classObject;
    private namespace;
    private kind;
    constructor(options: IIndexResaveHelperParams<T>);
    resave(fieldNames: IFieldName<InstanceType<T>> | IFieldNames<InstanceType<T>>): Promise<number>;
}

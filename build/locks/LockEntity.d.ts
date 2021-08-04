import { BaseEntity } from "../BaseEntity";
export declare class LockEntity extends BaseEntity {
    _id: string;
    randomId: string;
    lockKey: string;
    expiredAt: Date;
}

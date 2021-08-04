"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LockManager = void 0;
const decoratorMeta_1 = require("../decoratorMeta");
const Lock_1 = require("./Lock");
const LockEntity_1 = require("./LockEntity");
class LockManager {
    constructor(options) {
        const classObject = LockEntity_1.LockEntity;
        const entityMeta = decoratorMeta_1.decoratorMeta.getEntityMeta(classObject);
        const namespace = (options === null || options === void 0 ? void 0 : options.namespace) || entityMeta.namespace;
        const kind = (options === null || options === void 0 ? void 0 : options.kind) || entityMeta.kind;
        this.datastore = options.datastore;
        this.classObject = classObject;
        this.namespace = namespace === "" ? undefined : namespace;
        this.kind = kind;
        this.expiresIn = options.expiresIn;
        this.maxRetry = options.maxRetry;
        this.retryDelay = options.retryDelay;
    }
    start(lockKey, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            const lock = new Lock_1.Lock({
                lockKey,
                classObject: this.classObject,
                datastore: this.datastore,
                namespace: this.namespace,
                kind: this.kind,
                expiresIn: this.expiresIn,
                maxRetry: this.maxRetry,
                retryDelay: this.retryDelay,
            });
            return yield lock.start(callback);
        });
    }
}
exports.LockManager = LockManager;

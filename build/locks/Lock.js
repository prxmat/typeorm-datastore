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
exports.Lock = void 0;
const TypeDatastoreOrmError_1 = require("../errors/TypeDatastoreOrmError");
const Repository_1 = require("../Repository");
const TransactionManager_1 = require("../transactions/TransactionManager");
const utils_1 = require("../utils");
class Lock {
    constructor(options) {
        this.datastore = options.datastore;
        this.classObject = options.classObject;
        this.namespace = options.namespace;
        this.kind = options.kind;
        this.expiresIn = options.expiresIn;
        this.maxRetry = options.maxRetry;
        this.retryDelay = options.retryDelay;
        this.lockKey = options.lockKey;
        this.randomId = utils_1.generateRandomString(16);
        this._id = utils_1.createMd5(options.lockKey);
    }
    start(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            const acquireResult = yield this.acquire();
            try {
                const result = yield callback();
                return { value: result };
            }
            finally {
                // release the lock
                yield this.release();
            }
        });
    }
    acquire() {
        return __awaiter(this, void 0, void 0, function* () {
            let totalRetry = 0;
            let canLock = false;
            const transactionManager = new TransactionManager_1.TransactionManager({
                datastore: this.datastore,
                maxRetry: 0,
                retryDelay: 0,
                readOnly: false,
            });
            const repository = new Repository_1.Repository({
                datastore: this.datastore,
                classObject: this.classObject,
                namespace: this.namespace,
                kind: this.kind,
            });
            do {
                try {
                    const result = yield transactionManager.start((session) => __awaiter(this, void 0, void 0, function* () {
                        let lock = yield repository.findOneWithSession(this._id, session);
                        const now = new Date();
                        if (!lock) {
                            lock = repository.create();
                            lock._id = this._id;
                            lock.lockKey = this.lockKey;
                            lock.randomId = this.randomId;
                            lock.expiredAt.setTime(now.getTime() + this.expiresIn);
                            repository.insertWithSession(lock, session);
                            return;
                        }
                        else if (now.getTime() > lock.expiredAt.getTime()) {
                            // update it
                            lock.randomId = this.randomId;
                            lock.expiredAt.setTime(now.getTime() + this.expiresIn);
                            repository.updateWithSession(lock, session);
                            return;
                        }
                        yield session.rollback();
                    }));
                    // we successfully acquired the lock
                    if (result.hasCommitted) {
                        canLock = true;
                        break;
                    }
                }
                catch (err) {
                    // ignore error, leave it for retry
                }
                if (!canLock) {
                    if (this.retryDelay) {
                        yield utils_1.timeout(this.retryDelay);
                    }
                }
            } while (totalRetry++ < this.maxRetry);
            if (!canLock) {
                throw new TypeDatastoreOrmError_1.TypeDatastoreOrmError(`(LockManager) Failed to acquire the lock with the lockKey "${this.lockKey}".`);
            }
            return { totalRetry };
        });
    }
    // this shouldn't throw any error
    release() {
        return __awaiter(this, void 0, void 0, function* () {
            const transactionManager = new TransactionManager_1.TransactionManager({
                datastore: this.datastore,
                maxRetry: 0,
                retryDelay: 0,
                readOnly: false,
            });
            const repository = new Repository_1.Repository({
                datastore: this.datastore,
                classObject: this.classObject,
                namespace: this.namespace,
                kind: this.kind,
            });
            try {
                const result = yield transactionManager.start((session) => __awaiter(this, void 0, void 0, function* () {
                    const lock = yield repository.findOneWithSession(this._id, session);
                    if (lock && lock.randomId === this.randomId) {
                        repository.deleteWithSession(lock, session);
                    }
                }));
            }
            catch (err) {
                // ignore errors (any possible error will just cause lock failed according, so it's save to ignore errors)
            }
        });
    }
}
exports.Lock = Lock;

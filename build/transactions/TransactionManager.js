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
exports.TransactionManager = void 0;
const errorCodes_1 = require("../enums/errorCodes");
const typeDatastoreOrm_1 = require("../typeDatastoreOrm");
const utils_1 = require("../utils");
const Session_1 = require("./Session");
class TransactionManager {
    constructor(options) {
        this.datastore = options.datastore;
        this.maxRetry = options.maxRetry;
        this.retryDelay = options.retryDelay;
        this.readOnly = options.readOnly;
    }
    start(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            let retry = 0;
            let value;
            let totalRetry = 0;
            let hasCommitted = false;
            const friendlyErrorStack = typeDatastoreOrm_1.typeDatastoreOrm.getFriendlyErrorStack();
            do {
                // start transaction
                const transaction = this.datastore.transaction({ readOnly: this.readOnly });
                const session = new Session_1.Session({ transaction });
                try {
                    // start transaction
                    yield session.run();
                    // execute callback
                    value = yield callback(session);
                    // commit
                    yield session.commit();
                    // provided by datastore
                    hasCommitted = !(session.transaction.skipCommit);
                    // break the retry loop
                    break;
                }
                catch (err) {
                    // if we don't rollback, it will be faster
                    hasCommitted = false;
                    // rollback for any type of error
                    try {
                        yield session.rollback();
                    }
                    catch (err) {
                        // ignore rollback error here
                    }
                    // retry transaction only if aborted
                    if (err.code === errorCodes_1.errorCodes.ABORTED) {
                        if (retry < this.maxRetry) {
                            totalRetry = retry;
                            // wait for a while
                            if (this.retryDelay) {
                                yield utils_1.timeout(this.retryDelay);
                            }
                            // this will skip throwing error
                            continue;
                        }
                    }
                    throw Object.assign(err, friendlyErrorStack && { stack: utils_1.updateStack(friendlyErrorStack, err) });
                }
            } while (retry++ < this.maxRetry);
            return { value, hasCommitted, totalRetry };
        });
    }
}
exports.TransactionManager = TransactionManager;

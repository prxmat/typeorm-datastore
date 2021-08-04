"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Connection = void 0;
const DatastoreAdmin_1 = require("./DatastoreAdmin");
const decoratorMeta_1 = require("./decoratorMeta");
const LockManager_1 = require("./locks/LockManager");
const Repository_1 = require("./Repository");
const TransactionManager_1 = require("./transactions/TransactionManager");
class Connection {
    constructor(options) {
        this.datastore = options.datastore;
    }
    getRepository(classObject, options) {
        const entityMeta = decoratorMeta_1.decoratorMeta.getEntityMeta(classObject);
        const namespace = (options === null || options === void 0 ? void 0 : options.namespace) || entityMeta.namespace;
        return new Repository_1.Repository({
            datastore: this.datastore,
            classObject,
            namespace: namespace === "" ? undefined : namespace,
            kind: (options === null || options === void 0 ? void 0 : options.kind) || entityMeta.kind,
        });
    }
    getTransactionManager(options = {}) {
        return new TransactionManager_1.TransactionManager({
            datastore: this.datastore,
            maxRetry: options.maxRetry || 0,
            retryDelay: options.retryDelay || 0,
            readOnly: options.readOnly || false,
        });
    }
    getLockManager(options) {
        return new LockManager_1.LockManager({
            namespace: options.namespace,
            kind: options.kind,
            datastore: this.datastore,
            expiresIn: options.expiresIn,
            maxRetry: options.maxRetry || 0,
            retryDelay: options.retryDelay || 0,
        });
    }
    getAdmin() {
        return new DatastoreAdmin_1.DatastoreAdmin({ datastore: this.datastore });
    }
}
exports.Connection = Connection;

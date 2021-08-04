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
exports.DatastoreAdmin = void 0;
const namespaceStats_1 = require("./enums/namespaceStats");
const stats_1 = require("./enums/stats");
const typeDatastoreOrm_1 = require("./typeDatastoreOrm");
const utils_1 = require("./utils");
class DatastoreAdmin {
    constructor(options) {
        this.datastore = options.datastore;
    }
    getNamespaces() {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.datastore
                .createQuery(["__namespace__"])
                .select("__key__");
            const results = yield this._runQuery(query);
            return results.map(x => x[this.datastore.KEY].name || "");
        });
    }
    getKinds() {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.datastore
                .createQuery([stats_1.stats.kind])
                .select("__key__");
            const results = yield this._runQuery(query);
            return results.map(x => x[this.datastore.KEY].name);
        });
    }
    getNamespaceKinds(namespace) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.datastore
                .createQuery(namespace, [namespaceStats_1.namespaceStats.kind])
                .select("__key__");
            const results = yield this._runQuery(query);
            return results.map(x => x[this.datastore.KEY].name);
        });
    }
    getStats() {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield this._getStats({ namespace: "", stats: stats_1.stats.total });
            return results[0];
        });
    }
    getKindStats(kind) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield this._getStats({ namespace: "", kind, stats: stats_1.stats.kind });
            return results.length ? results[0] : undefined;
        });
    }
    getNamespaceKindStats(namespace, kind) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield this._getStats({ namespace, kind, stats: namespaceStats_1.namespaceStats.kind });
            return results.length ? results[0] : undefined;
        });
    }
    getNamespaceTotal(namespace) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield this._getStats({ namespace, stats: namespaceStats_1.namespaceStats.total });
            return results.length ? results[0] : undefined;
        });
    }
    getNamespaceKindProperties(namespace, kind) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._getProperties({ namespace, kind });
        });
    }
    _getStats(options, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            // prepare query
            const query = this.datastore.createQuery(options.namespace, [options.stats]);
            // if we have kind, then we query the kind with key
            if (typeof options.kind === "string") {
                const key = this.datastore.key([options.stats, options.kind]);
                key.namespace = options.namespace;
                query.filter("__key__", "=", key);
            }
            return yield this._runQuery(query);
        });
    }
    _getProperties(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = this.datastore.key(["__kind__", options.kind]);
            key.namespace = options.namespace;
            const query = this.datastore
                .createQuery(options.namespace, ["__property__"])
                .hasAncestor(key);
            return yield this._runQuery(query);
        });
    }
    _runQuery(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const friendlyErrorStack = typeDatastoreOrm_1.typeDatastoreOrm.getFriendlyErrorStack();
            try {
                const [results] = yield this.datastore.runQuery(query);
                return results;
            }
            catch (err) {
                throw Object.assign(err, friendlyErrorStack && { stack: utils_1.updateStack(friendlyErrorStack, err) });
            }
        });
    }
}
exports.DatastoreAdmin = DatastoreAdmin;

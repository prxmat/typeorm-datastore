"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.BaseQuery = void 0;
const Datastore = __importStar(require("@google-cloud/datastore"));
const DatastoreEntity = __importStar(require("@google-cloud/datastore/build/src/entity"));
const typeDatastoreOrm_1 = require("../typeDatastoreOrm");
const utils_1 = require("../utils");
const QueryOperator_1 = require("./QueryOperator");
class BaseQuery {
    constructor(options) {
        this.datastore = options.datastore;
        this.namespace = options.namespace;
        this.kind = options.kind;
        this.query = options.query;
    }
    hasNextPage() {
        if (!this.lastRunQueryInfo) {
            return true;
        }
        if (this.lastRunQueryInfo.moreResults !== Datastore.Datastore.NO_MORE_RESULTS) {
            return true;
        }
        return false;
    }
    filter(...args) {
        const fieldName = args[0];
        const queryOperator = new QueryOperator_1.QueryOperator({
            fieldName,
            query: this.query,
            datastore: this.datastore,
            namespace: this.namespace,
            kind: this.kind,
            ancestorKey: this._ancestorKey,
        });
        if (typeof args[1] === "function") {
            const callback = args[1];
            callback(queryOperator);
        }
        else {
            const value = args[1];
            queryOperator.eq(value);
        }
        return this;
    }
    filterKey(value) {
        const queryOperator = new QueryOperator_1.QueryOperator({
            fieldName: "__key__",
            query: this.query,
            datastore: this.datastore,
            namespace: this.namespace,
            kind: this.kind,
            ancestorKey: this._ancestorKey,
        });
        if (typeof value === "function") {
            value(queryOperator);
        }
        else {
            queryOperator.eq(value);
        }
        return this;
    }
    getEndCursor() {
        return this._endCursor;
    }
    setEndCursor(endCursor) {
        this._endCursor = endCursor;
        this.query.start(endCursor);
        return this;
    }
    setAncestorKey(key) {
        this._ancestorKey = key;
        this.query.hasAncestor(key);
        return this;
    }
    limit(value) {
        this.query.limit(value);
        return this;
    }
    offset(value) {
        this.query.offset(value);
        return this;
    }
    groupBy(fieldName) {
        this.query.groupBy(fieldName);
        return this;
    }
    order(fieldName, orderOptions) {
        if (fieldName === "_id") {
            this.query.order("__key__", orderOptions);
        }
        else {
            this.query.order(fieldName, orderOptions);
        }
        return this;
    }
    findOne() {
        return __awaiter(this, void 0, void 0, function* () {
            this.limit(1);
            const friendlyErrorStack = typeDatastoreOrm_1.typeDatastoreOrm.getFriendlyErrorStack();
            try {
                const [results, queryInfo] = yield this.query.run();
                const data = results[0];
                // update last run query info and endcursor
                this.lastRunQueryInfo = queryInfo;
                if (this.lastRunQueryInfo && this.lastRunQueryInfo.endCursor) {
                    this.setEndCursor(this.lastRunQueryInfo.endCursor);
                }
                if (data) {
                    return data;
                }
            }
            catch (err) {
                throw Object.assign(err, friendlyErrorStack && { stack: utils_1.updateStack(friendlyErrorStack, err) });
            }
        });
    }
    findMany() {
        return __awaiter(this, void 0, void 0, function* () {
            const friendlyErrorStack = typeDatastoreOrm_1.typeDatastoreOrm.getFriendlyErrorStack();
            try {
                const [results, queryInfo] = yield this.query.run();
                // update last run query info and endcursor
                this.lastRunQueryInfo = queryInfo;
                if (this.lastRunQueryInfo && this.lastRunQueryInfo.endCursor) {
                    this.setEndCursor(this.lastRunQueryInfo.endCursor);
                }
                if (Array.isArray(results)) {
                    return results;
                }
                return [];
            }
            catch (err) {
                throw Object.assign(err, friendlyErrorStack && { stack: utils_1.updateStack(friendlyErrorStack, err) });
            }
        });
    }
    getSql() {
        const kind = this.kind;
        let select = "*";
        if (this.query.selectVal.length) {
            select = this.query.selectVal.join(", ");
        }
        for (const groupBy of this.query.groupByVal) {
            select = ` DISTINCT ON (${this.query.groupByVal.join(", ")}) ${select}`;
        }
        let sql = `SELECT ${select} from \`${kind}\``;
        if (this.query.filters.length) {
            const wheres = [];
            for (const filter of this.query.filters) {
                if (filter.val instanceof DatastoreEntity.entity.Key) {
                    const key = filter.val;
                    const op = filter.op === "HAS_ANCESTOR" ? "HAS ANCESTOR" : filter.op;
                    const keyParams = [];
                    for (let i = 0; i < key.path.length; i++) {
                        const path = key.path[i];
                        if (i % 2 === 0 || typeof path === "number") {
                            keyParams.push(path);
                        }
                        else {
                            keyParams.push(`"${path}"`);
                        }
                    }
                    const namespace = this.namespace || "";
                    const keyName = `Key(Namespace("${namespace}"), ${keyParams.join(", ")})`;
                    wheres.push(`__key__ ${op} ${keyName}`);
                }
                else if (typeof filter.val === "string") {
                    wheres.push(`${filter.name} ${filter.op} "${filter.val}"`);
                }
                else if (filter.val instanceof Date) {
                    const value = `DATETIME("${filter.val.toISOString()}")`;
                    wheres.push(`${filter.name} ${filter.op} ${value}`);
                }
                else if (filter.val instanceof Buffer) {
                    const value = `BLOB("${filter.val.toString("base64").replace(/==$/, "")}")`;
                    wheres.push(`${filter.name} ${filter.op} ${value}`);
                }
                else {
                    wheres.push(`${filter.name} ${filter.op} ${filter.val}`);
                }
            }
            sql += ` WHERE ${wheres.join(" AND ")}`;
        }
        for (const order of this.query.orders) {
            sql += ` ORDER BY ${order.name} ${order.sign ? "DESC" : "ASC"}`;
        }
        if (this.query.limitVal > 0) {
            sql += ` LIMIT ${this.query.limitVal}`;
        }
        if (this.query.offsetVal > 0) {
            sql += ` OFFSET ${this.query.offsetVal}`;
        }
        return sql;
    }
}
exports.BaseQuery = BaseQuery;

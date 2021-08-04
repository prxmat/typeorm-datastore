"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryOperator = void 0;
class QueryOperator {
    constructor(options) {
        this.query = options.query;
        this.fieldName = options.fieldName;
        this.datastore = options.datastore;
        this.namespace = options.namespace;
        this.kind = options.kind;
        this.ancestorKey = options.ancestorKey;
    }
    eq(value) {
        this._operation("=", value);
    }
    le(value) {
        this._operation("<=", value);
        return this;
    }
    lt(value) {
        this._operation("<", value);
        return this;
    }
    ge(value) {
        this._operation(">=", value);
        return this;
    }
    gt(value) {
        this._operation(">", value);
        return this;
    }
    _operation(operator, value) {
        if (this.fieldName === "_id") {
            const key = this.datastore.key({ namespace: this.namespace, path: [this.kind, value] });
            if (this.ancestorKey) {
                key.parent = this.ancestorKey;
            }
            this.query.filter("__key__", operator, key);
        }
        else {
            this.query.filter(this.fieldName, operator, value);
        }
    }
}
exports.QueryOperator = QueryOperator;

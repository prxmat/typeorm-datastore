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
exports.Query = void 0;
const QueryAsyncterator_1 = require("./QueryAsyncterator");
const constants_1 = require("../constants");
const typeDatastoreOrm_1 = require("../typeDatastoreOrm");
const BaseQuery_1 = require("./BaseQuery");
class Query extends BaseQuery_1.BaseQuery {
    constructor(options) {
        super({ datastore: options.datastore, namespace: options.namespace, kind: options.kind, query: options.query });
        this.classObject = options.classObject;
    }
    getAsyncIterator() {
        if (this.query.limitVal === -1) {
            this.query.limit(constants_1.MAX_ENTITIES);
        }
        return new QueryAsyncterator_1.QueryAsyncIterator({ query: this.query, classObject: this.classObject });
    }
    findOne() {
        const _super = Object.create(null, {
            findOne: { get: () => super.findOne }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield _super.findOne.call(this);
            if (data) {
                return yield typeDatastoreOrm_1.typeDatastoreOrm.loadEntity(this.classObject, data);
            }
        });
    }
    findMany() {
        const _super = Object.create(null, {
            findMany: { get: () => super.findMany }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield _super.findMany.call(this);
            const entities = [];
            for (const data of results) {
                const entity = yield typeDatastoreOrm_1.typeDatastoreOrm.loadEntity(this.classObject, data);
                entities.push(entity);
            }
            return entities;
        });
    }
}
exports.Query = Query;

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
exports.SelectKeyQueryAsyncIterator = void 0;
const DatastoreEntity = __importStar(require("@google-cloud/datastore/build/src/entity"));
const typeDatastoreOrm_1 = require("../typeDatastoreOrm");
const utils_1 = require("../utils");
class SelectKeyQueryAsyncIterator {
    constructor(options) {
        this.isClosed = false;
        this.query = options.query;
    }
    close() {
        this.isClosed = true;
    }
    [Symbol.asyncIterator]() {
        return {
            next: () => __awaiter(this, void 0, void 0, function* () {
                const friendlyErrorStack = typeDatastoreOrm_1.typeDatastoreOrm.getFriendlyErrorStack();
                try {
                    // if we haven't manually paused it
                    if (!this.isClosed) {
                        // try to fetch results
                        const [results, queryInfo] = yield this.query.run();
                        // update end cursor for next round
                        if (queryInfo && queryInfo.endCursor) {
                            this.query.start(queryInfo.endCursor);
                        }
                        // if we have results
                        if (results.length) {
                            const keys = [];
                            for (const data of results) {
                                const key = data[DatastoreEntity.entity.KEY_SYMBOL];
                                keys.push(key);
                            }
                            return { value: keys, done: false };
                        }
                        else {
                            this.isClosed = true;
                        }
                    }
                    return { value: undefined, done: true };
                }
                catch (err) {
                    throw Object.assign(err, friendlyErrorStack && { stack: utils_1.updateStack(friendlyErrorStack, err) });
                }
            }),
        };
    }
}
exports.SelectKeyQueryAsyncIterator = SelectKeyQueryAsyncIterator;

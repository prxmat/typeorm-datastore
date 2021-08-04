"use strict";
// https://cloud.google.com/datastore/docs/concepts/errors
// https://github.com/googleapis/googleapis/blob/master/google/rpc/code.proto
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorCodes = void 0;
var errorCodes;
(function (errorCodes) {
    errorCodes[errorCodes["INVALID_ARGUMENT"] = 3] = "INVALID_ARGUMENT";
    errorCodes[errorCodes["DEADLINE_EXCEEDED"] = 4] = "DEADLINE_EXCEEDED";
    errorCodes[errorCodes["NOT_FOUND"] = 5] = "NOT_FOUND";
    errorCodes[errorCodes["ALREADY_EXISTS"] = 6] = "ALREADY_EXISTS";
    errorCodes[errorCodes["PERMISSION_DENIED"] = 7] = "PERMISSION_DENIED";
    errorCodes[errorCodes["RESOURCE_EXHAUSTED"] = 8] = "RESOURCE_EXHAUSTED";
    errorCodes[errorCodes["FAILED_PRECONDITION"] = 9] = "FAILED_PRECONDITION";
    errorCodes[errorCodes["ABORTED"] = 10] = "ABORTED";
    errorCodes[errorCodes["INTERNAL"] = 13] = "INTERNAL";
    errorCodes[errorCodes["UNAVAILABLE"] = 14] = "UNAVAILABLE";
    errorCodes[errorCodes["UNAUTHENTICATED"] = 16] = "UNAUTHENTICATED";
})(errorCodes = exports.errorCodes || (exports.errorCodes = {}));

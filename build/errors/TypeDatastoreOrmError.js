"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeDatastoreOrmError = void 0;
class TypeDatastoreOrmError extends Error {
    constructor(message) {
        super(message);
        this.name = "TypeDatastoreOrmError";
        Object.setPrototypeOf(this, TypeDatastoreOrmError.prototype);
    }
}
exports.TypeDatastoreOrmError = TypeDatastoreOrmError;

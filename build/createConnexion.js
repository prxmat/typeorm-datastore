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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConnection = void 0;
const Datastore = __importStar(require("@google-cloud/datastore"));
const connection_1 = require("./connection");
function createConnection(options) {
    let datastore;
    const { keyFilename, clientEmail, privateKey } = options;
    if (keyFilename) {
        datastore = new Datastore.Datastore({ keyFilename });
        return new connection_1.Connection({ datastore });
    }
    else {
        datastore = new Datastore.Datastore({ credentials: { client_email: clientEmail, private_key: privateKey } });
        return new connection_1.Connection({ datastore });
    }
}
exports.createConnection = createConnection;

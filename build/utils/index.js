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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStack = exports.replaceFirstLine = exports.readJsonFile = exports.getUsedMemoryInMb = exports.generateRandomString = exports.timeout = exports.createMd5 = void 0;
const crypto_1 = __importDefault(require("crypto"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
/** @internal */
function createMd5(value) {
    return crypto_1.default.createHash("md5").update(value).digest("hex");
}
exports.createMd5 = createMd5;
/** @internal */
function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
exports.timeout = timeout;
/** @internal */
function generateRandomString(length) {
    const value = crypto_1.default.randomBytes(Math.ceil(length / 2)).toString("hex");
    return value.substr(0, length);
}
exports.generateRandomString = generateRandomString;
/** @internal */
function getUsedMemoryInMb() {
    return (process.memoryUsage().heapUsed / 1024 / 1024) | 0;
}
exports.getUsedMemoryInMb = getUsedMemoryInMb;
/** @internal */
function readJsonFile(filename) {
    filename = path.isAbsolute(filename) ? filename : path.join(process.cwd(), filename);
    const rawData = fs.readFileSync(filename);
    return JSON.parse(rawData.toString());
}
exports.readJsonFile = readJsonFile;
/** @internal */
function replaceFirstLine(paragraph, firstline) {
    return paragraph.replace(/^.*/, firstline);
}
exports.replaceFirstLine = replaceFirstLine;
/** @internal */
function updateStack(stack, error) {
    if (error.name) {
        return replaceFirstLine(stack, `${error.name}: ${error.message}`);
    }
    else {
        return replaceFirstLine(stack, error.message);
    }
}
exports.updateStack = updateStack;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformanceHelper = void 0;
/** @internal */
class PerformanceHelper {
    constructor() {
        this._timer = [0, 0];
        //
    }
    start() {
        this._timer = process.hrtime();
        return this;
    }
    read() {
        const diff = process.hrtime(this._timer);
        return diff[0] * 1000 + (diff[1] / 1000000);
    }
    readResult() {
        const executionTime = this.read();
        return { executionTime };
    }
}
exports.PerformanceHelper = PerformanceHelper;

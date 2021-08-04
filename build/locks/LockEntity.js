"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LockEntity = void 0;
const BaseEntity_1 = require("../BaseEntity");
const Entity_1 = require("../decorators/Entity");
const Field_1 = require("../decorators/Field");
let LockEntity = class LockEntity extends BaseEntity_1.BaseEntity {
    constructor() {
        super(...arguments);
        this._id = "";
        this.randomId = "";
        this.lockKey = "";
        this.expiredAt = new Date();
    }
};
__decorate([
    Field_1.Field(),
    __metadata("design:type", String)
], LockEntity.prototype, "_id", void 0);
__decorate([
    Field_1.Field(),
    __metadata("design:type", String)
], LockEntity.prototype, "randomId", void 0);
__decorate([
    Field_1.Field({ index: true }),
    __metadata("design:type", String)
], LockEntity.prototype, "lockKey", void 0);
__decorate([
    Field_1.Field(),
    __metadata("design:type", Date)
], LockEntity.prototype, "expiredAt", void 0);
LockEntity = __decorate([
    Entity_1.Entity({ namespace: "Lock" })
], LockEntity);
exports.LockEntity = LockEntity;

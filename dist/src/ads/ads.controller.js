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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdsController = void 0;
const common_1 = require("@nestjs/common");
const ads_service_1 = require("./ads.service");
const create_ad_request_dto_1 = require("./dto/create-ad-request.dto");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let AdsController = class AdsController {
    adsService;
    constructor(adsService) {
        this.adsService = adsService;
    }
    create(user, dto) {
        return this.adsService.createRequest(user.id, dto);
    }
    generateScript(id) {
        return this.adsService.generateScript(id);
    }
    selectAvatar(id, avatarId) {
        return { message: 'Avatar selected', avatarId };
    }
    generateVideo(id) {
        return this.adsService.generateVideo(id);
    }
    getStatus(id) {
        return this.adsService.getRequest(id);
    }
};
exports.AdsController = AdsController;
__decorate([
    (0, common_1.Post)('request'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new Ad Request' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_ad_request_dto_1.CreateAdRequestDto]),
    __metadata("design:returntype", void 0)
], AdsController.prototype, "create", null);
__decorate([
    (0, common_1.Post)(':id/generate-script'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate AI Script for Ad' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdsController.prototype, "generateScript", null);
__decorate([
    (0, common_1.Post)(':id/select-avatar'),
    (0, swagger_1.ApiOperation)({ summary: 'Select Avatar (Placeholder)' }),
    (0, swagger_1.ApiBody)({ schema: { example: { avatarId: "avatar-1" } } }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('avatarId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AdsController.prototype, "selectAvatar", null);
__decorate([
    (0, common_1.Post)(':id/generate-video'),
    (0, swagger_1.ApiOperation)({ summary: 'Start Video Generation Job' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdsController.prototype, "generateVideo", null);
__decorate([
    (0, common_1.Get)(':id/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Get Ad Request Status' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdsController.prototype, "getStatus", null);
exports.AdsController = AdsController = __decorate([
    (0, swagger_1.ApiTags)('Ads'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('ads'),
    __metadata("design:paramtypes", [ads_service_1.AdsService])
], AdsController);
//# sourceMappingURL=ads.controller.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdsModule = void 0;
const common_1 = require("@nestjs/common");
const ads_service_1 = require("./ads.service");
const ads_controller_1 = require("./ads.controller");
const prisma_module_1 = require("../prisma/prisma.module");
const script_generator_module_1 = require("../script-generator/script-generator.module");
const video_jobs_module_1 = require("../video-jobs/video-jobs.module");
let AdsModule = class AdsModule {
};
exports.AdsModule = AdsModule;
exports.AdsModule = AdsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, script_generator_module_1.ScriptGeneratorModule, video_jobs_module_1.VideoJobsModule],
        controllers: [ads_controller_1.AdsController],
        providers: [ads_service_1.AdsService],
    })
], AdsModule);
//# sourceMappingURL=ads.module.js.map
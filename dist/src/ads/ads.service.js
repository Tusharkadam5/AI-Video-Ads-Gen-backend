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
exports.AdsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const script_generator_service_1 = require("../script-generator/script-generator.service");
const video_jobs_service_1 = require("../video-jobs/video-jobs.service");
let AdsService = class AdsService {
    prisma;
    scriptGen;
    videoJobs;
    constructor(prisma, scriptGen, videoJobs) {
        this.prisma = prisma;
        this.scriptGen = scriptGen;
        this.videoJobs = videoJobs;
    }
    async createRequest(userId, dto) {
        const { targetAudiences, ...rest } = dto;
        return this.prisma.adRequest.create({
            data: {
                userId,
                ...rest,
                targetAudiences: {
                    create: targetAudiences.map((segment) => ({ segment })),
                },
            },
        });
    }
    async getRequest(id) {
        const request = await this.prisma.adRequest.findUnique({
            where: { id },
            include: { generatedScript: true, videoJob: true, product: true, targetAudiences: true },
        });
        if (!request)
            throw new common_1.NotFoundException('Ad Request not found');
        return request;
    }
    async generateScript(id) {
        const request = await this.getRequest(id);
        if (!request.product)
            throw new common_1.BadRequestException('Product data missing');
        const targetAudienceString = request.targetAudiences.map(ta => ta.segment).join(', ');
        const scriptContent = await this.scriptGen.generateScript({
            productName: request.product.name,
            productDescription: request.product.description,
            platform: request.platform,
            duration: request.duration,
            targetAudience: targetAudienceString,
            language: request.language,
        });
        const script = await this.prisma.generatedScript.create({
            data: {
                adRequestId: id,
                content: scriptContent,
            },
        });
        return script;
    }
    async getSuggestions() {
        const groups = await this.prisma.targetAudience.groupBy({
            by: ['segment'],
            _count: {
                segment: true,
            },
            orderBy: {
                _count: {
                    segment: 'desc',
                },
            },
            take: 10,
        });
        return groups.map(g => g.segment);
    }
    async generateVideo(id) {
        const request = await this.getRequest(id);
        if (!request.generatedScript)
            throw new common_1.BadRequestException('Script not generated yet');
        const existingJob = await this.prisma.videoJob.findUnique({ where: { adRequestId: id } });
        if (existingJob)
            return existingJob;
        await this.videoJobs.addJob(id, request.generatedScript.content);
        return { message: 'Video generation started', status: 'PENDING' };
    }
};
exports.AdsService = AdsService;
exports.AdsService = AdsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        script_generator_service_1.ScriptGeneratorService,
        video_jobs_service_1.VideoJobsService])
], AdsService);
//# sourceMappingURL=ads.service.js.map
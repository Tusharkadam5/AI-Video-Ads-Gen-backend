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
var VideoJobsProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoJobsProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let VideoJobsProcessor = VideoJobsProcessor_1 = class VideoJobsProcessor extends bullmq_1.WorkerHost {
    prisma;
    logger = new common_1.Logger(VideoJobsProcessor_1.name);
    constructor(prisma) {
        super();
        this.prisma = prisma;
    }
    async process(job) {
        const { adRequestId } = job.data;
        this.logger.log(`Start processing video job for AdRequest: ${adRequestId}`);
        await this.prisma.videoJob.update({
            where: { adRequestId },
            data: { status: client_1.JobStatus.PROCESSING },
        });
        await this.prisma.adRequest.update({
            where: { id: adRequestId },
            data: { status: client_1.JobStatus.PROCESSING },
        });
        await new Promise((resolve) => setTimeout(resolve, 5000));
        const mockUrl = `https://s3.aws.com/bucket/video-${adRequestId}.mp4`;
        await this.prisma.videoJob.update({
            where: { adRequestId },
            data: {
                status: client_1.JobStatus.COMPLETED,
                resultUrl: mockUrl
            },
        });
        await this.prisma.adRequest.update({
            where: { id: adRequestId },
            data: { status: client_1.JobStatus.COMPLETED },
        });
        this.logger.log(`Finished processing video job for AdRequest: ${adRequestId}`);
        return { url: mockUrl };
    }
};
exports.VideoJobsProcessor = VideoJobsProcessor;
exports.VideoJobsProcessor = VideoJobsProcessor = VideoJobsProcessor_1 = __decorate([
    (0, bullmq_1.Processor)('video-generation'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], VideoJobsProcessor);
//# sourceMappingURL=video-jobs.processor.js.map
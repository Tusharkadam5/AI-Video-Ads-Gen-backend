import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAdRequestDto } from './dto/create-ad-request.dto';
import { ScriptGeneratorService } from '../script-generator/script-generator.service';
import { VideoJobsService } from '../video-jobs/video-jobs.service';

@Injectable()
export class AdsService {
    constructor(
        private prisma: PrismaService,
        private scriptGen: ScriptGeneratorService,
        private videoJobs: VideoJobsService,
    ) { }

    async createRequest(userId: string, dto: CreateAdRequestDto) {
        return this.prisma.adRequest.create({
            data: {
                userId,
                ...dto,
            },
        });
    }

    async getRequest(id: string) {
        const request = await this.prisma.adRequest.findUnique({
            where: { id },
            include: { generatedScript: true, videoJob: true, product: true },
        });
        if (!request) throw new NotFoundException('Ad Request not found');
        return request;
    }

    async generateScript(id: string) {
        const request = await this.getRequest(id);
        if (!request.product) throw new BadRequestException('Product data missing');

        const scriptContent = await this.scriptGen.generateScript({
            productName: request.product.name,
            productDescription: request.product.description,
            platform: request.platform,
            duration: request.duration,
            targetAudience: request.targetAudience,
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

    async generateVideo(id: string) {
        const request = await this.getRequest(id);
        if (!request.generatedScript) throw new BadRequestException('Script not generated yet');

        // Check if job already exists?
        const existingJob = await this.prisma.videoJob.findUnique({ where: { adRequestId: id } });
        if (existingJob) return existingJob;

        await this.videoJobs.addJob(id, request.generatedScript.content);
        return { message: 'Video generation started', status: 'PENDING' };
    }
}

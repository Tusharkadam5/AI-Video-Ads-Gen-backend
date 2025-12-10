import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JobStatus } from '@prisma/client';

@Processor('video-generation')
export class VideoJobsProcessor extends WorkerHost {
    private readonly logger = new Logger(VideoJobsProcessor.name);

    constructor(private prisma: PrismaService) {
        super();
    }

    async process(job: Job<any, any, string>): Promise<any> {
        const { adRequestId } = job.data;
        this.logger.log(`Start processing video job for AdRequest: ${adRequestId}`);

        await this.prisma.videoJob.update({
            where: { adRequestId },
            data: { status: JobStatus.PROCESSING },
        });

        await this.prisma.adRequest.update({
            where: { id: adRequestId },
            data: { status: JobStatus.PROCESSING },
        });

        // Mock Video Generation Delay
        await new Promise((resolve) => setTimeout(resolve, 5000));

        // Success
        const mockUrl = `https://s3.aws.com/bucket/video-${adRequestId}.mp4`;

        await this.prisma.videoJob.update({
            where: { adRequestId },
            data: {
                status: JobStatus.COMPLETED,
                resultUrl: mockUrl
            },
        });

        await this.prisma.adRequest.update({
            where: { id: adRequestId },
            data: { status: JobStatus.COMPLETED },
        });

        this.logger.log(`Finished processing video job for AdRequest: ${adRequestId}`);
        return { url: mockUrl };
    }
}

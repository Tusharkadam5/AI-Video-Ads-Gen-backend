import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { JobStatus } from '@prisma/client';

@Injectable()
export class VideoJobsService {
    constructor(
        @InjectQueue('video-generation') private videoQueue: Queue,
        private prisma: PrismaService,
    ) { }

    async addJob(adRequestId: string, script: any) {
        // Create tracking record
        await this.prisma.videoJob.create({
            data: {
                adRequestId,
                status: JobStatus.PENDING,
            },
        });

        // Add to queue
        await this.videoQueue.add('generate', {
            adRequestId,
            script,
        });
    }
}

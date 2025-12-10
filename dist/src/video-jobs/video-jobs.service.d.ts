import { Queue } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
export declare class VideoJobsService {
    private videoQueue;
    private prisma;
    constructor(videoQueue: Queue, prisma: PrismaService);
    addJob(adRequestId: string, script: any): Promise<void>;
}

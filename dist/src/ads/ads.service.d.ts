import { PrismaService } from '../prisma/prisma.service';
import { CreateAdRequestDto } from './dto/create-ad-request.dto';
import { ScriptGeneratorService } from '../script-generator/script-generator.service';
import { VideoJobsService } from '../video-jobs/video-jobs.service';
export declare class AdsService {
    private prisma;
    private scriptGen;
    private videoJobs;
    constructor(prisma: PrismaService, scriptGen: ScriptGeneratorService, videoJobs: VideoJobsService);
    createRequest(userId: string, dto: CreateAdRequestDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        platform: import("@prisma/client").$Enums.Platform;
        aspectRatio: import("@prisma/client").$Enums.AspectRatio;
        language: import("@prisma/client").$Enums.Language;
        targetAudience: string;
        duration: import("@prisma/client").$Enums.AdDuration;
        status: import("@prisma/client").$Enums.JobStatus;
        productId: string;
    }>;
    getRequest(id: string): Promise<{
        product: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            images: string[];
            logo: string | null;
            link: string | null;
            userId: string;
        };
        generatedScript: {
            id: string;
            createdAt: Date;
            adRequestId: string;
            content: import("@prisma/client/runtime/client").JsonValue;
        } | null;
        videoJob: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.JobStatus;
            jobBoardId: string | null;
            resultUrl: string | null;
            adRequestId: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        platform: import("@prisma/client").$Enums.Platform;
        aspectRatio: import("@prisma/client").$Enums.AspectRatio;
        language: import("@prisma/client").$Enums.Language;
        targetAudience: string;
        duration: import("@prisma/client").$Enums.AdDuration;
        status: import("@prisma/client").$Enums.JobStatus;
        productId: string;
    }>;
    generateScript(id: string): Promise<{
        id: string;
        createdAt: Date;
        adRequestId: string;
        content: import("@prisma/client/runtime/client").JsonValue;
    }>;
    generateVideo(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.JobStatus;
        jobBoardId: string | null;
        resultUrl: string | null;
        adRequestId: string;
    } | {
        message: string;
        status: string;
    }>;
}

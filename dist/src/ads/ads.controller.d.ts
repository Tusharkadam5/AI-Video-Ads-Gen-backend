import { AdsService } from './ads.service';
import { CreateAdRequestDto } from './dto/create-ad-request.dto';
export declare class AdsController {
    private readonly adsService;
    constructor(adsService: AdsService);
    create(user: any, dto: CreateAdRequestDto): Promise<{
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
    selectAvatar(id: string, avatarId: string): {
        message: string;
        avatarId: string;
    };
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
    getStatus(id: string): Promise<{
        product: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            images: string[];
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
}

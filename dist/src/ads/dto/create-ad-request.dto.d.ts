import { Platform, AspectRatio, Language, AdDuration } from '@prisma/client';
export declare class CreateAdRequestDto {
    productId: string;
    platform: Platform;
    aspectRatio: AspectRatio;
    language: Language;
    targetAudiences: string[];
    duration: AdDuration;
}

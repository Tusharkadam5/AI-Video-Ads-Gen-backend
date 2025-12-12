import { IsString, IsNotEmpty, IsEnum, IsUUID, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Platform, AspectRatio, Language, AdDuration } from '@prisma/client';

export class CreateAdRequestDto {
    @ApiProperty()
    @IsUUID()
    productId: string;

    @ApiProperty({ enum: Platform })
    @IsEnum(Platform)
    platform: Platform;

    @ApiProperty({ enum: AspectRatio })
    @IsEnum(AspectRatio)
    aspectRatio: AspectRatio;

    @ApiProperty({ enum: Language })
    @IsEnum(Language)
    language: Language;

    @ApiProperty()
    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty()
    targetAudiences: string[];

    @ApiProperty({ enum: AdDuration })
    @IsEnum(AdDuration)
    duration: AdDuration;
}

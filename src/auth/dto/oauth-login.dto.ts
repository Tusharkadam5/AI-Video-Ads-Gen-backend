import { IsNotEmpty, IsString, IsEnum, IsEmail, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum OAuthProvider {
    GOOGLE = 'GOOGLE',
    FACEBOOK = 'FACEBOOK',
}

export class OAuthLoginDto {
    @ApiProperty({ enum: OAuthProvider })
    @IsEnum(OAuthProvider)
    provider: OAuthProvider;

    @ApiProperty({ description: 'Token from the provider (e.g. Google id_token)' })
    @IsString()
    @IsNotEmpty()
    token: string;
}

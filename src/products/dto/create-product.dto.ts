import { IsString, IsNotEmpty, IsOptional, IsArray, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({ type: [String] })
    @IsArray()
    @IsString({ each: true })
    @IsUrl({}, { each: true })
    images: string[];

    @ApiProperty({ required: false })
    @IsOptional()
    @IsUrl()
    link?: string;
}

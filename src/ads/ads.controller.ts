import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { AdsService } from './ads.service';
import { CreateAdRequestDto } from './dto/create-ad-request.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Ads')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ads')
export class AdsController {
    constructor(private readonly adsService: AdsService) { }

    @Post('request')
    @ApiOperation({ summary: 'Create a new Ad Request' })
    create(@CurrentUser() user: any, @Body() dto: CreateAdRequestDto) {
        return this.adsService.createRequest(user.id, dto);
    }

    @Post(':id/generate-script')
    @ApiOperation({ summary: 'Generate AI Script for Ad' })
    generateScript(@Param('id') id: string) {
        return this.adsService.generateScript(id);
    }

    @Post(':id/select-avatar')
    @ApiOperation({ summary: 'Select Avatar (Placeholder)' })
    @ApiBody({ schema: { example: { avatarId: "avatar-1" } } })
    selectAvatar(@Param('id') id: string, @Body('avatarId') avatarId: string) {
        return { message: 'Avatar selected', avatarId };
    }

    @Post(':id/generate-video')
    @ApiOperation({ summary: 'Start Video Generation Job' })
    generateVideo(@Param('id') id: string) {
        return this.adsService.generateVideo(id);
    }

    @Get(':id/status')
    @ApiOperation({ summary: 'Get Ad Request Status' })
    getStatus(@Param('id') id: string) {
        return this.adsService.getRequest(id);
    }
}

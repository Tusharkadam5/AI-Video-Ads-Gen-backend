import { Controller, Get, Param } from '@nestjs/common';
import { AvatarsService } from './avatars.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Avatars')
@Controller('avatars')
export class AvatarsController {
    constructor(private readonly avatarsService: AvatarsService) { }

    @Get()
    @ApiOperation({ summary: 'List available avatars' })
    findAll() {
        return this.avatarsService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get avatar details' })
    findOne(@Param('id') id: string) {
        return this.avatarsService.findOne(id);
    }
}

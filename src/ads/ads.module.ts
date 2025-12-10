import { Module } from '@nestjs/common';
import { AdsService } from './ads.service';
import { AdsController } from './ads.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ScriptGeneratorModule } from '../script-generator/script-generator.module';
import { VideoJobsModule } from '../video-jobs/video-jobs.module';

@Module({
  imports: [PrismaModule, ScriptGeneratorModule, VideoJobsModule],
  controllers: [AdsController],
  providers: [AdsService],
})
export class AdsModule { }

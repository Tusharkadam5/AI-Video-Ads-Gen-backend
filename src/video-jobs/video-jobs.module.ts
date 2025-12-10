import { Module } from '@nestjs/common';
import { VideoJobsService } from './video-jobs.service';
import { VideoJobsProcessor } from './video-jobs.processor';
import { BullModule } from '@nestjs/bullmq';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'video-generation',
    }),
    PrismaModule,
  ],
  providers: [VideoJobsService, VideoJobsProcessor],
  exports: [VideoJobsService],
})
export class VideoJobsModule { }

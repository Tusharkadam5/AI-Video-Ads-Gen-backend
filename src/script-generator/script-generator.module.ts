import { Module } from '@nestjs/common';
import { ScriptGeneratorService } from './script-generator.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [ScriptGeneratorService],
  exports: [ScriptGeneratorService],
})
export class ScriptGeneratorModule { }

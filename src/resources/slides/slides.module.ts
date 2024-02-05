import { Module } from '@nestjs/common';
import { SlideRepository } from './repositories/slide.repository';
import { ModulesModule } from '../modules/modules.module';
import { SlidesService } from './services/slides.service';

@Module({
  providers: [SlideRepository, SlidesService],
  exports: [SlidesService],
})
export class SlidesModule {}

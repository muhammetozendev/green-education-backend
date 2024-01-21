import { Module } from '@nestjs/common';
import { SlideRepository } from './repositories/slide.repository';

@Module({
  providers: [SlideRepository],
})
export class SlidesModule {}

import { Module } from '@nestjs/common';
import { ModuleProgressRepository } from './repositories/module-progress/module-progress.repository';
import { SubmoduleProgressRepository } from './repositories/submodule-progress/submodule-progress.repository';
import { SlideProgressRepository } from './repositories/slide-progress/slide-progress.repository';

@Module({
  providers: [
    ModuleProgressRepository,
    SubmoduleProgressRepository,
    SlideProgressRepository,
  ],
})
export class ProgressModule {}

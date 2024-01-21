import { Module } from '@nestjs/common';
import { ModuleProgressRepository } from './repositories/module-progress/module-progress.repository';
import { SubmoduleProgressRepository } from './repositories/submodule-progress/submodule-progress.repository';
import { SlideProgressRepository } from './repositories/slide-progress/slide-progress.repository';
import { SlideProgressService } from './services/slide-progress/slide-progress.service';
import { ModuleProgressService } from './services/module-progress/module-progress.service';
import { SubmoduleProgressService } from './services/submodule-progress/submodule-progress.service';
import { SubmoduleRepository } from './repositories/submodule/submodule.repository';
import { QuizProgressRepository } from './repositories/quiz-progress/quiz-progress.repository';
import { ModuleRepository } from '../modules/repositories/module/module.repository';

@Module({
  providers: [
    ModuleProgressRepository,
    SubmoduleProgressRepository,
    SlideProgressRepository,
    SubmoduleRepository,
    ModuleRepository,
    QuizProgressRepository,
    SlideProgressService,
    ModuleProgressService,
    SubmoduleProgressService,
  ],
  exports: [
    SlideProgressService,
    ModuleProgressService,
    SubmoduleProgressService,
  ],
})
export class ProgressModule {}

import { Module } from '@nestjs/common';
import { ModulesService } from './services/modules/modules.service';
import { ModulesController } from './modules.controller';
import { SubmodulesService } from './services/submodules/submodules.service';
import { ModuleRepository } from './repositories/module/module.repository';
import { SubmoduleRepository } from './repositories/submodule/submodule.repository';
import { SubmodulesController } from './submodules.controller';
import { ProgressModule } from '../progress/progress.module';
import { SlidesModule } from '../slides/slides.module';

@Module({
  imports: [ProgressModule, SlidesModule],
  controllers: [ModulesController, SubmodulesController],
  providers: [
    ModulesService,
    SubmodulesService,
    ModuleRepository,
    SubmoduleRepository,
  ],
  exports: [ModulesService],
})
export class ModulesModule {}

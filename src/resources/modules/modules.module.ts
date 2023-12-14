import { Module } from '@nestjs/common';
import { ModulesService } from './services/modules/modules.service';
import { ModulesController } from './modules.controller';
import { SubmodulesService } from './services/submodules/submodules.service';
import { ModuleRepository } from './repositories/module/module.repository';
import { SubmoduleRepository } from './repositories/submodule/submodule.repository';

@Module({
  controllers: [ModulesController],
  providers: [
    ModulesService,
    SubmodulesService,
    ModuleRepository,
    SubmoduleRepository,
  ],
  exports: [ModulesService],
})
export class ModulesModule {}

import { Module } from '@nestjs/common';
import { ModulesService } from './services/modules.service';
import { ModulesController } from './modules.controller';

@Module({
  providers: [ModulesService],
  controllers: [ModulesController]
})
export class ModulesModule {}

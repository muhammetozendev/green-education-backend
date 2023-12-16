import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Transactional } from 'src/config/db/utils/transactional.decorator';
import { ModulesService } from './services/modules/modules.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { SubmodulesService } from './services/submodules/submodules.service';

@Controller('modules')
export class ModulesController {
  constructor(
    private readonly modulesService: ModulesService,
    private readonly submodulesService: SubmodulesService,
  ) {}

  @Get(':id')
  getModule(@Param('id') id: string) {
    return this.modulesService.getModuleOrFail(+1);
  }

  @Get(':id/submodules')
  getSubmodules(@Param('id') id: string) {
    return this.submodulesService.getSubmodulesByModule(+id);
  }

  @Post()
  @Transactional()
  createModule(@Body() body: CreateModuleDto) {
    return this.modulesService.createModule(body);
  }

  @Patch(':id')
  @HttpCode(204)
  async updateModule(@Param('id') id: string, @Body() body: UpdateModuleDto) {
    await this.modulesService.updateModule(+id, body);
  }

  @Delete(':id')
  @HttpCode(204)
  @Transactional()
  async deleteModule(@Param('id') id: string) {
    await this.modulesService.deleteModule(+id);
  }
}

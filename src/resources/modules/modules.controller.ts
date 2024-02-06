import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { Transactional } from 'src/config/db/utils/transactional.decorator';
import { ModulesService } from './services/modules/modules.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { SubmodulesService } from './services/submodules/submodules.service';
import { ActiveUser } from '../auth/decorators/active-user.decorator';
import { UserDto } from '../auth/dto/user.dto';
import { Role } from '../auth/decorators/role.decorator';
import { RoleEnum } from '../auth/enums/role.enum';
import { ApiTags } from '@nestjs/swagger';

@Controller('modules')
@ApiTags('Modules')
export class ModulesController {
  constructor(
    private readonly modulesService: ModulesService,
    private readonly submodulesService: SubmodulesService,
  ) {}

  @Get('user-modules')
  @Role(RoleEnum.USER)
  getModules(@ActiveUser() user: UserDto) {
    return this.modulesService.findModulesAndProgressByOrganization(user);
  }

  @Get()
  @Role(RoleEnum.ADMIN)
  getAllModules() {
    return this.modulesService.findAllModules();
  }

  @Get(':id')
  getModule(
    @Param('id', ParseIntPipe) id: number,
    @ActiveUser() user: UserDto,
  ) {
    return this.modulesService.findModule(id, user);
  }

  @Get(':id/submodules')
  getSubmodules(@Param('id') id: string, @ActiveUser() user: UserDto) {
    return this.submodulesService.getSubmodulesByModule(+id, user);
  }

  @Post()
  @Role(RoleEnum.ADMIN)
  @Transactional()
  createModule(@Body() body: CreateModuleDto) {
    return this.modulesService.createModule(body);
  }

  @Patch(':id')
  @Role(RoleEnum.ADMIN)
  @HttpCode(204)
  async updateModule(@Param('id') id: string, @Body() body: UpdateModuleDto) {
    await this.modulesService.updateModule(+id, body);
  }

  @Delete(':id')
  @HttpCode(204)
  @Role(RoleEnum.ADMIN)
  @Transactional()
  async deleteModule(@Param('id') id: string) {
    await this.modulesService.deleteModule(+id);
  }
}

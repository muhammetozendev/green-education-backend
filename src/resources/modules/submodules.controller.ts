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
  Query,
} from '@nestjs/common';
import { SubmodulesService } from './services/submodules/submodules.service';
import { CreateSubmoduleDto } from './dto/create-submodule.dto';
import { UpdateSubmoduleDto } from './dto/update-submodule.dto';
import { Transactional } from 'src/config/db/utils/transactional.decorator';

@Controller('submodules')
export class SubmodulesController {
  constructor(private readonly submodulesService: SubmodulesService) {}

  @Get(':id')
  async getSubmodule(@Param('id', ParseIntPipe) id: number) {
    return this.submodulesService.getSubmodule(id);
  }

  @Post()
  @Transactional()
  async createSubmodule(@Body() body: CreateSubmoduleDto) {
    return this.submodulesService.createSubmodule(body);
  }

  @Patch(':id')
  @Transactional()
  @HttpCode(204)
  async updateSubmodule(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateSubmoduleDto,
  ) {
    await this.submodulesService.updateSubmodule(id, body);
  }

  @Delete(':id')
  @Transactional()
  @HttpCode(204)
  async deleteSubmodule(@Param('id', ParseIntPipe) id: number) {
    await this.submodulesService.deleteSubmodule(id);
  }
}

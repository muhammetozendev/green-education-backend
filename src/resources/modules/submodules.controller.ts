import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { SubmodulesService } from './services/submodules/submodules.service';
import { CreateSubmoduleDto } from './dto/create-submodule.dto';
import { UpdateSubmoduleDto } from './dto/update-submodule.dto';
import { Transactional } from 'src/config/db/utils/transactional.decorator';
import { ActiveUser } from '../auth/decorators/active-user.decorator';
import { UserDto } from '../auth/dto/user.dto';
import { SlidesService } from '../slides/services/slides.service';
import { CreateSlideDto } from '../slides/dto/create-slide.dto';

@Controller('submodules')
export class SubmodulesController {
  constructor(
    private readonly submodulesService: SubmodulesService,
    private readonly slidesService: SlidesService,
  ) {}

  @Get(':id')
  async getSubmodule(@Param('id', ParseIntPipe) id: number) {
    const submodule = await this.submodulesService.getSubmodule(id);
    if (!submodule) throw new NotFoundException('Submodule not found');
    return submodule;
  }

  @Get(':id/slides')
  async getSlides(
    @Param('id', ParseIntPipe) id: number,
    @ActiveUser() user: UserDto,
  ) {
    const subModule = this.submodulesService.getSubmoduleForUser(id, user.id);
    if (!subModule) throw new NotFoundException('Submodule not found');
    return this.slidesService.getSlidesBySubmodule(id);
  }

  @Post(':id/slides')
  async createSlides(
    @Body(new ParseArrayPipe({ items: CreateSlideDto })) body: CreateSlideDto[],
    @Param('id', ParseIntPipe) id: number,
  ) {
    const submodule = await this.submodulesService.getSubmodule(id);
    if (!submodule) throw new NotFoundException('Submodule not found');
    return await this.slidesService.createSlides(id, body);
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

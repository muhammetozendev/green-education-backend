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
import { Role } from '../auth/decorators/role.decorator';
import { RoleEnum } from '../auth/enums/role.enum';
import { OrganizationsService } from './services/organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ApiTags } from '@nestjs/swagger';
import { Transactional } from 'src/config/db/utils/transactional.decorator';

@Controller('organizations')
@Role(RoleEnum.ADMIN)
@ApiTags('Organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Get()
  async findAll() {
    return await this.organizationsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.organizationsService.findOneOrFail(id);
  }

  @Get(':id/users')
  async findUsers(
    @Param('id', ParseIntPipe) id: number,
    @Query() pagination: PaginationDto,
  ) {
    return await this.organizationsService.findUsers(id, pagination);
  }

  @Get(':id/modules')
  async findModules(@Param('id', ParseIntPipe) id: number) {
    return await this.organizationsService.findModules(id);
  }

  @Post()
  async create(@Body() body: CreateOrganizationDto) {
    return await this.organizationsService.create(body);
  }

  @Patch(':id')
  @HttpCode(204)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateOrganizationDto,
  ) {
    return await this.organizationsService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(204)
  @Transactional()
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.organizationsService.delete(id);
  }
}

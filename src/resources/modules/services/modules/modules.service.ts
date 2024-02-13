import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ModuleRepository } from '../../repositories/module/module.repository';
import { CreateModuleDto } from '../../dto/create-module.dto';
import { UpdateModuleDto } from '../../dto/update-module.dto';
import { UserDto } from 'src/resources/auth/dto/user.dto';
import { RoleEnum } from 'src/resources/auth/enums/role.enum';
import { ModuleProgressService } from 'src/resources/progress/services/module-progress/module-progress.service';

@Injectable()
export class ModulesService {
  constructor(
    private readonly modulesRepository: ModuleRepository,
    private readonly moduleProgressService: ModuleProgressService,
  ) {}

  findAllModules() {
    return this.modulesRepository.find({
      order: {
        number: 'ASC',
      },
    });
  }

  findModulesAndProgressByOrganization(user: UserDto) {
    return this.modulesRepository.findModulesAndProgressByOrganization(
      user.id,
      user.organizationId,
    );
  }

  findModulesByOrganization(organizationId: number) {
    return this.modulesRepository.find({
      where: { organization: { id: organizationId } },
      order: { number: 'ASC' },
    });
  }

  findModulesByOrganizationAndLock(organizationId: number) {
    return this.modulesRepository.find({
      where: { organization: { id: organizationId } },
      order: { number: 'ASC' },
      lock: { mode: 'pessimistic_write' },
    });
  }

  async findModule(id: number, user: UserDto) {
    const module = await this.findModuleOrFail(id);
    if (user.role === RoleEnum.ADMIN) {
      return module;
    }
    const isComplete = await this.moduleProgressService.isModuleComplete(
      id,
      user.id,
    );
    return { ...module, isComplete: !!isComplete };
  }

  async findModuleOrFail(id: number) {
    return await this.modulesRepository.findOneByOrFail(
      { id },
      new NotFoundException('Module not found'),
    );
  }

  async findModuleWithOrganization(id: number) {
    return this.modulesRepository.findOne({
      where: { id },
      relations: {
        organization: true,
      },
    });
  }

  async createModule(data: CreateModuleDto) {
    const valid = await this.validateModuleNumber(
      data.number,
      data.organizationId,
    );
    if (!valid) {
      throw new BadRequestException('Invalid module number');
    }
    await this.modulesRepository.fixModuleNumbersForInsertion(
      data.number,
      data.organizationId,
    );
    return await this.modulesRepository.createAndReturn(data);
  }

  async updateModule(id: number, data: UpdateModuleDto) {
    await this.findModuleOrFail(id);
    await this.modulesRepository.update({ id }, data);
  }

  async deleteModule(id: number) {
    const module = await this.findModuleWithOrganization(id);
    await this.findModulesByOrganizationAndLock(module.organization.id);
    if (!module) {
      throw new NotFoundException('Module not found');
    }
    await this.modulesRepository.fixModuleNumbersForDeletion(
      module.number,
      module.organization.id,
    );
    await this.modulesRepository.delete({ id });
  }

  async validateModuleNumber(
    number: number,
    organizationId: number,
  ): Promise<boolean> {
    const modules = await this.findModulesByOrganizationAndLock(organizationId);

    if (modules.length === 0) {
      return number === 1;
    } else {
      return number > 0 && number <= modules.length + 1;
    }
  }
}

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ModuleRepository } from '../../repositories/module/module.repository';
import { CreateModuleDto } from '../../dto/create-module.dto';
import { UpdateModuleDto } from '../../dto/update-module.dto';

@Injectable()
export class ModulesService {
  constructor(private readonly modulesRepository: ModuleRepository) {}

  getModulesByOrganization(organizationId: number) {
    return this.modulesRepository.find({
      where: { organization: { id: organizationId } },
      order: { number: 'ASC' },
    });
  }

  getModulesByOrganizationAndLock(organizationId: number) {
    return this.modulesRepository.find({
      where: { organization: { id: organizationId } },
      order: { number: 'ASC' },
      lock: { mode: 'pessimistic_write' },
    });
  }

  getModule(id: number) {
    return this.modulesRepository.findOneBy({ id });
  }

  async getModuleOrFail(id: number) {
    const module = await this.modulesRepository.findOneBy({ id });
    if (!module) {
      throw new NotFoundException('Module not found');
    }
    return module;
  }

  async getModuleWithOrganization(id: number) {
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
    await this.getModuleOrFail(id);
    await this.modulesRepository.update({ id }, data);
  }

  async deleteModule(id: number) {
    const module = await this.getModuleWithOrganization(id);
    await this.getModulesByOrganizationAndLock(module.organization.id);
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
    const modules = await this.getModulesByOrganizationAndLock(organizationId);

    if (modules.length === 0) {
      return number === 1;
    } else {
      return number > 0 && number <= modules.length + 1;
    }
  }
}

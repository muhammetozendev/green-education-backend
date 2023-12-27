import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SubmoduleRepository } from '../../repositories/submodule/submodule.repository';
import { CreateSubmoduleDto } from '../../dto/create-submodule.dto';
import { UpdateSubmoduleDto } from '../../dto/update-submodule.dto';
import { ModuleRepository } from '../../repositories/module/module.repository';
import { UserDto } from 'src/resources/auth/dto/user.dto';
import { ModuleProgressService } from 'src/resources/progress/services/module-progress/module-progress.service';
import { RoleEnum } from 'src/resources/auth/enums/role.enum';

@Injectable()
export class SubmodulesService {
  constructor(
    private readonly submoduleRepository: SubmoduleRepository,
    private readonly moduleRepository: ModuleRepository,
    private readonly moduleProgressService: ModuleProgressService,
  ) {}

  async getSubmodulesByModule(moduleId: number, user: UserDto) {
    // Check if module exists
    const module = await this.moduleRepository.findOneByOrFail(
      { id: moduleId },
      new NotFoundException('Module not found'),
    );

    // If the user is admin, return all submodules
    if (user.role === RoleEnum.ADMIN) {
      return await this.submoduleRepository.find({
        where: {
          module: { id: moduleId },
        },
      });
    }

    // Else, return submodules with completed field only if user is able to access that module
    const lastModule =
      await this.moduleProgressService.findLastlyCompletedModule(user.id);

    if (
      (module.number !== 1 && !lastModule) ||
      module.number - 1 >= lastModule.module.number
    ) {
      throw new BadRequestException('You must complete previous module first');
    }

    return await this.submoduleRepository.findSubmodulesWithProgress(
      moduleId,
      user.id,
    );
  }

  async getSubmodulesByModuleAndLock(moduleId: number) {
    return this.submoduleRepository.find({
      where: {
        module: { id: moduleId },
      },
      lock: { mode: 'pessimistic_write' },
    });
  }

  async getSubmodule(id: number) {
    return this.submoduleRepository.findOne({
      where: { id },
      relations: {
        quiz: true,
        slides: true,
        module: true,
      },
    });
  }

  async createSubmodule(data: CreateSubmoduleDto) {
    const isValid = await this.validateSubmoduleNumber(
      data.moduleId,
      data.number,
    );
    if (!isValid) {
      throw new BadRequestException('Invalid submodule number');
    }
    await this.submoduleRepository.fixSubmoduleNumbersForInsertion(
      data.moduleId,
      data.number,
    );
    return await this.submoduleRepository.createAndReturn(data);
  }

  async updateSubmodule(id: number, data: UpdateSubmoduleDto) {
    const submodule = await this.getSubmodule(id);
    if (!submodule) {
      throw new NotFoundException('Submodule not found');
    }
    const { quizId, title } = data;
    await this.submoduleRepository.update(id, {
      quiz: { id: quizId },
      title,
    });
  }

  async deleteSubmodule(id: number) {
    const submodule = await this.getSubmodule(id);
    if (!submodule) {
      throw new NotFoundException('Submodule not found');
    }
    await this.submoduleRepository.fixSubmoduleNumbersForDeletion(
      submodule.module.id,
      submodule.number,
    );
    await this.submoduleRepository.delete(id);
  }

  async validateSubmoduleNumber(
    moduleId: number,
    number: number,
  ): Promise<boolean> {
    const submodules = await this.getSubmodulesByModuleAndLock(moduleId);
    if (submodules.length === 0) {
      return number === 1;
    } else {
      return number > 0 && number <= submodules.length + 1;
    }
  }
}

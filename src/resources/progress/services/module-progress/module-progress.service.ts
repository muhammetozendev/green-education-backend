import { Injectable } from '@nestjs/common';
import { ModuleProgressRepository } from '../../repositories/module-progress/module-progress.repository';

@Injectable()
export class ModuleProgressService {
  constructor(
    private readonly moduleProgressRepository: ModuleProgressRepository,
  ) {}

  isModuleComplete(moduleId: number, userId: number) {
    return this.moduleProgressRepository.findOneBy({
      module: { id: moduleId },
      user: { id: userId },
    });
  }

  findLastlyCompletedModule(userId: number) {
    return this.moduleProgressRepository.findOne({
      where: {
        user: { id: userId },
      },
      relations: {
        module: true,
      },
      order: { module: { number: 'DESC' } },
    });
  }

  completeModule(moduleId: number, userId: number) {
    return this.moduleProgressRepository.insert({
      module: { id: moduleId },
      user: { id: userId },
    });
  }
}

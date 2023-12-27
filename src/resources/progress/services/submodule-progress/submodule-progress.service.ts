import { Injectable } from '@nestjs/common';
import { SubmoduleProgressRepository } from '../../repositories/submodule-progress/submodule-progress.repository';

@Injectable()
export class SubmoduleProgressService {
  constructor(
    private readonly submoduleProgressRepository: SubmoduleProgressRepository,
  ) {}

  isSubmoduleComplete(submoduleId: number, userId: number) {
    return this.submoduleProgressRepository.findOneBy({
      submodule: { id: submoduleId },
      user: { id: userId },
    });
  }

  completeSubmodule(submoduleId: number, userId: number) {
    return this.submoduleProgressRepository.insert({
      submodule: { id: submoduleId },
      user: { id: userId },
    });
  }
}

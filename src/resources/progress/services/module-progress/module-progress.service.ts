import { BadRequestException, Injectable } from '@nestjs/common';
import { ModuleProgressRepository } from '../../repositories/module-progress/module-progress.repository';
import { ModuleRepository } from 'src/resources/modules/repositories/module/module.repository';
import { SubmoduleProgressRepository } from '../../repositories/submodule-progress/submodule-progress.repository';
import { QuizProgressRepository } from '../../repositories/quiz-progress/quiz-progress.repository';

@Injectable()
export class ModuleProgressService {
  constructor(
    private readonly moduleProgressRepository: ModuleProgressRepository,
    private readonly submoduleProgressRepository: SubmoduleProgressRepository,
    private readonly moduleRepository: ModuleRepository,
    private readonly quizProgressRepository: QuizProgressRepository,
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

  async completeModule(moduleId: number, userId: number) {
    const module = await this.moduleRepository.findOne({
      where: { id: moduleId },
      relations: { submodules: true, quiz: true },
    });

    // Make sure all submodules are complete
    const completedSubmodules = await this.submoduleProgressRepository.find({
      where: { user: { id: userId } },
      relations: { submodule: true },
    });

    const allComplete = module.submodules.every((submodule) =>
      completedSubmodules.some(
        (completedSubmodule) =>
          completedSubmodule.submodule.id === submodule.id,
      ),
    );

    if (!allComplete) {
      throw new Error('All submodules must be completed');
    }

    // Make sure quiz is complete if there's any
    if (module.quiz) {
      const isCompleted = await this.quizProgressRepository.findOne({
        where: { user: { id: userId }, quiz: { id: module.quiz.id } },
      });
      if (!isCompleted) {
        throw new BadRequestException('Quiz must be completed');
      }
    }

    await this.moduleProgressRepository.insert({
      module: { id: moduleId },
      user: { id: userId },
    });
  }
}

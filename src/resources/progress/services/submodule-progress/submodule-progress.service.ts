import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SubmoduleProgressRepository } from '../../repositories/submodule-progress/submodule-progress.repository';
import { SlideProgressRepository } from '../../repositories/slide-progress/slide-progress.repository';
import { SubmoduleRepository } from '../../repositories/submodule/submodule.repository';
import { QuizProgressRepository } from '../../repositories/quiz-progress/quiz-progress.repository';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Module } from 'src/resources/modules/repositories/module/module.entity';

@Injectable()
export class SubmoduleProgressService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly submoduleProgressRepository: SubmoduleProgressRepository,
    private readonly slideProgressRepository: SlideProgressRepository,
    private readonly submoduleRepository: SubmoduleRepository,
    private readonly quizProgressRepository: QuizProgressRepository,
  ) {}

  async isSubmoduleComplete(submoduleId: number, userId: number) {
    return await this.submoduleProgressRepository.findOneBy({
      submodule: { id: submoduleId },
      user: { id: userId },
    });
  }

  async findLastlyCompletedSubmodule(userId: number) {
    return await this.submoduleProgressRepository
      .findOne({
        where: {
          user: { id: userId },
        },
        relations: {
          submodule: true,
        },
        order: { submodule: { number: 'DESC' } },
      })
      .then((data) => data.submodule);
  }

  async completeSubmodule(submoduleId: number, userId: number) {
    const submodule = await this.submoduleRepository.findOne({
      where: { id: submoduleId },
      relations: { slides: true, quiz: true },
    });
    if (!submodule) {
      throw new NotFoundException('Submodule not found');
    }
    const slides = submodule.slides;

    // Make sure slides are all complete
    const completedSlides = await this.slideProgressRepository.find({
      where: { user: { id: userId } },
      relations: { slide: true },
    });

    const allComplete = slides.every((slide) =>
      completedSlides.some(
        (completedSlide) => completedSlide.slide.id === slide.id,
      ),
    );

    if (!allComplete) {
      throw new BadRequestException('All slides must be completed');
    }

    // Make sure quiz is complete if there's any
    if (submodule.quiz) {
      const isCompleted = await this.quizProgressRepository.findOne({
        where: { user: { id: userId }, quiz: { id: submodule.quiz.id } },
      });
      if (!isCompleted) {
        throw new BadRequestException('Quiz must be completed');
      }
    }

    await this.submoduleProgressRepository.insert({
      submodule: { id: submodule.id },
      user: { id: userId },
    });
  }

  async areSubmodulesComplete(moduleId: number, userId: number) {
    const submodules = await this.submoduleProgressRepository.find({
      where: {
        submodule: { module: { id: moduleId } },
        user: { id: userId },
      },
      relations: { submodule: true },
    });

    const module = await this.entityManager.findOne(Module, {
      where: { id: moduleId },
      relations: { submodules: true },
    });
    if (!module) {
      throw new BadRequestException('Module not found');
    }

    return module.submodules.every((submodule) =>
      submodules.some((s) => s.submodule.id === submodule.id),
    );
  }
}

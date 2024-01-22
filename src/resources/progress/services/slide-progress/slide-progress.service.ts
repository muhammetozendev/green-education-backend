import { BadRequestException, Injectable } from '@nestjs/common';
import { SlideProgressRepository } from '../../repositories/slide-progress/slide-progress.repository';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Submodule } from 'src/resources/modules/repositories/submodule/submodule.entity';

@Injectable()
export class SlideProgressService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly slideProgressRepository: SlideProgressRepository,
  ) {}

  isSlideComplete(slideId: number, userId: number) {
    return this.slideProgressRepository.findOneBy({
      slide: { id: slideId },
      user: { id: userId },
    });
  }

  async areSlidesComplete(submoduleId: number, userId: number) {
    const slides = await this.slideProgressRepository.find({
      where: {
        slide: { submodule: { id: submoduleId } },
        user: { id: userId },
      },
      relations: { slide: true },
    });

    const submodule = await this.entityManager.findOne(Submodule, {
      where: { id: submoduleId },
      relations: { slides: true },
    });
    if (!submodule) {
      throw new BadRequestException('Submodule not found');
    }

    return submodule.slides.every((slide) =>
      slides.some((s) => s.slide.id === slide.id),
    );
  }

  completeSlide(slideId: number, userId: number) {
    return this.slideProgressRepository.insert({
      slide: { id: slideId },
      user: { id: userId },
    });
  }
}

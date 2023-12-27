import { Injectable } from '@nestjs/common';
import { SlideProgressRepository } from '../../repositories/slide-progress/slide-progress.repository';

@Injectable()
export class SlideProgressService {
  constructor(
    private readonly slideProgressRepository: SlideProgressRepository,
  ) {}

  isSlideComplete(slideId: number, userId: number) {
    return this.slideProgressRepository.findOneBy({
      slide: { id: slideId },
      user: { id: userId },
    });
  }

  completeSlide(slideId: number, userId: number) {
    return this.slideProgressRepository.insert({
      slide: { id: slideId },
      user: { id: userId },
    });
  }
}

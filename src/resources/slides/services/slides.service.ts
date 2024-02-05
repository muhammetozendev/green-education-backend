import { Injectable, NotFoundException } from '@nestjs/common';
import { SlideRepository } from '../repositories/slide.repository';
import { SubmodulesService } from 'src/resources/modules/services/submodules/submodules.service';
import { CreateSlideDto } from '../dto/create-slide.dto';
import { Slide } from '../repositories/slide.entity';

@Injectable()
export class SlidesService {
  constructor(private readonly slideRepository: SlideRepository) {}

  async getSlidesBySubmodule(submoduleId: number) {
    return await this.slideRepository.find({
      where: {
        submodule: { id: submoduleId },
      },
    });
  }

  async createSlides(submoduleId: number, data: CreateSlideDto[]) {
    // TODO: Remove the image associated with the slide
    await this.slideRepository.delete({ submodule: { id: submoduleId } });
    const slides = data.map(
      (slide) =>
        ({
          imageUrl: slide.imageUrl,
          content: slide.content,
          submodule: { id: submoduleId },
        } as Slide),
    );
    return await this.slideRepository.save(slides);
  }
}

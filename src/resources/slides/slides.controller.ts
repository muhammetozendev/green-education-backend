import { Body, Controller, ParseArrayPipe, Post } from '@nestjs/common';
import { CreateSlideDto } from './dto/create-slide.dto';

@Controller('slides')
export class SlidesController {
  @Post()
  async createSlide() {
    return 'Slide created';
  }
}

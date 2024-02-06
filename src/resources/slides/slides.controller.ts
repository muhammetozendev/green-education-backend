import { Body, Controller, ParseArrayPipe, Post } from '@nestjs/common';
import { CreateSlideDto } from './dto/create-slide.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('slides')
@ApiTags('Slides')
export class SlidesController {
  @Post()
  async createSlide() {
    return 'Slide created';
  }
}

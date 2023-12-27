import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateQuizDto } from './dto/quiz/create-quiz.dto';
import { QuizzesService } from './services/quizzes/quizzes.service';
import { UpdateQuizDto } from './dto/quiz/update-quiz.dto';
import { Role } from '../auth/decorators/role.decorator';
import { RoleEnum } from '../auth/enums/role.enum';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('quizzes')
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Get(':id')
  @Role(RoleEnum.ADMIN)
  async getQuizById(@Param('id', ParseIntPipe) id: number) {
    return await this.quizzesService.getQuizById(id);
  }

  @Get()
  async getQuizzes(@Query() pagination: PaginationDto) {
    return await this.quizzesService.getQuizzes(
      pagination.limit,
      pagination.page,
    );
  }

  @Post()
  @Role(RoleEnum.ADMIN)
  async createQuiz(@Body() body: CreateQuizDto) {
    return await this.quizzesService.createQuiz(body.title);
  }

  @Patch(':id')
  @Role(RoleEnum.ADMIN)
  async updateQuiz(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateQuizDto,
  ) {
    return await this.quizzesService.updateQuiz(id, body.title);
  }

  @Delete(':id')
  @Role(RoleEnum.ADMIN)
  async deleteQuiz(@Param('id', ParseIntPipe) id: number) {
    return await this.quizzesService.deleteQuiz(id);
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
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
import { Transactional } from 'src/config/db/utils/transactional.decorator';
import { ActiveUser } from '../auth/decorators/active-user.decorator';
import { UserDto } from '../auth/dto/user.dto';
import { QuestionsService } from './services/questions/questions.service';

@Controller('quizzes')
export class QuizzesController {
  constructor(
    private readonly quizzesService: QuizzesService,
    private readonly questionsService: QuestionsService,
  ) {}

  @Get(':id')
  async getQuizById(@Param('id', ParseIntPipe) id: number) {
    const quiz = await this.quizzesService.getQuizById(id);
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }
    return quiz;
  }

  @Get()
  @Role(RoleEnum.ADMIN)
  async getQuizzes(@Query() pagination: PaginationDto) {
    return await this.quizzesService.getQuizzes(
      pagination.limit,
      pagination.page,
    );
  }

  @Post()
  @Role(RoleEnum.ADMIN)
  async createQuiz(@Body() body: CreateQuizDto) {
    return await this.quizzesService.createQuiz(body);
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

  @Get(':id/questions')
  async getQuestions(
    @Param('id', ParseIntPipe) quizId: number,
    @ActiveUser() user: UserDto,
  ) {
    return await this.quizzesService.getQuestions(quizId, user);
  }

  @Post(':id/questions/:questionId/answer/:optionId')
  @Role(RoleEnum.USER)
  async answerQuestion(
    @Param('id', ParseIntPipe) quizId: number,
    @Param('questionId', ParseIntPipe) questionId: number,
    @Param('optionId', ParseIntPipe) optionId: number,
    @ActiveUser() user: UserDto,
  ) {
    return await this.questionsService.answerQuestion(
      quizId,
      questionId,
      optionId,
      user.id,
    );
  }

  @Post(':id/submit')
  @Transactional()
  @Role(RoleEnum.USER)
  async submitQuiz(
    @Param('id', ParseIntPipe) quizId: number,
    @ActiveUser() user: UserDto,
  ) {
    return await this.quizzesService.submitQuiz(user, quizId);
  }
}

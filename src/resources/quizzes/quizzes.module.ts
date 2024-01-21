import { Module } from '@nestjs/common';
import { QuizRepository } from './repositories/quiz/quiz.repository';
import { QuizzesService } from './services/quizzes/quizzes.service';
import { QuestionsService } from './services/questions/questions.service';
import { QuizzesController } from './quizzes.controller';
import { QuestionRepository } from './repositories/question/question.repository';
import { OptionRepository } from './repositories/option/option.repository';
import { AnswerRepository } from './repositories/answer/answer.repository';
import { AttemptRepository } from './repositories/attempt/attempt.repository';

@Module({
  providers: [
    QuizRepository,
    QuizzesService,
    QuestionsService,
    QuizRepository,
    QuestionRepository,
    OptionRepository,
    AnswerRepository,
    AttemptRepository,
  ],
  controllers: [QuizzesController],
})
export class QuizzesModule {}

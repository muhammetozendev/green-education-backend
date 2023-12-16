import { Module } from '@nestjs/common';
import { QuizRepository } from './repositories/quiz/quiz.repository';

@Module({
  providers: [QuizRepository],
})
export class QuizzesModule {}

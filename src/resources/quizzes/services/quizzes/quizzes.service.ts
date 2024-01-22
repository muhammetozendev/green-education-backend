import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { QuizRepository } from '../../repositories/quiz/quiz.repository';
import { AnswerRepository } from '../../repositories/answer/answer.repository';
import { AttemptRepository } from '../../repositories/attempt/attempt.repository';
import { Question } from '../../repositories/question/question.entity';
import { UserDto } from 'src/resources/auth/dto/user.dto';
import { RoleEnum } from 'src/resources/auth/enums/role.enum';
import { SubmoduleProgressService } from 'src/resources/progress/services/submodule-progress/submodule-progress.service';
import { Quiz } from '../../repositories/quiz/quiz.entity';
import { SlideProgressService } from 'src/resources/progress/services/slide-progress/slide-progress.service';

@Injectable()
export class QuizzesService {
  constructor(
    private readonly quizRepository: QuizRepository,
    private readonly submoduleProgressService: SubmoduleProgressService,
    private readonly slideProgressService: SlideProgressService,
    private readonly answerRepository: AnswerRepository,
    private readonly attemptRepository: AttemptRepository,
  ) {}

  async getQuizzes(limit: number, page: number) {
    return await this.quizRepository.find({
      take: limit,
      skip: (page - 1) * limit,
      relations: { questions: { options: true } },
    });
  }

  async createQuiz(title: string) {
    return await this.quizRepository.save({
      title: title,
    });
  }

  async updateQuiz(id: number, title?: string) {
    const quiz = await this.quizRepository.findOneBy({ id });
    if (title) {
      quiz.title = title;
    }
    await this.quizRepository.save(quiz);
  }

  async getQuizById(id: number) {
    return await this.quizRepository.findOne({
      where: { id },
      select: {
        id: true,
        title: true,
        questions: {
          id: true,
          question: true,
          options: { id: true, option: true },
        },
      },
      relations: { questions: { options: true } },
    });
  }

  async getQuestions(quizId: number, user: UserDto): Promise<Question[]> {
    const quiz = await this.quizRepository.findOne({
      where: { id: quizId },
      select: {
        id: true,
        title: true,
        questions: {
          id: true,
          question: true,
          options: { id: true, option: true },
        },
      },
      relations: {
        questions: { options: true },
        module: true,
        submodule: true,
      },
    });
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    // Check if user is allowed to take the quiz
    if (user.role == RoleEnum.USER) {
      await this.canTakeQuiz(quiz, user);
    }

    return quiz.questions;
  }

  async deleteQuiz(id: number) {
    const quiz = await this.quizRepository.findOneBy({ id });
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }
    await this.quizRepository.delete(quiz.id);
  }

  async submitQuiz(user: UserDto, quizId: number) {
    const quiz = await this.quizRepository.findOne({
      where: { id: quizId },
      relations: {
        questions: { options: true },
        module: true,
        submodule: true,
      },
    });
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    await this.canTakeQuiz(quiz, user);

    const answers = await this.answerRepository.find({
      where: { user: { id: user.id }, question: { quiz: { id: quizId } } },
    });

    // Calculate the score
    const total = quiz.questions.length;
    const correct = answers.filter((answer) => answer.isCorrect).length;
    const incorrect = answers.filter((answer) => !answer.isCorrect).length;
    const skipped = total - (correct + incorrect);
    const score = Math.round((correct / total) * 100);

    // Save the attempt for the quiz
    const results = await this.attemptRepository.save({
      total,
      correct,
      incorrect,
      skipped,
      score,
      user: { id: user.id },
      quiz: { id: quizId },
    });

    // Remove all answers for this quiz
    await this.answerRepository.delete({
      user: { id: user.id },
      question: { quiz: { id: quizId } },
    });

    return results;
  }

  private async canTakeQuiz(quiz: Quiz, user: UserDto) {
    if (quiz.module) {
      const cond = await this.submoduleProgressService.areSubmodulesComplete(
        quiz.module.id,
        user.id,
      );
      if (!cond) {
        throw new BadRequestException('All submodules must be completed');
      }
    }
    if (quiz.submodule) {
      const cond = await this.slideProgressService.areSlidesComplete(
        quiz.submodule.id,
        user.id,
      );
      if (!cond) {
        throw new BadRequestException('All slides must be completed');
      }
    }
  }
}

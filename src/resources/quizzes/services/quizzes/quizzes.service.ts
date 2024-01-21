import { Injectable, NotFoundException } from '@nestjs/common';
import { QuizRepository } from '../../repositories/quiz/quiz.repository';
import { AnswerRepository } from '../../repositories/answer/answer.repository';
import { AttemptRepository } from '../../repositories/attempt/attempt.repository';

@Injectable()
export class QuizzesService {
  constructor(
    private readonly quizRepository: QuizRepository,
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

  async deleteQuiz(id: number) {
    const quiz = await this.quizRepository.findOneBy({ id });
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }
    await this.quizRepository.delete(quiz.id);
  }

  async submitQuiz(userId: number, quizId: number) {
    const quiz = await this.quizRepository.findOne({
      where: { id: quizId },
      relations: { questions: { options: true } },
    });
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }
    const answers = await this.answerRepository.find({
      where: { user: { id: userId }, question: { quiz: { id: quizId } } },
    });

    // Calculate the score
    const total = quiz.questions.length;
    const correct = answers.filter((answer) => answer.isCorrect).length;
    const incorrect = answers.filter(
      (answer) => answer.isCorrect === false,
    ).length;
    const skipped = total - (correct + incorrect);
    const score = Math.round((correct / total) * 100);

    // Save the attempt for the quiz
    const results = await this.attemptRepository.save({
      total,
      correct,
      incorrect,
      skipped,
      score,
      user: { id: userId },
      quiz: { id: quizId },
    });

    // Remove all answers for this quiz
    await this.answerRepository.delete({
      user: { id: userId },
      question: { quiz: { id: quizId } },
    });

    return results;
  }
}

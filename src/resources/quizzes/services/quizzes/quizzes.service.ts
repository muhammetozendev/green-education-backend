import { Injectable, NotFoundException } from '@nestjs/common';
import { QuizRepository } from '../../repositories/quiz/quiz.repository';

@Injectable()
export class QuizzesService {
  constructor(private readonly quizRepository: QuizRepository) {}

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
}

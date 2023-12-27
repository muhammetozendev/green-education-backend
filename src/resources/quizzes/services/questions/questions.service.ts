import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateQuestionDto } from '../../dto/question/create-question.dto';
import { QuestionRepository } from '../../repositories/question/question.repository';
import { OptionRepository } from '../../repositories/option/option.repository';
import { OptionDto } from '../../dto/option/option.dto';
import { UpdateQuestionDto } from '../../dto/question/update-question.dto';
import { AnswerRepository } from '../../repositories/answer/answer.repository';

@Injectable()
export class QuestionsService {
  constructor(
    private readonly questionRepository: QuestionRepository,
    private readonly optionRepository: OptionRepository,
    private readonly answerRepository: AnswerRepository,
  ) {}

  async createQuestion(data: CreateQuestionDto) {
    const options = await this.createOptions(data.options);
    return await this.questionRepository.save({
      question: data.question,
      quiz: { id: data.quizId },
      options,
    });
  }

  private async createOptions(options: OptionDto[]) {
    return options.map((option) => {
      return this.optionRepository.create({
        option: option.option,
        isCorrect: option.isCorrect,
      });
    });
  }

  async updateQuestion(id: number, data: UpdateQuestionDto) {
    const questionEntity = await this.questionRepository.findOne({
      where: { id },
      relations: { options: true },
    });
    if (!questionEntity) {
      throw new NotFoundException('Question not found');
    }
    if (data.question) {
      questionEntity.question = data.question;
    }
    if (data.options) {
      questionEntity.options = await this.createOptions(data.options);
    }
    return await this.questionRepository.save(questionEntity);
  }

  async deleteQuestion(id: number) {
    const question = await this.questionRepository.findOneBy({ id });
    if (!question) {
      throw new NotFoundException('Question not found');
    }
    await this.questionRepository.delete(question.id);
  }

  async answerQuestion(questionId: number, optionId: number, userId: number) {
    const question = await this.questionRepository.findOne({
      where: { id: questionId },
      relations: { options: true },
    });
    if (!question) {
      throw new NotFoundException('Question not found');
    }
    const option = question.options.find((option) => option.id === optionId);
    if (!option) {
      throw new NotFoundException('Option not found');
    }
    const isCorrect = option.isCorrect;
    await this.answerRepository.upsert(
      {
        user: { id: userId },
        question: { id: questionId },
        option: { id: optionId },
        isCorrect: isCorrect,
      },
      { conflictPaths: { user: true, question: true } },
    );
  }

  async clearAnswers(userId: number, questionId: number) {
    await this.answerRepository.delete({
      user: { id: userId },
      question: { id: questionId },
    });
  }
}

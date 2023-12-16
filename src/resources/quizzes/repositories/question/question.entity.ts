import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Quiz } from '../quiz/quiz.entity';
import { Option } from '../option/option.entity';
import { Answer } from '../answer/answer.entity';

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  question: string;

  @ManyToOne(() => Quiz, (quiz) => quiz.questions, {
    onDelete: 'CASCADE',
  })
  quiz: Quiz;

  @OneToMany(() => Option, (question) => question.question)
  options: Option[];

  @OneToMany(() => Answer, (answer) => answer.question)
  answers: Answer[];
}

import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Question } from '../question/question.entity';
import { Answer } from '../answer/answer.entity';

@Entity()
export class Option {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  option: string;

  @Column()
  isCorrect: boolean;

  @ManyToOne(() => Question, (question) => question.options, {
    onDelete: 'CASCADE',
  })
  question: Question;

  @OneToMany(() => Answer, (answer) => answer.option)
  answers: Answer[];
}

import { User } from 'src/resources/users/repositories/user/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Question } from '../question/question.entity';
import { Option } from '../option/option.entity';

@Entity()
export class Answer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  isCorrect: boolean;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Question, (question) => question.answers, {
    onDelete: 'CASCADE',
  })
  question: Question;

  @ManyToOne(() => Option, (option) => option.answers, {
    onDelete: 'CASCADE',
  })
  option: Option;
}

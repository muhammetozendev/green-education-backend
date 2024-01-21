import { User } from 'src/resources/users/repositories/user/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Quiz } from '../quiz/quiz.entity';

@Entity()
export class Attempt {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  total: number;

  @Column()
  correct: number;

  @Column()
  incorrect: number;

  @Column()
  skipped: number;

  @Column()
  score: number;

  @ManyToOne(() => User, (user) => user.attempts, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Quiz, (quiz) => quiz.attempts, {
    onDelete: 'CASCADE',
  })
  quiz: Quiz;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}

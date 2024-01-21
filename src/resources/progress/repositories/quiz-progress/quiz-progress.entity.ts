import { Quiz } from 'src/resources/quizzes/repositories/quiz/quiz.entity';
import { User } from 'src/resources/users/repositories/user/user.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
@Unique(['user', 'quiz'])
export class QuizProgress {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Quiz, {
    onDelete: 'CASCADE',
  })
  quiz: Quiz;
}

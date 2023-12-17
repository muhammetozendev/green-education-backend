import { Slide } from 'src/resources/slides/repositories/slides.entity';
import { User } from 'src/resources/users/repositories/user/user.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SlideProgress {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.slideProgresses, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Slide, {
    onDelete: 'CASCADE',
  })
  slide: Slide;
}

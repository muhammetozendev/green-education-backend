import { Submodule } from 'src/resources/modules/repositories/submodule/submodule.entity';
import { User } from 'src/resources/users/repositories/user/user.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SubmoduleProgress {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.submoduleProgresses, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Submodule, {
    onDelete: 'CASCADE',
  })
  submodule: Submodule;
}

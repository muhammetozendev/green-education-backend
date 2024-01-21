import { RoleEnum } from 'src/resources/auth/enums/role.enum';
import { Session } from 'src/resources/auth/repositories/session/session.entity';
import { Organization } from 'src/resources/organizations/repositories/organization/organization.entity';
import { ModuleProgress } from 'src/resources/progress/repositories/module-progress/module-progress.entity';
import { SlideProgress } from 'src/resources/progress/repositories/slide-progress/slide-progress.entity';
import { SubmoduleProgress } from 'src/resources/progress/repositories/submodule-progress/submodule-progress.entity';
import { Attempt } from 'src/resources/quizzes/repositories/attempt/attempt.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  lastName: string;

  @Column({ length: 60 })
  password: string;

  @Column({ type: 'enum', enum: RoleEnum })
  role: RoleEnum;

  @OneToMany(() => Session, (session) => session.user)
  sessions: Session[];

  @ManyToOne(() => Organization, (org) => org.users, {
    onDelete: 'CASCADE',
  })
  organization: Organization;

  @OneToMany(() => SubmoduleProgress, (progress) => progress.user)
  submoduleProgresses: SubmoduleProgress[];

  @OneToMany(() => SlideProgress, (slide) => slide.user)
  slideProgresses: SlideProgress[];

  @OneToMany(() => ModuleProgress, (module) => module.user)
  moduleProgresses: ModuleProgress[];

  @OneToMany(() => Attempt, (attempt) => attempt.user)
  attempts: Attempt[];
}

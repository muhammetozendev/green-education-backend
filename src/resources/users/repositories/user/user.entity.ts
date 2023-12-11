import { RoleEnum } from 'src/resources/auth/enums/role.enum';
import { Session } from 'src/resources/auth/repositories/session/session.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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
}

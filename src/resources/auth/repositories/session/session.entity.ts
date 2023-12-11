import { User } from 'src/resources/users/repositories/user/user.entity';
import { Column, Entity, Index, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class Session {
  @PrimaryColumn()
  id: string;

  @Column({ type: 'timestamptz' })
  issuedAt: Date;

  @Column()
  isValid: boolean;

  @Column({ length: 1000 })
  @Index()
  refreshToken: string;

  @ManyToOne(() => User, (user) => user.sessions, {
    onDelete: 'CASCADE',
  })
  user: User;
}

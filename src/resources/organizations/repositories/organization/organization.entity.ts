import { Module } from 'src/resources/modules/repositories/module/module.entity';
import { User } from 'src/resources/users/repositories/user/user.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Organization {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => User, (user) => user.organization)
  users: User[];

  @OneToMany(() => Module, (module) => module.organization)
  modules: Module[];
}

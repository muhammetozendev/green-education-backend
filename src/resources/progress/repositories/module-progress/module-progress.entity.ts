import { Module } from 'src/resources/modules/repositories/module/module.entity';
import { User } from 'src/resources/users/repositories/user/user.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ModuleProgress {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.moduleProgresses, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Module, {
    onDelete: 'CASCADE',
  })
  module: Module;
}

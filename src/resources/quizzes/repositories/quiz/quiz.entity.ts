import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Question } from '../question/question.entity';
import { Submodule } from 'src/resources/modules/repositories/submodule/submodule.entity';
import { Attempt } from '../attempt/attempt.entity';
import { Module } from 'src/resources/modules/repositories/module/module.entity';

@Entity()
export class Quiz {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @OneToOne(() => Submodule, (submodule) => submodule.quiz, {
    onDelete: 'CASCADE',
  })
  submodule: Submodule;

  @OneToMany(() => Question, (question) => question.quiz, {
    onDelete: 'SET NULL',
    cascade: true,
  })
  questions: Question[];

  @OneToMany(() => Attempt, (attempt) => attempt.quiz)
  attempts: Attempt[];

  @OneToOne(() => Module, (attempt) => attempt.quiz)
  module: Module;
}

import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Module } from '../module/module.entity';
import { Slide } from 'src/resources/slides/repositories/slide.entity';
import { Quiz } from 'src/resources/quizzes/repositories/quiz/quiz.entity';

@Entity()
export class Submodule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  number: number;

  @Column()
  title: string;

  @ManyToOne(() => Module, (module) => module.submodules, {
    onDelete: 'CASCADE',
  })
  module: Module;

  @OneToMany(() => Slide, (slide) => slide.submodule)
  slides: Slide[];

  @OneToOne(() => Quiz, (quiz) => quiz.submodule, {
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  quiz: Quiz;
}

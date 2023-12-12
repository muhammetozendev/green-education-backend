import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Module } from '../module/module.entity';

@Entity()
export class Submodule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @ManyToOne(() => Module, (module) => module.submodules, {
    onDelete: 'CASCADE',
  })
  module: Module;

  // quiz

  // slides
}

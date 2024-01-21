import { Submodule } from 'src/resources/modules/repositories/submodule/submodule.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Slide {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', array: true })
  content: string[];

  @Column({ type: 'text' })
  imageUrl: string;

  @ManyToOne(() => Submodule, (submodule) => submodule.slides, {
    onDelete: 'CASCADE',
  })
  submodule: Submodule;
}

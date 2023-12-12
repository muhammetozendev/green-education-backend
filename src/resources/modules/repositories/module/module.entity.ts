import { Organization } from 'src/resources/organizations/repositories/organization/organization.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Submodule } from '../submodule/submodule.entity';

@Entity()
export class Module {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  number: number;

  @ManyToOne(() => Organization, (org) => org.modules, {
    onDelete: 'CASCADE',
  })
  organization: Organization;

  @OneToMany(() => Submodule, (submodule) => submodule.module)
  submodules: Submodule[];
}

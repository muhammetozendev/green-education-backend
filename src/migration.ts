import { DataSource } from 'typeorm';
import { User } from './resources/users/repositories/user/user.entity';
import { Session } from './resources/auth/repositories/session/session.entity';
import { Organization } from './resources/organizations/repositories/organization/organization.entity';
import { Module } from './resources/modules/repositories/module/module.entity';
import { Submodule } from './resources/modules/repositories/submodule/submodule.entity';

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [User, Session, Organization, Module, Submodule],
  migrations: ['dist/config/db/migrations/*.js'],
  migrationsRun: true,
});

import { Global, Module, Provider } from '@nestjs/common';
import { ConfigType, ConfigModule as NestConfigModule } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import dbConfig from './env/db-config';
import * as Joi from 'joi';
import { AsyncLocalStorage } from 'async_hooks';
import { User } from 'src/resources/users/repositories/user/user.entity';
import { Session } from 'src/resources/auth/repositories/session/session.entity';
import { Organization } from 'src/resources/organizations/repositories/organization/organization.entity';
import { TransactionalService } from './db/transactional-service';
import { Module as ModuleEntity } from 'src/resources/modules/repositories/module/module.entity';
import { Submodule } from 'src/resources/modules/repositories/submodule/submodule.entity';
import { Quiz } from 'src/resources/quizzes/repositories/quiz/quiz.entity';
import { Question } from 'src/resources/quizzes/repositories/question/question.entity';
import { Option } from 'src/resources/quizzes/repositories/option/option.entity';
import { Answer } from 'src/resources/quizzes/repositories/answer/answer.entity';
import { Slide } from 'src/resources/slides/repositories/slides.entity';

const alsProvider: Provider = {
  provide: AsyncLocalStorage,
  useValue: new AsyncLocalStorage(),
};

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      validationSchema: Joi.object({
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USER: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),

        JWT_SECRET: Joi.string().required(),
        JWT_ACCESS_TOKEN_EXPIRY: Joi.number().optional(),
        JWT_REFRESH_TOKEN_EXPIRY: Joi.number().optional(),
      }).unknown(),
      envFilePath:
        process.env.NODE_ENV?.toLowerCase() === 'test' ? '.env.test' : '.env',
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (dbConfiguration: ConfigType<typeof dbConfig>) => {
        const config = {
          type: 'postgres',
          host: dbConfiguration.dbHost,
          port: dbConfiguration.dbPort,
          username: dbConfiguration.dbUser,
          password: dbConfiguration.dbPassword,
          database: dbConfiguration.dbName,
          entities: [
            User,
            Session,
            Organization,
            ModuleEntity,
            Submodule,
            Slide,
            Quiz,
            Question,
            Option,
            Answer,
          ],
        } as TypeOrmModuleOptions;

        if (process.env.NODE_ENV?.toLowerCase() === 'development') {
          Object.assign(config, {
            migrations: ['dist/config/db/migrations/*.js'],
            migrationsRun: true,
            logging: true,
          });
        }

        if (process.env.NODE_ENV?.toLowerCase() === 'production') {
          Object.assign(config, {
            migrations: ['dist/config/db/migrations/*.js'],
            migrationsRun: true,
          });
        }

        if (process.env.NODE_ENV?.toLowerCase() === 'test') {
          Object.assign(config, {
            synchronize: true,
          });
        }

        return config;
      },
      inject: [dbConfig.KEY],
      imports: [NestConfigModule.forFeature(dbConfig)],
    }),
  ],
  providers: [alsProvider, TransactionalService],
  exports: [alsProvider, TransactionalService],
})
export class AppConfigModule {}

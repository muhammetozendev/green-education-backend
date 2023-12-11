import { Global, Module, Provider } from '@nestjs/common';
import { ConfigType, ConfigModule as NestConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import dbConfig from './env/db-config';
import * as Joi from 'joi';
import { AsyncLocalStorage } from 'async_hooks';
import { User } from 'src/resources/users/repositories/user/user.entity';
import { Session } from 'src/resources/auth/repositories/session/session.entity';

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
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (dbConfiguration: ConfigType<typeof dbConfig>) => ({
        type: 'postgres',
        host: dbConfiguration.dbHost,
        port: dbConfiguration.dbPort,
        username: dbConfiguration.dbUser,
        password: dbConfiguration.dbPassword,
        database: dbConfiguration.dbName,
        entities: [User, Session],
        synchronize: true,
        logging: true,
      }),
      inject: [dbConfig.KEY],
      imports: [NestConfigModule.forFeature(dbConfig)],
    }),
  ],
  providers: [alsProvider],
  exports: [alsProvider],
})
export class AppConfigModule {}

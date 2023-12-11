import { Module } from '@nestjs/common';
import { AuthModule } from './resources/auth/auth.module';
import { UsersModule } from './resources/users/users.module';
import { ModulesModule } from './resources/modules/modules.module';
import { QuizzesModule } from './resources/quizzes/quizzes.module';
import { SlidesModule } from './resources/slides/slides.module';
import { AppConfigModule } from './config/config.module';
import { CommonModule } from './common/common.module';
import { OrganizationsModule } from './resources/organizations/organizations.module';

@Module({
  imports: [
    AppConfigModule,
    AuthModule,
    UsersModule,
    ModulesModule,
    QuizzesModule,
    SlidesModule,
    CommonModule,
    OrganizationsModule,
  ],
  providers: [],
})
export class AppModule {}

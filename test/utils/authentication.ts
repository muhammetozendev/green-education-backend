import { UserRepository } from 'src/resources/users/repositories/user/user.repository';
import * as bcrypt from 'bcrypt';
import { RoleEnum } from 'src/resources/auth/enums/role.enum';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

export async function authenticate(
  userRepository: UserRepository,
  app: INestApplication,
) {
  await userRepository.upsert(
    {
      email: 'john@gmail.com',
      name: 'John',
      lastName: 'Doe',
      password: await bcrypt.hash('password', 12),
      role: RoleEnum.ADMIN,
    },
    ['email'],
  );

  const res = await request(app.getHttpServer()).post('/auth/login').send({
    email: 'john@gmail.com',
    password: 'password',
  });

  return res.body.accessToken;
}

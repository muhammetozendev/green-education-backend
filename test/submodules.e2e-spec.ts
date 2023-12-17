import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { UserRepository } from 'src/resources/users/repositories/user/user.repository';
import { authenticate } from './utils/authentication';
import * as request from 'supertest';
import { ModuleRepository } from 'src/resources/modules/repositories/module/module.repository';
import { Module } from 'src/resources/modules/repositories/module/module.entity';
import { Submodule } from 'src/resources/modules/repositories/submodule/submodule.entity';
import { SubmoduleRepository } from 'src/resources/modules/repositories/submodule/submodule.repository';
import { QuizRepository } from 'src/resources/quizzes/repositories/quiz/quiz.repository';
import { AppModule } from 'src/app.module';

describe('Submodules E2E Tests', () => {
  let app: INestApplication;

  let module: Module;
  let accessToken: string;

  let userRepository: UserRepository;
  let moduleRepository: ModuleRepository;
  let submoduleRepository: SubmoduleRepository;
  let quizRepository: QuizRepository;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    userRepository = app.get(UserRepository);
    moduleRepository = app.get(ModuleRepository);
    submoduleRepository = app.get(SubmoduleRepository);
    quizRepository = app.get(QuizRepository);

    accessToken = await authenticate(userRepository, app);
    module = await moduleRepository.save({
      number: 1,
      title: 'Test module',
    });
  });

  it('should be able to create and retrieve a submodule with all relations', async () => {
    const res = await request(app.getHttpServer())
      .post('/submodules')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        number: 1,
        title: 'Submodule 1',
        moduleId: module.id,
      })
      .expect(201)
      .expect(({ body }) => {
        expect(typeof body.id).toBe('number');
      });

    await request(app.getHttpServer())
      .get('/submodules/' + res.body.id)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .expect(({ body }) => {
        const newBody = body as Submodule;
        expect(typeof newBody.id).toBe('number');
        expect(typeof newBody.title).toBe('string');
        if (newBody.quiz) {
          expect(typeof newBody.quiz).toBe('object');
        }
        expect(newBody.slides instanceof Array).toBe(true);
      });

    await submoduleRepository.delete(res.body.id);
  });

  it('should be able to create multiple submodules', async () => {
    await request(app.getHttpServer())
      .post('/submodules')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        number: 1,
        title: 'Submodule 2',
        moduleId: module.id,
      })
      .expect(201)
      .expect(({ body }) => {
        expect(typeof body.id).toBe('number');
      });

    await request(app.getHttpServer())
      .post('/submodules')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        number: 2,
        title: 'Submodule 3',
        moduleId: module.id,
      })
      .expect(201)
      .expect(({ body }) => {
        expect(typeof body.id).toBe('number');
      });

    await request(app.getHttpServer())
      .post('/submodules')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        number: 1,
        title: 'Submodule 1',
        moduleId: module.id,
      })
      .expect(201)
      .expect(({ body }) => {
        expect(typeof body.id).toBe('number');
      });

    const submodules = await submoduleRepository.find({
      where: { module: { id: module.id } },
      order: { number: 'ASC' },
    });

    expect(submodules.length).toBe(3);
    expect(submodules[0].number).toBe(1);
    expect(submodules[0].title).toBe('Submodule 1');

    expect(submodules[1].number).toBe(2);
    expect(submodules[1].title).toBe('Submodule 2');

    expect(submodules[2].number).toBe(3);
    expect(submodules[2].title).toBe('Submodule 3');

    await submoduleRepository.delete(submodules.map((e) => e.id));
  });

  it('should be able to delete a module', async () => {
    await request(app.getHttpServer())
      .post('/submodules')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        number: 1,
        title: 'Submodule 1',
        moduleId: module.id,
      })
      .expect(201)
      .expect(({ body }) => {
        expect(typeof body.id).toBe('number');
      });

    const res = await request(app.getHttpServer())
      .post('/submodules')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        number: 2,
        title: 'Submodule 2',
        moduleId: module.id,
      })
      .expect(201)
      .expect(({ body }) => {
        expect(typeof body.id).toBe('number');
      });

    await request(app.getHttpServer())
      .post('/submodules')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        number: 3,
        title: 'Submodule 3',
        moduleId: module.id,
      })
      .expect(201)
      .expect(({ body }) => {
        expect(typeof body.id).toBe('number');
      });

    await request(app.getHttpServer())
      .delete('/submodules/' + res.body.id)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(204);

    const submodules = await submoduleRepository.find({
      where: { module: { id: module.id } },
      order: { number: 'ASC' },
    });

    expect(submodules.length).toBe(2);

    expect(submodules[0].number).toBe(1);
    expect(submodules[0].title).toBe('Submodule 1');

    expect(submodules[1].number).toBe(2);
    expect(submodules[1].title).toBe('Submodule 3');

    await submoduleRepository.delete(submodules.map((e) => e.id));
  });

  it('should be able to update title and quiz id of a submodule', async () => {
    const quiz = await quizRepository.save({
      title: 'Test quiz',
    });

    const res = await request(app.getHttpServer())
      .post('/submodules')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Submodule 1',
        number: 1,
        moduleId: module.id,
      })
      .expect(201)
      .expect(({ body }) => {
        expect(typeof body.id).toBe('number');
      });

    await request(app.getHttpServer())
      .patch('/submodules/' + res.body.id)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Submodule 2',
        quizId: quiz.id,
      })
      .expect(204);

    const submodule = await submoduleRepository.findOne({
      where: { id: res.body.id },
      relations: { quiz: true },
    });

    expect(submodule.title).toBe('Submodule 2');
    expect(submodule.quiz.id).toBe(quiz.id);

    await quizRepository.delete(quiz.id);
    await submoduleRepository.delete(submodule.id);
  });

  afterAll(async () => {
    await moduleRepository.delete(module.id);
    await app.close();
  });
});

import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { OrganizationRepository } from 'src/resources/organizations/repositories/organization/organization.repository';
import { ModuleRepository } from 'src/resources/modules/repositories/module/module.repository';
import { INestApplication } from '@nestjs/common';
import { UserRepository } from 'src/resources/users/repositories/user/user.repository';
import { authenticate } from './utils/authentication';
import * as bcrypt from 'bcrypt';
import { RoleEnum } from 'src/resources/auth/enums/role.enum';
import { ModuleProgressRepository } from 'src/resources/progress/repositories/module-progress/module-progress.repository';
import { randomBytes } from 'crypto';
import { AppModule } from 'src/app.module';

describe('Modules E2E Tests', () => {
  let app: INestApplication;

  let organizationRepository: OrganizationRepository;
  let moduleRepository: ModuleRepository;
  let userRepository: UserRepository;
  let moduleProgressRepository: ModuleProgressRepository;

  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    organizationRepository = app.get(OrganizationRepository);
    moduleRepository = app.get(ModuleRepository);
    userRepository = app.get(UserRepository);
    moduleProgressRepository = app.get(ModuleProgressRepository);

    accessToken = await authenticate(userRepository, app);
  });

  it('should be able to create a module', async () => {
    const organization = await organizationRepository.save({
      name: 'Test organization',
    });

    await request(app.getHttpServer())
      .post('/modules')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        number: 1,
        title: 'Module 1',
        organizationId: organization.id,
      })
      .expect(201)
      .expect(({ body }) => {
        expect(typeof body.id).toBe('number');
      });

    await organizationRepository.delete(organization.id);
  });

  it('should be able to create multiple modules', async () => {
    const organization = await organizationRepository.save({
      name: 'Test organization',
    });

    await request(app.getHttpServer())
      .post('/modules')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        number: 1,
        title: 'Module 2',
        organizationId: organization.id,
      })
      .expect(201)
      .expect(({ body }) => {
        expect(typeof body.id).toBe('number');
      });

    await request(app.getHttpServer())
      .post('/modules')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        number: 1,
        title: 'Module 1',
        organizationId: organization.id,
      })
      .expect(201)
      .expect(({ body }) => {
        expect(typeof body.id).toBe('number');
      });

    await request(app.getHttpServer())
      .post('/modules')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        number: 3,
        title: 'Module 3',
        organizationId: organization.id,
      })
      .expect(201)
      .expect(({ body }) => {
        expect(typeof body.id).toBe('number');
      });

    await request(app.getHttpServer())
      .get(`/organizations/${organization.id}/modules`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body[0]).toMatchObject({
          number: 1,
          title: 'Module 1',
        });

        expect(body[1]).toMatchObject({
          number: 2,
          title: 'Module 2',
        });

        expect(body[2]).toMatchObject({
          number: 3,
          title: 'Module 3',
        });
      });

    await organizationRepository.delete(organization.id);
  });

  it('should be able to delete a module without inconsistencies', async () => {
    const organization = await organizationRepository.save({
      name: 'Test organization',
    });

    const modules = await moduleRepository.save([
      {
        number: 1,
        title: 'Module 1',
        organization: { id: organization.id },
      },
      {
        number: 2,
        title: 'Module 2',
        organization: { id: organization.id },
      },
      {
        number: 3,
        title: 'Module 3',
        organization: { id: organization.id },
      },
    ]);

    await request(app.getHttpServer())
      .delete(`/modules/${modules[0].id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(204);

    await request(app.getHttpServer())
      .get(`/organizations/${organization.id}/modules`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body[0]).toMatchObject({
          number: 1,
          title: 'Module 2',
        });

        expect(body[1]).toMatchObject({
          number: 2,
          title: 'Module 3',
        });
      });

    await organizationRepository.delete(organization.id);
  });

  it('should be able to update a module', async () => {
    const organization = await organizationRepository.save({
      name: 'Test organization',
    });

    const res = await request(app.getHttpServer())
      .post('/modules')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        number: 1,
        title: 'Module 1',
        organizationId: organization.id,
      })
      .expect(201)
      .expect(({ body }) => {
        expect(typeof body.id).toBe('number');
      });

    await request(app.getHttpServer())
      .patch('/modules/' + res.body.id)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Module 2',
      })
      .expect(204);

    const module = await moduleRepository.findOneBy({ id: res.body.id });
    expect(module.title).toBe('Module 2');

    await organizationRepository.delete(organization.id);
  });

  it('should be able to retrieve the modules with progress information', async () => {
    const org = await organizationRepository.save({
      name: 'Test organization',
    });

    const email = randomBytes(10).toString('hex');
    const user = await userRepository.save({
      email: email + '@gmail.com',
      name: 'test',
      lastName: 'test',
      password: await bcrypt.hash('password', 12),
      role: RoleEnum.USER,
      organization: { id: org.id },
    });

    const authRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: email + '@gmail.com',
        password: 'password',
      });
    const token = authRes.body.accessToken;

    const modules = await moduleRepository.save([
      {
        number: 1,
        title: 'Module 1',
        organization: { id: org.id },
      },
      {
        number: 2,
        title: 'Module 2',
        organization: { id: org.id },
      },
    ]);

    await moduleProgressRepository.save({
      module: { id: modules[0].id },
      user: { id: user.id },
    });

    await request(app.getHttpServer())
      .get(`/modules`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body[0]).toMatchObject({
          number: 1,
          title: 'Module 1',
          completed: true,
        });

        expect(body[1]).toMatchObject({
          number: 2,
          title: 'Module 2',
          completed: false,
        });
      });

    await organizationRepository.delete(org.id);
  });

  afterAll(async () => {
    await app.close();
  });
});

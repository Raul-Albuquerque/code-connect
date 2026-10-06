import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from './../src/app.module.js';
import { configureApp } from './../src/app.setup.js';

describe('Users and sessions (e2e)', () => {
  let app: INestApplication<App>;
  const user = {
    name: 'Maria Silva',
    email: 'maria@example.com',
    password: 'senha-segura-123',
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    configureApp(app);
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  const register = () => request(app.getHttpServer()).post('/users').send(user);
  const login = (body: object) =>
    request(app.getHttpServer()).post('/sessions').send(body);

  describe('POST /users', () => {
    it('creates a user, returns Location and hides the password', async () => {
      const res = await register().expect(201);
      expect(res.headers.location).toBe(`/users/${res.body.id}`);
      expect(res.body).toMatchObject({ name: user.name, email: user.email });
      expect(res.body).not.toHaveProperty('password');
      expect(res.body).not.toHaveProperty('passwordHash');
    });

    it('returns 409 for a duplicated email', async () => {
      await register().expect(201);
      await register().expect(409);
    });

    it('returns 400 for invalid input', async () => {
      await request(app.getHttpServer())
        .post('/users')
        .send({ name: '', email: 'nope', password: '123' })
        .expect(400);
    });
  });

  describe('POST /sessions', () => {
    it('returns a token for valid credentials', async () => {
      await register();
      const res = await login({
        email: user.email,
        password: user.password,
      }).expect(201);
      expect(typeof res.body.accessToken).toBe('string');
    });

    it('returns 401 for wrong credentials', async () => {
      await register();
      await login({ email: user.email, password: 'wrong' }).expect(401);
    });

    it('returns 400 for invalid input', async () => {
      await login({ email: 'nope' }).expect(400);
    });
  });

  describe('GET /users/me', () => {
    it('returns the authenticated user', async () => {
      await register();
      const { body } = await login({
        email: user.email,
        password: user.password,
      });
      const res = await request(app.getHttpServer())
        .get('/users/me')
        .set('Authorization', `Bearer ${body.accessToken}`)
        .expect(200);
      expect(res.body).toMatchObject({ name: user.name, email: user.email });
      expect(res.body).not.toHaveProperty('passwordHash');
    });

    it('returns 401 without a token or with an invalid one', async () => {
      await request(app.getHttpServer()).get('/users/me').expect(401);
      await request(app.getHttpServer())
        .get('/users/me')
        .set('Authorization', 'Bearer invalid')
        .expect(401);
    });
  });
});

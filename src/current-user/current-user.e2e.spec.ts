import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AuthService } from '../auth/auth.service';
import { mainConfig } from '../main.config';
import { User } from '../users/entities/user.entity';
import { JwtDto } from '../auth/dto/jwt.dto';

const USER_USERNAME = 'current_user';
const USER_PASSWORD = 'password';

describe('CurrentUserController (e2e)', () => {
  let app: INestApplication;
  let authService: AuthService;
  let user: User;
  let token: JwtDto;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    authService = module.get<AuthService>(AuthService);

    user = await authService.signUp({
      username: USER_USERNAME,
      password: USER_PASSWORD,
    });

    token = authService.signIn(user);

    mainConfig(app);

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /current_user', () => {
    describe('with valid credentials', () => {
      it('should return a 200 response with the user', () => {
        return request(app.getHttpServer())
          .get('/current_user')
          .set('Authorization', `Bearer ${token.accessToken}`)
          .then(({ statusCode }) => {
            expect(statusCode).toBe(200);
          });
      });
    });

    describe('with invalid credentials', () => {
      it('returns a 401 response with an error', () => {
        return request(app.getHttpServer())
          .get('/current_user')
          .then(({ statusCode }) => {
            expect(statusCode).toBe(401);
          });
      });
    });
  });

  describe('PATCH /current_user', () => {
    describe('with valid credentials', () => {
      it('should return a 200 response', () => {
        return request(app.getHttpServer())
          .patch('/current_user')
          .set('Authorization', `Bearer ${token.accessToken}`)
          .then(({ statusCode }) => {
            expect(statusCode).toBe(200);
          });
      });

      it('should return a 422 response with error when username already exist', async () => {
        await authService.signUp({
          username: USER_USERNAME + '1',
          password: USER_PASSWORD,
        });

        return request(app.getHttpServer())
          .patch('/current_user')
          .send({ username: USER_USERNAME + '1' })
          .set('Authorization', `Bearer ${token.accessToken}`)
          .then(({ statusCode }) => {
            expect(statusCode).toBe(422);
          });
      });
    });

    describe('with invalid credentials', () => {
      it('returns a 401 response with an error', () => {
        return request(app.getHttpServer())
          .patch('/current_user')
          .then(({ statusCode }) => {
            expect(statusCode).toBe(401);
          });
      });
    });
  });
});

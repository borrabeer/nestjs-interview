import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { mainConfig } from '../main.config';
import { JwtDto } from '../auth/dto/jwt.dto';
import { AuthService } from '../auth/auth.service';

const USER_USERNAME = 'username';
const USER_PASSWORD = 'password';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let user: User;
  let token: JwtDto;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    const usersService = module.get<UsersService>(UsersService);
    const authService = module.get<AuthService>(AuthService);

    user = await usersService.create({
      username: USER_USERNAME,
      encryptedPassword: USER_PASSWORD,
    });

    token = authService.signIn(user);

    mainConfig(app);

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /users', () => {
    describe('with valid credentials', () => {
      it('returns a 200 response with an array of users', () => {
        return request(app.getHttpServer())
          .get('/users')
          .set('Authorization', `Bearer ${token.accessToken}`)
          .then(({ statusCode }) => {
            expect(statusCode).toBe(200);
          });
      });
    });

    describe('with invalid credentials', () => {
      it('returns a 401 response with an error', () => {
        return request(app.getHttpServer())
          .get('/users')
          .then(({ statusCode }) => {
            expect(statusCode).toBe(401);
          });
      });
    });
  });

  describe('GET /users/{id}', () => {
    describe('with valid credentials', () => {
      describe('when user with id exists', () => {
        it('returns a 200 response with a user', () => {
          return request(app.getHttpServer())
            .get(`/users/${user.id}`)
            .set('Authorization', `Bearer ${token.accessToken}`)
            .then(({ statusCode }) => {
              expect(statusCode).toBe(200);
            });
        });
      });

      describe('when user with id does not exist', () => {
        it('returns a 404 response', () => {
          return request(app.getHttpServer())
            .get(`/users/1234`)
            .set('Authorization', `Bearer ${token.accessToken}`)
            .then(({ statusCode }) => {
              expect(statusCode).toBe(404);
            });
        });
      });
    });

    describe('with invalid credentials', () => {
      describe('when user with id exists', () => {
        it('returns a 401 response with an error', () => {
          return request(app.getHttpServer())
            .get(`/users/${user.id}`)
            .then(({ statusCode }) => {
              expect(statusCode).toBe(401);
            });
        });
      });

      describe('when user with id does not exist', () => {
        it('returns a 401 response with an error', () => {
          return request(app.getHttpServer())
            .get(`/users/1234`)
            .then(({ statusCode }) => {
              expect(statusCode).toBe(401);
            });
        });
      });
    });
  });
});

import { INestApplication } from '@nestjs/common';
import { Category } from './entities/category.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { CategoriesService } from './category.service';
import { mainConfig } from '../main.config';
import * as request from 'supertest';
import { JwtDto } from '../auth/dto/jwt.dto';
import { AuthService } from '../auth/auth.service';

describe('CategoriesController (e2e)', () => {
  let app: INestApplication;
  let category: Category;
  let token: JwtDto;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();

    const categoryService = module.get<CategoriesService>(CategoriesService);

    const authService = module.get<AuthService>(AuthService);

    const user = await authService.signUp({
      username: 'categories',
      password: 'password',
    });

    token = authService.signIn(user);

    category = await categoryService.create({
      name: 'Test Category',
    });

    mainConfig(app);

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /categories', () => {
    describe('with valid credentials', () => {
      it('returns a 200 response with an array of categories', () => {
        return request(app.getHttpServer())
          .get('/categories')
          .set('Authorization', `Bearer ${token.accessToken}`)
          .then(({ statusCode }) => {
            expect(statusCode).toBe(200);
          });
      });
    });

    describe('with invalid credentials', () => {
      it('returns a 401 response with an error', () => {
        return request(app.getHttpServer())
          .get('/categories')
          .then(({ statusCode }) => {
            expect(statusCode).toBe(401);
          });
      });
    });
  });

  describe('GET /categories/{id}', () => {
    describe('with valid credentails', () => {
      describe('when category with id exists', () => {
        it('returns a 200 response with a category', () => {
          return request(app.getHttpServer())
            .get(`/categories/${category.id}`)
            .set('Authorization', `Bearer ${token.accessToken}`)
            .then(({ statusCode }) => {
              expect(statusCode).toBe(200);
            });
        });
      });

      describe('when category with id does not exist', () => {
        it('returns a 404 response with an error', () => {
          return request(app.getHttpServer())
            .get(`/categories/1234`)
            .set('Authorization', `Bearer ${token.accessToken}`)
            .then(({ statusCode }) => {
              expect(statusCode).toBe(404);
            });
        });
      });
    });

    describe('with invalid credentails', () => {
      describe('when category with id exists', () => {
        it('returns a 401 response with an error', () => {
          return request(app.getHttpServer())
            .get(`/categories/${category.id}`)
            .then(({ statusCode }) => {
              expect(statusCode).toBe(401);
            });
        });
      });

      describe('when category with id does not exist', () => {
        it('returns a 401 response with an error', () => {
          return request(app.getHttpServer())
            .get(`/categories/1234`)
            .then(({ statusCode }) => {
              expect(statusCode).toBe(401);
            });
        });
      });
    });
  });
});

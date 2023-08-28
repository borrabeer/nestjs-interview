import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { mainConfig } from '../main.config';
import { Product } from './entities/product.entity';
import { ProductsService } from './products.service';
import { AuthService } from '../auth/auth.service';
import { JwtDto } from '../auth/dto/jwt.dto';

describe('ProductsController (e2e)', () => {
  let app: INestApplication;
  let product: Product;
  let token: JwtDto;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();

    const productService = module.get<ProductsService>(ProductsService);

    const authService = module.get<AuthService>(AuthService);

    const user = await authService.signUp({
      username: 'products',
      password: 'password',
    });

    token = authService.signIn(user);

    product = await productService.create({
      name: 'Test Product',
      description: 'Description for Test Product.',
      priceSubunit: 1_000,
      priceCurrency: 'GBP',
    });

    mainConfig(app);

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /products', () => {
    describe('with valid credentials', () => {
      it('returns a 200 response with an array of products', () => {
        return request(app.getHttpServer())
          .get('/products')
          .set('Authorization', `Bearer ${token.accessToken}`)
          .then(({ statusCode }) => {
            expect(statusCode).toBe(200);
          });
      });

      describe('with filter queries', () => {
        it('returns a 200 response with an array of products filtered by name', () => {
          return request(app.getHttpServer())
            .get('/products')
            .set('Authorization', `Bearer ${token.accessToken}`)
            .query({ name: 'T' })
            .then(({ statusCode, body }) => {
              expect(body.length).toBe(1);
              expect(statusCode).toBe(200);
            });
        });

        describe('with price_subunit[gte] query', () => {
          it('returns a 200 response with an array of products with valid filter query', () => {
            return request(app.getHttpServer())
              .get('/products')
              .set('Authorization', `Bearer ${token.accessToken}`)
              .query({ 'price_subunit[gte]': 0 })
              .then(({ statusCode, body }) => {
                expect(body.length).toBe(1);
                expect(statusCode).toBe(200);
              });
          });

          it('returns a 200 response with an array of products with invalid filter query', () => {
            return request(app.getHttpServer())
              .get('/products')
              .set('Authorization', `Bearer ${token.accessToken}`)
              .query({ 'price_subunit[gte]': 1001 })
              .then(({ statusCode, body }) => {
                expect(body.length).toBe(0);
                expect(statusCode).toBe(200);
              });
          });
        });

        describe('with price_subunit[lte] query', () => {
          it('returns a 200 response with an array of products with valid filter query', () => {
            return request(app.getHttpServer())
              .get('/products')
              .set('Authorization', `Bearer ${token.accessToken}`)
              .query({ 'price_subunit[lte]': 1000 })
              .then(({ statusCode, body }) => {
                expect(body.length).toBe(1);
                expect(statusCode).toBe(200);
              });
          });

          it('returns a 200 response with an array of products with invalid filter query', () => {
            return request(app.getHttpServer())
              .get('/products')
              .set('Authorization', `Bearer ${token.accessToken}`)
              .query({ 'price_subunit[lte]': 0 })
              .then(({ statusCode, body }) => {
                expect(body.length).toBe(0);
                expect(statusCode).toBe(200);
              });
          });
        });
      });
    });

    describe('with invalid credentials', () => {
      it('returns a 401 response with an error', () => {
        return request(app.getHttpServer())
          .get('/products')
          .then(({ statusCode }) => {
            expect(statusCode).toBe(401);
          });
      });
    });
  });

  describe('GET /products/{id}', () => {
    describe('with valid credentials', () => {
      describe('when product with id exists', () => {
        it('returns a 200 response with a product', () => {
          return request(app.getHttpServer())
            .get(`/products/${product.id}`)
            .set('Authorization', `Bearer ${token.accessToken}`)
            .then(({ statusCode }) => {
              expect(statusCode).toBe(200);
            });
        });
      });

      describe('when product with id does not exist', () => {
        it('returns a 404 response', () => {
          return request(app.getHttpServer())
            .get(`/products/1234`)
            .set('Authorization', `Bearer ${token.accessToken}`)
            .then(({ statusCode }) => {
              expect(statusCode).toBe(404);
            });
        });
      });
    });

    describe('with invalid credentials', () => {
      it('returns a 401 response with an error', () => {
        return request(app.getHttpServer())
          .get(`/products/1234`)
          .then(({ statusCode }) => {
            expect(statusCode).toBe(401);
          });
      });
    });
  });
});

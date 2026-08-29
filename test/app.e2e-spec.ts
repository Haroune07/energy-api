import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, VersioningType } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: '1',
    });
    await app.init();
  });

  it('/api/v1/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/v1/health')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('status', 'ok');
        expect(res.body).toHaveProperty('service', 'energy-api');
        expect(res.body).toHaveProperty('timestamp');
      });
  });

  describe('Buildings Resource (e2e)', () => {
    it('GET /api/v1/buildings should return an empty array by default', () => {
      return request(app.getHttpServer())
        .get('/api/v1/buildings')
        .expect(200)
        .expect([]);
    });

    it('POST /api/v1/buildings should create a building', () => {
      return request(app.getHttpServer())
        .post('/api/v1/buildings')
        .send({
          name: 'Pavillon Principal',
          city: 'Montréal',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', 'bld-001');
          expect(res.body).toHaveProperty('name', 'Pavillon Principal');
          expect(res.body).toHaveProperty('city', 'Montréal');
          expect(res.body).toHaveProperty('createdAt');
        });
    });

    it('GET /api/v1/buildings/:id should return building by ID', async () => {
      // First create a building
      const postRes = await request(app.getHttpServer())
        .post('/api/v1/buildings')
        .send({
          name: 'Pavillon Secondaire',
          city: 'Québec',
        });

      const createdId = postRes.body.id;

      // Then fetch it
      return request(app.getHttpServer())
        .get(`/api/v1/buildings/${createdId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', createdId);
          expect(res.body).toHaveProperty('name', 'Pavillon Secondaire');
          expect(res.body).toHaveProperty('city', 'Québec');
          expect(res.body).toHaveProperty('createdAt');
        });
    });

    it('GET /api/v1/buildings/unknown should return 404', () => {
      return request(app.getHttpServer())
        .get('/api/v1/buildings/bld-999')
        .expect(404);
    });
  });

  afterEach(async () => {
    await app.close();
  });
});

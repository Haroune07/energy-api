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
      const postRes = await request(app.getHttpServer())
        .post('/api/v1/buildings')
        .send({
          name: 'Pavillon Secondaire',
          city: 'Québec',
        });

      const createdId = postRes.body.id;

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

  describe('Rooms Resource (e2e)', () => {
    it('GET /api/v1/buildings/bld-999/rooms should return 404 if building does not exist', () => {
      return request(app.getHttpServer())
        .get('/api/v1/buildings/bld-999/rooms')
        .expect(404);
    });

    it('POST /api/v1/buildings/:buildingId/rooms should create a room for an existing building', async () => {
      // First create a building
      const buildingRes = await request(app.getHttpServer())
        .post('/api/v1/buildings')
        .send({ name: 'Pavillon A', city: 'Montréal' });

      const bldId = buildingRes.body.id;

      // Add a room
      const roomRes = await request(app.getHttpServer())
        .post(`/api/v1/buildings/${bldId}/rooms`)
        .send({
          code: 'A-204',
          floor: 2,
          type: 'laboratoire',
          capacity: 30,
        })
        .expect(201);

      expect(roomRes.body).toHaveProperty('id', 'rom-001');
      expect(roomRes.body).toHaveProperty('buildingId', bldId);
      expect(roomRes.body).toHaveProperty('code', 'A-204');
    });

    it('POST /api/v1/buildings/:buildingId/rooms should return 409 Conflict on duplicate room code', async () => {
      const buildingRes = await request(app.getHttpServer())
        .post('/api/v1/buildings')
        .send({ name: 'Pavillon B', city: 'Laval' });

      const bldId = buildingRes.body.id;

      await request(app.getHttpServer())
        .post(`/api/v1/buildings/${bldId}/rooms`)
        .send({ code: 'B-101', floor: 1, type: 'bureau', capacity: 12 })
        .expect(201);

      // Duplicate code
      await request(app.getHttpServer())
        .post(`/api/v1/buildings/${bldId}/rooms`)
        .send({ code: 'B-101', floor: 1, type: 'bureau', capacity: 12 })
        .expect(409);
    });

    it('GET /api/v1/rooms/:id should return details of a room', async () => {
      const buildingRes = await request(app.getHttpServer())
        .post('/api/v1/buildings')
        .send({ name: 'Pavillon C', city: 'Montréal' });

      const bldId = buildingRes.body.id;

      const roomRes = await request(app.getHttpServer())
        .post(`/api/v1/buildings/${bldId}/rooms`)
        .send({ code: 'C-300', floor: 3, type: 'salle_de_classe', capacity: 40 });

      const roomId = roomRes.body.id;

      return request(app.getHttpServer())
        .get(`/api/v1/rooms/${roomId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', roomId);
          expect(res.body).toHaveProperty('code', 'C-300');
        });
    });

    it('DELETE /api/v1/rooms/:id should delete a room', async () => {
      const buildingRes = await request(app.getHttpServer())
        .post('/api/v1/buildings')
        .send({ name: 'Pavillon D', city: 'Montréal' });

      const bldId = buildingRes.body.id;

      const roomRes = await request(app.getHttpServer())
        .post(`/api/v1/buildings/${bldId}/rooms`)
        .send({ code: 'D-101', floor: 1, type: 'bureau', capacity: 5 });

      const roomId = roomRes.body.id;

      await request(app.getHttpServer())
        .delete(`/api/v1/rooms/${roomId}`)
        .expect(200);

      // Confirm it's gone
      await request(app.getHttpServer())
        .get(`/api/v1/rooms/${roomId}`)
        .expect(404);
    });
  });

  afterEach(async () => {
    await app.close();
  });
});

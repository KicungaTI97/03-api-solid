import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Gyms nearby (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to list nearby gyms', async () => {
    const { token } = await createAndAuthenticateUser(app, true);
    await request(app.server).post('/gyms/create').set('Authorization', `Bearer ${token}`).send({
      title: 'Academia de Proxima',
      description: null,
      phone: null,
      latitude: -12.3909713,
      longitude: 13.640247,
    });

    await request(app.server).post('/gyms/create').set('Authorization', `Bearer ${token}`).send({
      title: 'Academia de Distante',
      description: null,
      phone: null,
      latitude: -12.2476445,
      longitude: 13.7105669,
    });

    const response = await request(app.server).get('/gyms/nearby').set('Authorization', `Bearer ${token}`).query({
      latitude: -12.3909713,
      longitude: 13.640247,
    });

    expect(response.statusCode).toEqual(200);
    expect(response.body.gyms).toHaveLength(1);
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'Academia de Proxima',
      }),
    ]);
  });
});

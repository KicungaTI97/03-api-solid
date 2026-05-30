import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Gyms search (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to search gyms by title', async () => {
    const { token } = await createAndAuthenticateUser(app, true);

    await request(app.server).post('/gyms/create').set('Authorization', `Bearer ${token}`).send({
      title: 'Javascript Gym',
      description: 'Gym description',
      phone: '123456789',
      latitude: -27.0,
      longitude: -49.0,
    });

    await request(app.server).post('/gyms/create').set('Authorization', `Bearer ${token}`).send({
      title: 'Typescript Gym',
      description: 'Gym description',
      phone: '123456789',
      latitude: -27.0,
      longitude: -49.0,
    });

    const gymResponse = await request(app.server)
      .get('/gyms/search')
      .query({
        query: 'Javascript',
        page: 1,
      })
      .set('Authorization', `Bearer ${token}`);

    console.log('Response body', gymResponse.body);
    console.log('Response status code', gymResponse.statusCode);

    expect(gymResponse.statusCode).toEqual(200);
    expect(gymResponse.body.gyms).toHaveLength(1);
    expect(gymResponse.body.gyms).toEqual([
      expect.objectContaining({
        title: 'Javascript Gym',
      }),
    ]);
  });
});

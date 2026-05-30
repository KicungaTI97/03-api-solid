import { app } from '@/app';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Authenticate (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to authenticate', async () => {
    //criar um usuario
    await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'johndo@example.com',
      password: '123456',
    });

    //autenticar
    const response = await request(app.server).post('/sessions').send({
      email: 'johndo@example.com',
      password: '123456',
    });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      token: expect.any(String),
    });
  });
});

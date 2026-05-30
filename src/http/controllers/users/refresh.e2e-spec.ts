import { app } from '@/app';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Refresh Token (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to refresh token', async () => {
    // Register a new user
    await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'johnDoe@example.com',
      password: '123456',
    });

    // Auth
    const authResponse = await request(app.server).post('/sessions').send({
      email: 'johnDoe@example.com',
      password: '123456',
    });

    // Get cookies
    const cookies = authResponse.get('Set-Cookie');

    // Refresh token
    if (!cookies) {
      throw new Error('No cookies found');
    }
    const response = await request(app.server).patch('/refresh-token').set('Cookie', cookies).send();

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        token: expect.any(String),
      }),
    );

    expect(response.get('Set-Cookie')).toEqual(expect.arrayContaining([expect.stringContaining('refreshToken=')]));
  });
});

import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Create gym (e2e)', () => {
  // Inicializar o servidor antes de todos os testes
  beforeAll(async () => {
    await app.ready();
  });

  // Fechar o servidor após todos os testes
  afterAll(async () => {
    await app.close();
  });

  it('should be able to create a gym', async () => {
    const { token } = await createAndAuthenticateUser(app, true);

    const gymResponse = await request(app.server).post('/gyms/create').set('Authorization', `Bearer ${token}`).send({
      title: 'Gym',
      description: 'Gym description',
      phone: '123456789', 
      latitude: -27.0,
      longitude: -49.0,
    });

    expect(gymResponse.statusCode).toEqual(201);
  });
});

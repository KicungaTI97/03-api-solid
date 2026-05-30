import { app } from '@/app';
import { prisma } from '@/lib/prisma';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Create check-in (e2e)', async () => {
  // Inicializar o servidor antes de todos os testes
  beforeAll(async () => {
    await app.ready();
  });

  // Fechar o servidor após todos os testes
  afterAll(async () => {
    await app.close();
  });

  it('should be able to create a check-in', async () => {
    const { token } = await createAndAuthenticateUser(app);

    const gym = await prisma.gym.create({
      data: {
        title: 'Gym',
        description: 'Gym description',
        phone: '123456789',
        latitude: -27.0,
        longitude: -49.0,
      },
    });

    const checkInResponse = await request(app.server)
      .post(`/gyms/${gym.id}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: -27.0,
        longitude: -49.0,
      });

    expect(checkInResponse.statusCode).toEqual(201);
  });
});

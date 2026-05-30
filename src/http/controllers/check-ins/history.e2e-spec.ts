import { app } from '@/app';
import { prisma } from '@/lib/prisma';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Check-ins history (e2e)', async () => {
  // Inicializar o servidor antes de todos os testes
  beforeAll(async () => {
    await app.ready();
  });

  // Fechar o servidor após todos os testes
  afterAll(async () => {
    await app.close();
  });

  it('should be able to list the history of check-ins', async () => {
    const { token } = await createAndAuthenticateUser(app);
    const user = await prisma.user.findFirstOrThrow();

    const gym = await prisma.gym.create({
      data: {
        title: 'Gym',
        latitude: -27.0,
        longitude: -49.0,
      },
    });

    await prisma.checkIn.createMany({
      data: [
        {
          gym_id: gym.id,
          user_id: user.id,
        },
        {
          gym_id: gym.id,
          user_id: user.id,
        },
      ],
    });

    const response = await request(app.server)
      .get(`/check-ins/history`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.checkIns).toEqual([
      expect.objectContaining({
        gym_id: gym.id,
        user_id: user.id,
      }),
      expect.objectContaining({
        gym_id: gym.id,
        user_id: user.id,
      }),
    ]);
  });
});

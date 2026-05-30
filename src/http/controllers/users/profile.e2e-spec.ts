import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';
import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

describe('Profile (e2e)', () => {
  // Inicializar o servidor antes de todos os testes
  beforeAll(async () => {
    await app.ready();
  });

  // Fechar o servidor após todos os testes
  afterAll(async () => {
    await app.close();
  });

  // Limpar banco antes de cada teste (opcional mas recomendado)
  beforeEach(async () => {
    // Adicione aqui a lógica de limpar o banco de dados
    // Exemplo: await prisma.user.deleteMany()
  });

  it('should be able to get user profile', async () => {
    const { token } = await createAndAuthenticateUser(app);

    const profileResponse = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(profileResponse.statusCode).toEqual(200);
    expect(profileResponse.body).toEqual(
      expect.objectContaining({
        user: expect.objectContaining({
          email: 'johndoe@example.com',
        }),
      }),
    );
  });
});

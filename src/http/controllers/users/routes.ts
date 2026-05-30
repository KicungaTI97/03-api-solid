import type { FastifyInstance } from 'fastify';
import { verifyJWT } from '../../middlewares/verify-jwt';
import { authenticate } from './authenticate';
import { profile } from './profile';
import { register } from './register';
import { refresh } from './refresh';

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', register);
  app.post('/sessions', authenticate);

  app.patch('/refresh-token', refresh);

  /*Authenticated */
  app.get('/me', { onRequest: [verifyJWT] }, profile);
}

import fastifyCookie from '@fastify/cookie';
import fastifyJwt from '@fastify/jwt';
import fastify from 'fastify';
import { ZodError } from 'zod';
import { env } from './env';
import { checkInsRoutes } from './http/controllers/check-ins/routes';
import { gymsRoutes } from './http/controllers/gyms/routes';
import { usersRoutes } from './http/controllers/users/routes';

export const app = fastify();

// Registra o plugin do JWT
app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },

  sign: {
    expiresIn: '10m', // 10 minutos
  },
});

// Registra o plugin do Cookie
app.register(fastifyCookie);

// Registra as rotas da aplicação
app.register(usersRoutes);
app.register(gymsRoutes);
app.register(checkInsRoutes);

// Configura o tratamento de erros da aplicação
app.setErrorHandler((error, _request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({ message: 'Validation error.', issues: error.issues });
  }
  if (env.NODE_ENV !== 'production') {
    console.error(error);
  } else {
    // TODO: Here we should log to an external tool like DataDog/NewRelic/Sentry.
  }

  return reply.status(500).send({ message: 'Internal server error.' });
});

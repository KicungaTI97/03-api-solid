import { makeCreateGymUseCase } from '@/use-cases/factories/make-create-gym-use-case';
import type { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    title: z.string(),
    description: z.string().nullable(),
    phone: z.string().nullable(),
    latitude: z.number().refine((value) => value >= -90 && value <= 90),
    longitude: z.number().refine((value) => value >= -180 && value <= 180),
  });

  const { title, description, phone, latitude, longitude } = registerBodySchema.parse(request.body);

  const createGymUseCase = makeCreateGymUseCase();

  // Execução do caso de uso
  await createGymUseCase.execute({ title, description, phone, latitude, longitude });
  return reply.status(201).send({ message: 'Gym created successfully' });
}

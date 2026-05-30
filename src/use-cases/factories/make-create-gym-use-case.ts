import { PrismaGymsInsRepository } from '@/repositories/prisma/prisma-gyms-repository';
import { CreateGymUseCase } from '../create-gym';

// TODO: Implementar a factory de registro
export function makeCreateGymUseCase() {
  const gymRepository = new PrismaGymsInsRepository()
  const useCase = new CreateGymUseCase(gymRepository);
  return useCase;
}

import { PrismaGymsInsRepository } from '@/repositories/prisma/prisma-gyms-repository';
import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository';
import { CheckInUseCase } from '../check-in';

// TODO: Implementar a factory de registro
export function makeCheckInUseCase() {
  const checkInRepository = new PrismaCheckInsRepository()
  const gymsRepository = new PrismaGymsInsRepository()
  const useCase = new CheckInUseCase(checkInRepository, gymsRepository);
  return useCase;
}

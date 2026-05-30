import { PrismaGymsInsRepository } from '@/repositories/prisma/prisma-gyms-repository';
import { FetchNearbyGymsUseCase } from '../fetch-nearby-gyms';

export function makeFetchNearbyGymsUseCase() {
  const gymsRepository = new PrismaGymsInsRepository();
  const useCase = new FetchNearbyGymsUseCase(gymsRepository);
  return useCase;
}

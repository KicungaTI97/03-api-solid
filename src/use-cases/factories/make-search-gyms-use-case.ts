import { SearchGymsUseCase } from "../search-gyms";
import { PrismaGymsInsRepository } from "@/repositories/prisma/prisma-gyms-repository";

// TODO: Implementar a factory de autenticação
export function makeSearchGymsUseCase() {
  const gymsRepository = new PrismaGymsInsRepository();
  const useCase = new SearchGymsUseCase(gymsRepository);
  
  return useCase;
}

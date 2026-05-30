import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { AuthenticateUseCase } from '../authenticate';

// TODO: Implementar a factory de autenticação
export function makeAuthenticateUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const useCase = new AuthenticateUseCase(usersRepository);
  return useCase;
}

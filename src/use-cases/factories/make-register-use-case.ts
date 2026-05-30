import { RegisterUseCase } from '../register';
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';

// TODO: Implementar a factory de registro
export function makeRegisterUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const useCase = new RegisterUseCase(usersRepository);
  
  return useCase;
}

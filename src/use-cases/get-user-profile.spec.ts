import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { GetUserProfileUseCase } from "./get-user-profile";
import { hash } from "bcryptjs";
import { ResourceNotFoundError } from "./errors/resourceNotFoundError";

let usersRepository: InMemoryUsersRepository;
let sut: GetUserProfileUseCase;

// Teste para verificar se o caso de uso de obtenção do perfil do usuário está funcionando corretamente
describe('Get User Profile Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new GetUserProfileUseCase(usersRepository);
  });

  it('should be able to get user profile', async () => {
    // Cria um novo usuário no repositório em memória
    const createdUser = await usersRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password_hash: await hash('123456', 6),
    });

    // Executa o caso de uso de obtenção do perfil do usuário
    const { user } = await sut.execute({
      userId: createdUser.id,
    });

    // Verifica se o usuário foi encontrado corretamente
    await expect(user.id).toEqual(createdUser.id);
  });

  // Teste para verificar se o caso de uso de obtenção do perfil do usuário retorna um erro se o usuário não for encontrado
  it('should not be able to get user profile with wrong id', async () => {
    await expect(sut.execute({ userId: 'non-existing-id' })).rejects.toBeInstanceOf(ResourceNotFoundError); 
  });
});
import { compare, hash } from 'bcryptjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { AuthenticateUseCase } from './authenticate';
import { InvalidCredentialsError } from './errors/invalidCredentialsError';

let usersRepository: InMemoryUsersRepository;
let sut: AuthenticateUseCase;

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new AuthenticateUseCase(usersRepository);
  });

  it('should be able to authenticate a user', async () => {
    // Cria um novo usuário no repositório em memória
    await usersRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password_hash: await hash('123456', 6),
    });

    // Executa o caso de uso de autenticação
    const { user } = await sut.execute({
      email: 'john.doe@example.com',
      password: '123456',
    });

    // Verifica se a senha está correta
    const isPasswordHashed = await compare('123456', user.password_hash);

    expect(isPasswordHashed).toBe(true);
  });

  it('should not be able to authenticate with wrong email', async () => {
    await expect(
      sut.execute({
        email: 'john.doe@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password_hash: await hash('123456', 6),
    });

    await expect(
      sut.execute({
        email: 'john.doe@example.com',
        password: '1234567',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});

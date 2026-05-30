import { compare } from 'bcryptjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { UserAlreadyExistsError } from './errors/userAlreadyExistsError';
import { RegisterUseCase } from './register';

let usersRepository: InMemoryUsersRepository;
let sut: RegisterUseCase;

describe('Register Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new RegisterUseCase(usersRepository);
  });

  it('should be able to register a new user', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456',
    });
    expect(user.id).toEqual(expect.any(String));
  });

  it('should be able to register a new user', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456',
    });

    const isPasswordHashed = await compare('123456', user.password_hash);

    expect(isPasswordHashed).toBe(true);
  });

  it('should not be able to register a new user with same email twice', async () => {
    const email = 'john.doe@example.com';
    // Cria um novo usuário
    await sut.execute({
      name: 'John Doe',
      email,
      password: '123456',
    });

    // Tenta criar um novo usuário com o mesmo email
    await expect(
      sut.execute({
        name: 'John Doe',
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});

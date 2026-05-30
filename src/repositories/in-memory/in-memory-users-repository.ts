import type { Prisma, User } from '@prisma/client';
import { randomUUID } from 'crypto';
import type { UsersRepository } from '../users-repository';

// InMemoryUsersRepository é uma implementação em memória do repositório de usuários.
// É usada para testar o caso de uso de registro de usuário (RegisterUseCase).
class InMemoryUsersRepository implements UsersRepository {
  private users: User[] = [];

  // TODO: Implementar a criação de um usuário
  async create(user: Prisma.UserCreateInput): Promise<User> {
    const newUser: User = {
      id: randomUUID(),
      name: user.name,
      email: user.email,
      password_hash: user.password_hash,
      created_at: new Date(),
      role: user.role ?? 'MEMBER',
    };

    this.users.push(newUser);

    return newUser;
  }

  // TODO: Implementar a busca por email
  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((user) => user.email === email) || null;
  }

  // TODO: Implementar a busca por ID
  async findById(id: string): Promise<User | null> {
    return this.users.find((user) => user.id === id) || null;
  }
}

export { InMemoryUsersRepository };

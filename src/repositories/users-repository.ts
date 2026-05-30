import type { Prisma, User } from "@prisma/client";

// TODO: Implementar a interface do repositório de usuários
export interface UsersRepository {
    create(data: Prisma.UserCreateInput): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
}
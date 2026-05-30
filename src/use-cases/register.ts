import { hash } from 'bcryptjs';
import type { UsersRepository } from '@/repositories/users-repository';
import { UserAlreadyExistsError } from './errors/userAlreadyExistsError';
import type { User } from '@prisma/client';

interface RegisterUseCaseProps {
  name: string;
  email: string;
  password: string;
}

interface RegisterUseCaseResponse {
  user: User;
}

// Princípios SOLID são um conjunto de diretrizes de design de software orientado a objetos que ajudam a criar sistemas mais compreensíveis, flexíveis e de fácil manutenção. SOLID é um acrônimo para:

// 1. Single Responsibility Principle (Princípio da Responsabilidade Única):
//    Uma classe deve ter somente um motivo para mudar, ou seja, uma única responsabilidade.

// 2. Open/Closed Principle (Princípio do Aberto/Fechado):
//    Entidades de software devem estar abertas para extensão, mas fechadas para modificação.

// 3. Liskov Substitution Principle (Princípio da Substituição de Liskov):
//    Subtipos devem poder ser substituídos por seus tipos base sem afetar a corretude do programa.

// 4. Interface Segregation Principle (Princípio da Segregação de Interface):
//    Muitas interfaces específicas são melhores do que uma interface única e geral.

// 5. Dependency Inversion Principle (Princípio da Inversão de Dependência):
//    Dependa de abstrações, não de implementações concretas.

// Ao seguir os princípios SOLID, torna-se mais fácil evoluir, testar e reaproveitar os componentes do sistema.

// Casos de uso (ou "use cases") servem para isolar e organizar a lógica de negócio da aplicação.
// Eles representam ações ou operações específicas que um usuário pode realizar no sistema, como "cadastrar usuário", "realizar check-in", ou "buscar academias próximas".
// Ao centralizar essas regras e fluxos em casos de uso, facilitamos a manutenção, o teste e o reaproveitamento do código,
// tornando o sistema mais modular e aderente a boas práticas como o princípio da responsabilidade única (SRP do SOLID).

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ name, email, password }: RegisterUseCaseProps): Promise<RegisterUseCaseResponse> {
    const password_hash = await hash(password, 6);

    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError();
    }

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash,
    });

    return {
      user,
    };
  }
}

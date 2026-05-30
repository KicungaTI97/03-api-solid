import type { Gym } from '@prisma/client';
import type { GymsRepository } from '@/repositories/gyms-repository';

interface CreateGymUseCaseRequest {
  title: string;
  description: string | null;
  phone: string | null;
  latitude: number;
  longitude: number;
}

interface CreateGymUseCaseResponse {
  gym: Gym;
}


export class CreateGymUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute(data: CreateGymUseCaseRequest): Promise<CreateGymUseCaseResponse> {
    const { title, description, phone, latitude, longitude } = data;

    const gym = await this.gymsRepository.create({
      title,
      description,
      phone,
      latitude,
      longitude,
    });

    return { gym };
  }
}

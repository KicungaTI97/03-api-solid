import type { CheckIn } from '@prisma/client';
import type { CheckInsRepository } from '@/repositories/check-ins-repository';
import type { GymsRepository } from '@/repositories/gyms-repository';
import { ResourceNotFoundError } from './errors/resourceNotFoundError';
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates';
import { MaxDistanceError } from './errors/max-distance-error';
import { MaxNumberOfCheckInsError } from './errors/maxNumberOfCheckInsError';

interface CheckInUseCaseRequest {
  userId: string;
  gymId: string;
  userLatitude: number;
  userLongitude: number;
}

interface CheckInUseCaseResponse {
  checkIn: CheckIn;
}

export class CheckInUseCase {
  constructor(
    private checkInsRepository: CheckInsRepository,
    private gymsRepository: GymsRepository,
  ) {}

  async execute({ userId, gymId, userLatitude, userLongitude }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    const checkInOnSameDate = await this.checkInsRepository.findByUserIdOnDate(userId, new Date()); // Verifica se o usuário já fez check-in no mesmo dia
    const gym = await this.gymsRepository.findById(gymId);

    if (!gym) {
      throw new ResourceNotFoundError();
    }

    // Calcular a distância entre o usuário e a academia
    const distance = getDistanceBetweenCoordinates(
      { latitude: userLatitude, longitude: userLongitude },
      { latitude: gym.latitude, longitude: gym.longitude },
    );
    const MAX_DISTANCE_IN_METERS = 100; // 100 meters

    if (distance > MAX_DISTANCE_IN_METERS) {
      throw new MaxDistanceError();
    }

    if (checkInOnSameDate) {
      throw new MaxNumberOfCheckInsError();
    }

    const checkIn = await this.checkInsRepository.create({
      user_id: userId,
      gym_id: gymId,
    });

    return {
      checkIn,
    };
    
  }
}

import type { CheckIn } from '@prisma/client';
import type { CheckInsRepository } from '@/repositories/check-ins-repository';
import { ResourceNotFoundError } from './errors/resourceNotFoundError';
import { LateCheckInValidationError } from './errors/lateCheckInValidationError';
import dayjs from 'dayjs';

interface ValidateCheckInUseCaseRequest {
  checkInId: string;
}

interface ValidateCheckInUseCaseResponse {
  checkIn: CheckIn;
}

export class ValidateCheckInUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {} 
  // TODO: Implementar a validação de um check-in
  async execute({ checkInId }: ValidateCheckInUseCaseRequest): Promise<ValidateCheckInUseCaseResponse> {
    const checkIn = await this.checkInsRepository.findById(checkInId);

    if (!checkIn) {
      throw new ResourceNotFoundError();
    }

    checkIn.validated_at = new Date(); // Atribui a data de validação ao check-in
    
    const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(checkIn.created_at, 'minutes');

    if (distanceInMinutesFromCheckInCreation > 20) {
      throw new LateCheckInValidationError();
    }
    await this.checkInsRepository.save(checkIn);

    return {
      checkIn,
    };
  }
}

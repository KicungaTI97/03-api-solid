import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { ResourceNotFoundError } from './errors/resourceNotFoundError';
import { ValidateCheckInUseCase } from './validate-check-in';
import { LateCheckInValidationError } from './errors/lateCheckInValidationError';

let checkInsRepository: InMemoryCheckInsRepository;
let sut: ValidateCheckInUseCase;

describe('Validate Check-In Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new ValidateCheckInUseCase(checkInsRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be able to validate a check-in', async () => {
    const createCheckIn = await checkInsRepository.create({
      gym_id: 'gym-123',
      user_id: 'user-123',
    });

    const { checkIn } = await sut.execute({
      checkInId: createCheckIn.id,
    });

    expect(checkIn.validated_at).toEqual(expect.any(Date));
    expect(checkInsRepository.checkIns[0]?.validated_at).toEqual(expect.any(Date));
  });

  it('should not be able to validate an inexistent check-in', async () => {
    await expect(
      sut.execute({
        checkInId: 'inexistent-check-in-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to validate the check-in after 20 minutes of its creation', async () => {
    vi.setSystemTime(new Date(2025, 11, 27, 10, 0, 0)); // Set the system time to 2025-11-27 10:00:00
    const createCheckIn = await checkInsRepository.create({
      gym_id: 'gym-123',
      user_id: 'user-123',
    });

    const twentyOneMinutesInMs = 1000 * 60 * 21; // 21 minutes in milliseconds
    
    vi.advanceTimersByTime(twentyOneMinutesInMs); // Advance the timers by 21 minutes

    await expect(
      sut.execute({
        checkInId: createCheckIn.id,
      }),
    ).rejects.toBeInstanceOf(LateCheckInValidationError);
  
  });
});

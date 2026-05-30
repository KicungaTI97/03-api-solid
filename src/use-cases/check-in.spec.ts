import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { CheckInUseCase } from './check-in';
import { MaxDistanceError } from './errors/max-distance-error';
import { MaxNumberOfCheckInsError } from './errors/maxNumberOfCheckInsError';

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

describe('Check In Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInUseCase(checkInsRepository, gymsRepository);

    await gymsRepository.create({
      id: 'gym-01',
      title: 'Academia 01',
      description: null,
      phone: null,
      latitude: -27.0,
      longitude: -49.0,
      created_at: new Date(),
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be able to check in', async () => {
    vi.setSystemTime(new Date(2025, 11, 27, 10, 0, 0));
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2025, 11, 27, 10, 0, 0));
    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    });

    await expect(
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -27.2092052,
        userLongitude: -49.6401091,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
  });

  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2025, 11, 27, 10, 0, 0));
    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    });

    vi.setSystemTime(new Date(2025, 11, 28, 10, 0, 0));
    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    });

    expect(true).toBe(true);
  });

  it('should not be able to check in on distant gym', async () => {
    // Gym 02 is 100km away from user 02 (latitude: -27.2092052, longitude: -49.6401091)
    gymsRepository.items.push({
      id: 'gym-02',
      title: 'Academia 02',
      description: null,
      phone: null,
      latitude: -27.0,
      longitude: -49.0,
      created_at: new Date(),
    });

    await expect(
      sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -26.2092052,
        userLongitude: -47.6401091,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError);
  });
});

import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { CreateGymUseCase } from './create-gym';

describe('Create Gym Use Case', () => {
  let gymsRepository: InMemoryGymsRepository;
  let sut: CreateGymUseCase;

  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new CreateGymUseCase(gymsRepository);
  });

  it('should be able to create a gym', async () => {
    const { gym } = await sut.execute({
      title: 'Academia 01',
      description: null,
      phone: null,
      latitude: -27.0,
      longitude: -49.0,
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});

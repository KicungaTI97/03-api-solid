import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms';

let gymsRepository: InMemoryGymsRepository;
let sut: FetchNearbyGymsUseCase;

describe('Fetch Nearby Gyms Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new FetchNearbyGymsUseCase(gymsRepository);
  });

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Academia de Proxima',
      description: null,
      phone: null,
      latitude: -12.3909713,
      longitude: 13.640247,
    });
    await gymsRepository.create({
      title: 'Academia de Distante',
      description: null,
      phone: null,
      latitude: -12.2476445,
      longitude: 13.7105669,
    });

    const { gyms } = await sut.execute({
      userLatitude: -12.3909713,
      userLongitude: 13.640247,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Academia de Proxima' }),
    ]);
  });
  
});
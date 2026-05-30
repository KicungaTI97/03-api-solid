import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { SearchGymsUseCase } from './search-gyms';

let gymsRepository: InMemoryGymsRepository;
let sut: SearchGymsUseCase;

describe('Search Gyms Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new SearchGymsUseCase(gymsRepository);
  });

  it('should be able to search for gyms', async () => {
    await gymsRepository.create({
      title: 'Academia 01',
      description: null,
      phone: null,
      latitude: -27.0,
      longitude: -49.0,
    });

    await gymsRepository.create({
      title: 'Academia 02',
      description: null,
      phone: null,
      latitude: -27.0,
      longitude: -49.0,
    });

    const { gyms } = await sut.execute({
      query: 'Academia',
      page: 1,
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Academia 01' }),
      expect.objectContaining({ title: 'Academia 02' }),
    ]);
  });

  it('should be able to search for gyms with pagination', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `Academia ${i}`,
        description: null,
        phone: null,
        latitude: -27.0,
        longitude: -49.0,
      });
    }

    const { gyms } = await sut.execute({
      query: 'Academia',
      page: 2,
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Academia 21' }),
      expect.objectContaining({ title: 'Academia 22' }),
    ]);
  });
});

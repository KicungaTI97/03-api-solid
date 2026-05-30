import { randomUUID } from 'node:crypto';
import type { Gym, Prisma } from '@prisma/client';
import type { FindManyNearbyParams, GymsRepository } from '../gyms-repository';
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates';

export class InMemoryGymsRepository implements GymsRepository {
  public items: Gym[] = [];

  // TODO: Implementar a busca por ID
  async findById(id: string): Promise<Gym | null> {
    const user = this.items.find((item) => item.id === id) || null;

    return user;
  }

  // TODO: Implementar a criação de uma academia
  async create(data: Prisma.GymCreateInput): Promise<Gym> {
    const { id, title, description, phone, latitude, longitude, created_at } = data;
    const gym = {
      id: id ?? randomUUID(),
      title,
      description: description || null,
      phone: phone || null,
      latitude,
      longitude,
      created_at: created_at || new Date(),
    };

    this.items.push(gym as Gym);

    return gym as Gym;
  }
  // TODO: Implementar a busca por query
  async searchMany(query: string, page: number): Promise<Gym[]> {
    return this.items
      .filter((item) => item.title.toLowerCase().includes(query.toLowerCase())) //
      .slice((page - 1) * 20, page * 20);
  }
  // TODO: Implementar a busca por academias próximas
  async findManyNearby(params: FindManyNearbyParams): Promise<Gym[]> {
    return this.items.filter((item) => {
      const distance = getDistanceBetweenCoordinates(
        { latitude: params.userLatitude, longitude: params.userLongitude },
        { latitude: item.latitude, longitude: item.longitude },
      );

      console.log(distance);
      return distance < 10;
    });
  }
}

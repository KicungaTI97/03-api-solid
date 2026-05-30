import type { Gym, Prisma } from '@prisma/client';

import { prisma } from '@/lib/prisma';
import type { FindManyNearbyParams, GymsRepository } from '../gyms-repository';

export class PrismaGymsInsRepository implements GymsRepository {
  async findById(id: string) {
    const gym = await prisma.gym.findUnique({
      where: {
        id,
      },
    });

    return gym;
  }

  async create(data: Prisma.GymCreateInput) {
    const gym = await prisma.gym.create({
      data,
    });

    return gym;
  }
  async searchMany(query: string, page: number) {
    const gyms = await prisma.gym.findMany({
      where: {
        title: {
          contains: query,
        },
      },
      take: 20,
      skip: (page - 1) * 28,
    });

    return gyms;
  }

  async findManyNearby({ userLatitude, userLongitude }: FindManyNearbyParams) {
    const gyms = await prisma.$queryRaw<Gym[]>`
        SELECT * from gyms
        WHERE ( 6371 * acos( cos( radians(${userLatitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${userLongitude}) ) + sin( radians(${userLatitude}) ) * sin( radians( latitude ) ) ) ) <= 10
    `;
    return gyms;
  }
}

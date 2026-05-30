import { randomUUID } from 'node:crypto';
import type { CheckIn, Prisma } from '@prisma/client';
import dayjs from 'dayjs';
import type { CheckInsRepository } from '../check-ins-repository';

class InMemoryCheckInsRepository implements CheckInsRepository {
  public checkIns: CheckIn[] = [];

  // TODO: Implementar a busca por usuário na mesma data
  async findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null> {
    const startOfTheDay = dayjs(date).startOf('date').toDate();
    const endOfTheDay = dayjs(date).endOf('date').toDate();

    const checkInOnSameDate = this.checkIns.find((checkIn) => {
      const checkInDate = dayjs(checkIn.created_at);
      const isOnSameDate = checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay);

      return checkIn.user_id === userId && isOnSameDate;
    });

    if (!checkInOnSameDate) {
      return null;
    }

    return checkInOnSameDate;
  }

  // TODO: Implementar a busca por usuário
  async findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {
    return this.checkIns
      .filter((checkIn) => checkIn.user_id === userId)
      .sort((a, b) => a.created_at.getTime() - b.created_at.getTime())
      .slice((page - 1) * 20, page * 20);
  }

  // TODO: Implementar a criação de um check-in
  async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
    const { user_id, gym_id, validated_at } = data;

    const checkIn = {
      id: randomUUID(),
      user_id,
      gym_id,
      created_at: new Date(),
      validated_at: validated_at ? new Date(validated_at) : null,
    };

    this.checkIns.push(checkIn);

    return checkIn;
  }

  // TODO: Implementar a contagem de check-ins por usuário
  async countByUserId(userId: string): Promise<number> {
    return this.checkIns.filter((checkIn) => checkIn.user_id === userId).length;
  }

  // TODO: Implementar a busca por ID
  async findById(id: string): Promise<CheckIn | null> {
    return this.checkIns.find((checkIn) => checkIn.id === id) || null;
  }

  // TODO: Implementar a salvamento de um check-in
  async save(checkIn: CheckIn): Promise<CheckIn> {
    const checkInIndex = this.checkIns.findIndex((item) => item.id === checkIn.id);
    this.checkIns[checkInIndex] = checkIn;
    return checkIn;
  }
}

export { InMemoryCheckInsRepository };

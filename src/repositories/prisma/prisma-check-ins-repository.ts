import { prisma } from '@/lib/prisma';
import type { CheckIn, Prisma } from '@prisma/client';
import dayjs from 'dayjs';
import type { CheckInsRepository } from '../check-ins-repository';

export class PrismaCheckInsRepository implements CheckInsRepository {
  async findById(id: string) {
    const checkIn = await prisma.checkIn.findUnique({
      where: { id },
    });
    return checkIn;
  }

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = await prisma.checkIn.create({
      data,
    });
    return checkIn;
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf('date').toDate();
    const endOfTheDay = dayjs(date).endOf('date').toDate();

    const checkIn = await prisma.checkIn.findFirst({
      where: {
        user_id: userId,
        created_at: {
          gte: startOfTheDay, //gte: greater than or equal to
          lte: endOfTheDay, //lte: less than or equal to
        },
      },
    });

    return checkIn;
  }

  // TODO: Implementar a contagem de check-ins por usuário
  async countByUserId(userId: string) {
    const count = await prisma.checkIn.count({
      where: {
        user_id: userId,
      },
    });
    return count;
  }

  // TODO: Implementar a busca por usuário paginado
  async findManyByUserId(userId: string, page: number) {
    const checkIns = await prisma.checkIn.findMany({
      where: {
        user_id: userId,
      },
      skip: (page - 1) * 20,
      take: 20,
    });
    return checkIns;
  }

  // TODO: Implementar a salvamento de um check-in
  async save(checkIn: CheckIn) {
    const updatedCheckIn = await prisma.checkIn.update({
      where: { id: checkIn.id },
      data: checkIn,
    });
    return updatedCheckIn;
  }
}

import type { CheckIn, Prisma } from "@prisma/client";

// TODO: Implementar a interface do repositório de check-ins
export interface CheckInsRepository {
    findById(id: string): Promise<CheckIn | null>;  //
    create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>;
    findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null>;
    countByUserId(userId: string): Promise<number>;
    findManyByUserId(userId: string, page: number): Promise<CheckIn[]>; 
    save(checkIn: CheckIn): Promise<CheckIn>; 
}
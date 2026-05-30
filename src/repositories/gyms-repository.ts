import type { Gym, Prisma } from "@prisma/client";

export interface FindManyNearbyParams {
    userLatitude: number;
    userLongitude: number;
}
// TODO: Implementar a interface do repositório de academias
export interface GymsRepository {
    findById(id: string): Promise<Gym | null>;
    create(data: Prisma.GymCreateInput): Promise<Gym>;
    searchMany(query: string, page: number): Promise<Gym[]>;
    findManyNearby(params: FindManyNearbyParams): Promise<Gym[]>;
}
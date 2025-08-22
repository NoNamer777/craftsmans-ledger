import { tryCatch } from '@craftsmans-ledger/shared';
import { BeforeApplicationShutdown, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DatabaseService implements OnApplicationBootstrap, BeforeApplicationShutdown {
    public readonly prismaClient = new PrismaClient();

    public async onApplicationBootstrap() {
        const { error } = await tryCatch(this.prismaClient.$connect());

        if (error) console.error(error);
    }

    public async beforeApplicationShutdown() {
        await this.prismaClient.$disconnect();
    }
}

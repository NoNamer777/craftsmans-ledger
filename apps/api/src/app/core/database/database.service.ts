import { PrismaClient } from '@craftsmans-ledger/prisma/api';
import { tryCatch } from '@craftsmans-ledger/shared';
import { BeforeApplicationShutdown, Injectable, OnApplicationBootstrap } from '@nestjs/common';

@Injectable()
export class DatabaseService extends PrismaClient implements OnApplicationBootstrap, BeforeApplicationShutdown {
    public async onApplicationBootstrap() {
        const { error } = await tryCatch(this.$connect());

        if (error) console.error(error);
    }

    public async beforeApplicationShutdown() {
        await this.$disconnect();
    }
}

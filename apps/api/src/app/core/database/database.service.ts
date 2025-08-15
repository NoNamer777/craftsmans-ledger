import { PrismaClient } from '@craftsmans-ledger/prisma';
import { BeforeApplicationShutdown, Injectable, OnApplicationBootstrap } from '@nestjs/common';

@Injectable()
export class DatabaseService extends PrismaClient implements OnApplicationBootstrap, BeforeApplicationShutdown {
    public async onApplicationBootstrap() {
        await this.$connect();
    }

    public async beforeApplicationShutdown() {
        await this.$disconnect();
    }
}

import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
    public readonly prismaClient = new PrismaClient();

    public async onModuleInit() {
        await this.prismaClient.$connect();
    }

    public async onModuleDestroy() {
        await this.prismaClient.$disconnect();
    }
}

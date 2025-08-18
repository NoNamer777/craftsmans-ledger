import { Module } from '@nestjs/common';
import { CacheModule, DatabaseModule } from '../core';
import { ItemsController } from './items.controller';
import { ItemsRepository } from './items.repository';
import { ItemsService } from './items.service';

@Module({
    imports: [DatabaseModule, CacheModule],
    controllers: [ItemsController],
    providers: [ItemsService, ItemsRepository],
    exports: [ItemsService],
})
export class ItemsModule {}

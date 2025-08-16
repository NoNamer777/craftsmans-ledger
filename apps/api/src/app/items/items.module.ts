import { Module } from '@nestjs/common';
import { ItemsController } from './items.controller';
import { ItemsRepository } from './items.repository';
import { ItemsService } from './items.service';

@Module({
    imports: [],
    controllers: [ItemsController],
    providers: [ItemsService, ItemsRepository],
    exports: [ItemsService],
})
export class ItemsModule {}

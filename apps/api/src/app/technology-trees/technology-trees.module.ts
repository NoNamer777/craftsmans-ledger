import { Module } from '@nestjs/common';
import { CacheModule, DatabaseModule } from '../core';
import { TechnologyTreesController } from './technology-trees.controller';
import { TechnologyTreesRepository } from './technology-trees.repository';
import { TechnologyTreesService } from './technology-trees.service';

@Module({
    imports: [DatabaseModule, CacheModule],
    controllers: [TechnologyTreesController],
    providers: [TechnologyTreesService, TechnologyTreesRepository],
    exports: [TechnologyTreesService],
})
export class TechnologyTreesModule {}

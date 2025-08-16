import { Module } from '@nestjs/common';
import { TechnologyTreesModule } from '../technology-trees';
import { RecipesController } from './recipes.controller';
import { RecipesRepository } from './recipes.repository';
import { RecipesService } from './recipes.service';

@Module({
    imports: [TechnologyTreesModule],
    controllers: [RecipesController],
    providers: [RecipesService, RecipesRepository],
    exports: [RecipesService],
})
export class RecipesModule {}

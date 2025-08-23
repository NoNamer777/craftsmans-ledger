import { Module } from '@nestjs/common';
import { CacheModule, DatabaseModule } from '../core';
import { ItemsModule } from '../items';
import { TechnologyTreesModule } from '../technology-trees';
import { RecipesController } from './recipes.controller';
import { RecipeInputsRepository, RecipeOutputsRepository, RecipesRepository } from './repositories';
import { RecipeInputsService, RecipeOutputsService, RecipesService } from './services';

@Module({
    imports: [DatabaseModule, CacheModule, TechnologyTreesModule, ItemsModule],
    controllers: [RecipesController],
    providers: [
        RecipesService,
        RecipesRepository,
        RecipeInputsService,
        RecipeInputsRepository,
        RecipeOutputsService,
        RecipeOutputsRepository,
    ],
    exports: [RecipesService, RecipeInputsService, RecipeOutputsService],
})
export class RecipesModule {}

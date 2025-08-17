import { Module } from '@nestjs/common';
import { ItemsModule } from '../items';
import { TechnologyTreesModule } from '../technology-trees';
import { RecipeInputsRepository } from './recipe-inputs.repository';
import { RecipeInputsService } from './recipe-inputs.service';
import { RecipesController } from './recipes.controller';
import { RecipesRepository } from './recipes.repository';
import { RecipesService } from './recipes.service';

@Module({
    imports: [TechnologyTreesModule, ItemsModule],
    controllers: [RecipesController],
    providers: [RecipesService, RecipesRepository, RecipeInputsService, RecipeInputsRepository],
    exports: [RecipesService],
})
export class RecipesModule {}

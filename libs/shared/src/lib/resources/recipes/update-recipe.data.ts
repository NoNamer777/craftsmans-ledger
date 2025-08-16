import { Expose } from 'class-transformer';
import { CreateRecipeData } from './create-recipe.data';

export class UpdateRecipeData extends CreateRecipeData {
    @Expose()
    public id: string;
}

import { Expose } from 'class-transformer';

export class CreateRecipeData {
    @Expose()
    public craftingTime: number;

    @Expose()
    public technologyTreeId: string;

    @Expose()
    public technologyPoints: number;
}

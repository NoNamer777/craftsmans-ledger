import { Expose } from 'class-transformer';
import { StandardQueryParams } from './standard-query-params';

export class RecipeQueryParams extends StandardQueryParams {
    @Expose()
    public techTreeIds: string[];

    @Expose()
    public maxTechPoints: number[];
}

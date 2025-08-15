import { Expose, Type } from 'class-transformer';
import { TechnologyTree } from '../../resources';
import { Filters } from '../models';

export class TechnologyTreeFilter {
    @Expose()
    @Type(() => TechnologyTree)
    public technologyTree: TechnologyTree;

    @Expose()
    public maxPoints: number;

    public get label() {
        return `${this.technologyTree.name}:${this.maxPoints}`;
    }
}

export class RecipeFilters extends Filters {
    @Expose()
    @Type(() => TechnologyTreeFilter)
    public technologyFilters: TechnologyTreeFilter[];
}

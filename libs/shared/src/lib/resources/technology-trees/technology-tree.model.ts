import { Expose } from 'class-transformer';
import { Resource } from '../resource.model';

export class TechnologyTree implements Resource {
    @Expose()
    public id: string;

    @Expose()
    public name: string;

    @Expose()
    public maxPoints: number;

    public label() {
        return this.name;
    }

    public compareTo(other: unknown) {
        if (this === other) return true;
        if (!this.isTechnologyTree(other)) return false;

        return this.name === other.name && this.maxPoints === other.maxPoints;
    }

    public isTechnologyTree(value: unknown): value is TechnologyTree {
        return value instanceof TechnologyTree;
    }
}

import { Expose } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, Min, MinLength } from 'class-validator';
import { Resource } from '../resource.model';

export class TechnologyTree implements Resource {
    @IsNotEmpty()
    @IsString()
    @Expose()
    public id: string;

    @MinLength(2)
    @IsNotEmpty()
    @IsString()
    @Expose()
    public name: string;

    @Min(0)
    @IsInt()
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

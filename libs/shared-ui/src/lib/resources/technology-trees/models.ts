import { Expose } from 'class-transformer';
import { nanoid } from 'nanoid';
import { Resource } from '../models';

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

export class CreateTechnologyTreeData {
    @Expose()
    public name: string;

    @Expose()
    public maxPoints: number;
}

export class TechnologyTreeBuilder {
    private technologyTree = new TechnologyTree();

    public build() {
        return this.technologyTree;
    }

    public constructor(value?: unknown) {
        if (typeof value !== 'object') return;

        if ('name' in value && typeof value.name === 'string') this.technologyTree.name = value.name;
        if ('maxPoints' in value && typeof value.maxPoints === 'number')
            this.technologyTree.maxPoints = value.maxPoints;
    }

    public withId(technologyTreeId?: string) {
        this.technologyTree.id = technologyTreeId ?? nanoid();
        return this;
    }

    public withName(name: string) {
        this.technologyTree.name = name;
        return this;
    }

    public withMaxPoints(maxPoints: number) {
        this.technologyTree.maxPoints = maxPoints;
        return this;
    }
}

export const SortableTechnologyTreeAttributes = {
    NAME: 'name',
    MAX_POINTS: 'maxPoints',
} as const;

export type SortableTechnologyTreeAttribute =
    (typeof SortableTechnologyTreeAttributes)[keyof typeof SortableTechnologyTreeAttributes];

export const DEFAULT_TECHNOLOGY_TREE_SORTING_ATTRIBUTE = SortableTechnologyTreeAttributes.NAME;

import { nanoid } from 'nanoid';
import { TechnologyTree } from './technology-tree.model';

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

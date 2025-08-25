import { nanoid } from 'nanoid';
import { Item } from './item.model';

export class ItemBuilder {
    private item = new Item();

    public build() {
        return this.item;
    }

    public constructor(value?: unknown) {
        if (typeof value !== 'object') return;

        if ('name' in value && typeof value.name === 'string') this.item.name = value.name;
        if ('weight' in value && typeof value.weight === 'number') this.item.weight = value.weight;
        if ('cost' in value && typeof value.cost === 'number') this.item.cost = value.cost;
    }

    public withId(itemId?: string) {
        this.item.id = itemId ?? nanoid();
        return this;
    }

    public withName(name: string) {
        this.item.name = name;
        return this;
    }

    public withWeight(weight: number) {
        this.item.weight = weight;
        return this;
    }

    public withCost(cost: number) {
        this.item.cost = cost;
        return this;
    }
}

import { nanoid } from 'nanoid';
import { parse, ParseRemoteConfig, ParseResult } from 'papaparse';
import {
    CreateItemData,
    Item,
    ItemBuilder,
    ItemPaginationParamNames,
    ItemQueryParamNames,
    PaginatedResponse,
    SortableItemAttribute,
    SortableItemAttributes,
    SortOrder,
    SortOrders,
} from '../../../src';
import { BadRequestException, NotFoundException } from '../api/handlers/expections';

export class MockItemDB {
    private items: Item[] = [];

    public getAll() {
        return this.items;
    }

    public create(data: CreateItemData) {
        if (this.isNameTaken(data.name)) {
            throw new BadRequestException(`Could not create Item - Reason: Name "${data.name}" is not available`);
        }
        const item = new ItemBuilder(data).withId().build();

        this.items = [...this.items, item].sort((curr, next) => this.sortItem(curr, next, SortableItemAttributes.NAME));
        return item;
    }

    public query(params: URLSearchParams): Item {
        if (params.has(ItemQueryParamNames.NAME)) {
            const nameParam = params.get(ItemQueryParamNames.NAME);

            return this.items.find(({ name }) => name.toLowerCase() === nameParam.toLowerCase().trim());
        }
        return null;
    }

    public paginated(params: URLSearchParams): PaginatedResponse<Item> {
        let data = [...this.items];

        const order = params.get(ItemPaginationParamNames.ORDER) as SortOrder;
        const sortBy = params.get(ItemPaginationParamNames.SORT_BY) as SortableItemAttribute;
        let offset = 0;
        let page = 1;
        let maxPages = 1;

        data.sort((curr, next) => this.sortItem(curr, next, sortBy));

        if (order === SortOrders.DESCENDING) {
            data.reverse();
        }
        if (params.has(ItemPaginationParamNames.LIMIT)) {
            const limit = Number.parseInt(params.get(ItemPaginationParamNames.LIMIT));

            if (params.has(ItemPaginationParamNames.OFFSET)) {
                offset = Number.parseInt(params.get(ItemPaginationParamNames.OFFSET));
            }
            maxPages = Math.ceil(data.length / limit);
            page = Math.floor(((offset + limit) / data.length) * maxPages);

            data = data.slice(offset, offset + limit);
        }
        return {
            totalNumberOfResults: this.items.length,
            data: data,
            page: page,
            maxPages: maxPages,
        };
    }

    public getById(itemId: string) {
        return this.items.find(({ id }) => id === itemId) ?? null;
    }

    public update(data: Item) {
        if (!this.getById(data.id)) {
            throw new NotFoundException(`"Could not update Item with ID "${data.id}" - Reason: Item was not found`);
        }
        if (this.isNameTaken(data.name, data.id)) {
            throw new BadRequestException(
                `Could not update Item with ID "${data.id}" - Reason: Name "${data.name}" is not available`
            );
        }
        this.items = this.items.map((item) => {
            if (item.id === data.id) return data;
            return item;
        });
        return data;
    }

    public remove(itemId: string) {
        if (!this.getById(itemId)) {
            throw new NotFoundException(`Could not remove Item with ID "${itemId}" - Reason: Item was not found`);
        }
        this.items = this.items.filter(({ id }) => id !== itemId);
    }

    public async reset() {
        const items = await new Promise<Item[]>((resolve, reject) => {
            parse<Item>('/data/csv/items.csv', {
                download: true,
                delimiter: ',',
                header: true,
                dynamicTyping: true,
                skipEmptyLines: true,
                error: (error) => {
                    reject(error);
                },
                complete: (results: ParseResult<Item>) => {
                    if (results.errors.length > 0) {
                        reject(new Error(results.errors[0].message));
                        return;
                    }
                    resolve(
                        results.data.map((item) => {
                            item.id = nanoid();
                            return item;
                        })
                    );
                },
            } satisfies ParseRemoteConfig<Item>);
        });

        this.items = [...items].sort((curr, next) => this.sortItem(curr, next, SortableItemAttributes.NAME));
    }

    private sortItem(curr: Item, next: Item, sortBy: SortableItemAttribute) {
        switch (sortBy) {
            case SortableItemAttributes.BASE_VALUE:
                return curr.cost - next.cost;

            case SortableItemAttributes.WEIGHT:
                return curr.cost - next.weight;

            // Defaults to sorting Items by name.
            default:
                return curr.name.localeCompare(next.name);
        }
    }

    private getByName(itemName: string) {
        return this.items.find(({ name }) => name.toLowerCase() === itemName.toLowerCase());
    }

    private isNameTaken(name: string, itemId?: string) {
        const query = this.getByName(name);
        return query && (!itemId || query.id !== itemId);
    }
}

export const mockItemDB = new MockItemDB();

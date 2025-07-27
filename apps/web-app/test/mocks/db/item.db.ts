import { nanoid } from 'nanoid';
import { parse, ParseRemoteConfig, ParseResult } from 'papaparse';
import { Item } from '../../../src/app';

export class MockItemDB {
    private items: Item[] = [];

    public getAll() {
        return this.items;
    }

    public getById(itemId: string) {
        return this.items.find(({ id }) => id === itemId) ?? null;
    }

    public async reset() {
        const items = await new Promise<Item[]>((resolve, reject) => {
            parse<Item>('/data/items.csv', {
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

        this.items = [...items];
    }
}

export const mockItemDB = new MockItemDB();

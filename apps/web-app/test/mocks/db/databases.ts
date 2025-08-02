import { mockItemDB } from './item.db';

export async function resetDatabases() {
    await mockItemDB.reset();
}

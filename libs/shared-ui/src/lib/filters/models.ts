import { SortOrder } from '@craftsmans-ledger/shared';
import { Expose } from 'class-transformer';

export class Filters {
    @Expose()
    public order?: SortOrder;

    @Expose()
    public limit?: number;

    @Expose()
    public offset?: number;
}

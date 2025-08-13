import { Expose } from 'class-transformer';
import { SortOrder } from '../resources';

export class Filters {
    @Expose()
    public order?: SortOrder;

    @Expose()
    public limit?: number;

    @Expose()
    public offset?: number;
}

import { Expose } from 'class-transformer';

export class CreateItemData {
    @Expose()
    public name: string;

    @Expose()
    public weight: number;

    @Expose()
    public baseValue: number;
}

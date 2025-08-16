import { Expose } from 'class-transformer';

export class CreateTechnologyTreeData {
    @Expose()
    public name: string;

    @Expose()
    public maxPoints: number;
}

import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { StandardQueryParams } from './standard-query-params';

export const SortableItemAttributes = {
    NAME: 'name',
    WEIGHT: 'weight',
    COST: 'cost',
} as const;

export type SortableItemAttribute = (typeof SortableItemAttributes)[keyof typeof SortableItemAttributes];

export const DEFAULT_ITEM_SORTING_ATTRIBUTE = SortableItemAttributes.NAME;

export const ItemQueryParamNames = {
    TECH_TREE_IDS: 'techTreeIds',
    MAX_TECH_POINTS: 'maxTechPoints',
    NAME: 'name',
} as const;

export type ItemQueryParamName = (typeof ItemQueryParamNames)[keyof typeof ItemQueryParamNames];

export class ItemQueryParams extends StandardQueryParams {
    @IsNotEmpty({ each: true })
    @IsString({ each: true })
    @IsOptional()
    @Expose()
    public [ItemQueryParamNames.TECH_TREE_IDS]?: string[];

    @Min(0, { each: true })
    @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 }, { each: true })
    @IsOptional()
    @Expose()
    public [ItemQueryParamNames.MAX_TECH_POINTS]?: number[];

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    @Expose()
    public [ItemQueryParamNames.NAME]?: string;
}

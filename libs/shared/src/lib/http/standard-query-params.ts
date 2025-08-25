import { Expose } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { SortOrder, SortOrders } from './sort-order';

export const DEFAULT_LIMIT = 20 as const;

export const DEFAULT_OFFSET = 0 as const;

export const StandardQueryParamNames = {
    SORT_BY: 'sortBy',
    ORDER: 'order',
    OFFSET: 'offset',
    LIMIT: 'limit',
} as const;

export type StandardQueryParamName = (typeof StandardQueryParamNames)[keyof typeof StandardQueryParamNames];

export class StandardQueryParams {
    @Min(0)
    @IsInt()
    @IsOptional()
    @Expose()
    public [StandardQueryParamNames.OFFSET]?: number;

    @Min(0)
    @IsInt()
    @IsOptional()
    @Expose()
    public [StandardQueryParamNames.LIMIT]?: number;

    @IsEnum(SortOrders)
    @IsNotEmpty()
    @IsString()
    @IsOptional()
    @Expose()
    public [StandardQueryParamNames.ORDER]?: SortOrder;

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    @Expose()
    public [StandardQueryParamNames.SORT_BY]?: string;
}

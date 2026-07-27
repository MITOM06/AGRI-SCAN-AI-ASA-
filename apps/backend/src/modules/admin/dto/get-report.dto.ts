import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum GroupBy {
  DAY = 'day',
  MONTH = 'month',
}

export class GetReportDto {
  @IsDateString()
  from: string; // ISO string: '2026-01-01'

  @IsDateString()
  to: string; // ISO string: '2026-03-31'

  @IsOptional()
  @IsEnum(GroupBy)
  groupBy?: GroupBy = GroupBy.DAY;
}

/**
 * Query cho biểu đồ time-series N ngày gần nhất (Reports.tsx).
 * VD: ?days=7 → 7 ngày gần nhất tính đến hôm nay.
 */
export class SeriesQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(365)
  days?: number = 7;
}

export class CompareMonthDto {
  @IsDateString()
  month1: string; // '2026-01-01' → lấy tháng 1

  @IsDateString()
  month2: string; // '2026-02-01' → lấy tháng 2
}

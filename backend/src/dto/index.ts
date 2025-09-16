// Data Transfer Objects for request/response validation

import { IsString, IsOptional, IsDateString, IsArray, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class TimeSeriesQueryDto {
  @IsString()
  parameter: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}

export class DataSummaryResponseDto {
  @IsNumber()
  totalRecords: number;

  @IsArray()
  dateRange: {
    start: string;
    end: string;
  };
}

export class UploadResultResponseDto {
  @IsString()
  message: string;

  @IsArray()
  summary: {
    totalRows: number;
    validRows: number;
    invalidRows: number;
  };

  @IsOptional()
  @IsString()
  errorFileDownloadUrl?: string;
}

export class ParametersResponseDto {
  @IsArray()
  @IsString({ each: true })
  parameters: string[];
}

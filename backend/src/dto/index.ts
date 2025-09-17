import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";


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

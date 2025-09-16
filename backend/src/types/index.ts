// Centralized type definitions for the backend

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface RowValidationResult {
  rowIndex: number;
  originalRow: any;
  isValid: boolean;
  errors: string[];
  processedData?: any;
}

export interface ValidationSummary {
  totalRows: number;
  validRows: number;
  invalidRows: number;
  errorRows: RowValidationResult[];
  errorCSV?: string;
}

export interface DataSummary {
  totalRecords: number;
  dateRange: {
    start: string;
    end: string;
  };
}

export interface UploadResult {
  message: string;
  summary: {
    totalRows: number;
    validRows: number;
    invalidRows: number;
  };
  errorFileDownloadUrl?: string;
}

export interface ParameterMapping {
  [key: string]: string;
}

export interface NumericFieldMapping {
  key: string;
  field: string;
}

export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export interface AppConfig {
  port: number;
  nodeEnv: string;
  corsOrigin: string;
}

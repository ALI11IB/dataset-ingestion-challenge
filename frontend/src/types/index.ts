export interface ReadingsDataPoint {
  id: number;
  date: string;
  time: string;
  [key: string]: any;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
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

export interface ParameterStatistics {
  period: string;
  avg_value: string;
  min_value: string;
  max_value: string;
  count: string;
}

export interface ParametersResponse {
  parameters: string[];
}

export interface ChartDataPoint {
  timestamp: string;
  value: number;
  date: string;
  time: string;
}

export interface ParameterInfo {
  key: string;
  displayName: string;
  unit: string;
}

export type ChartType = "line" | "bar" | "area";

export interface ChartTabsProps {
  parameter: string;
  parameterDisplayName: string;
  parameterUnit: string;
  startDate?: string;
  endDate?: string;
}

export interface StatisticsChartProps {
  parameter: string;
  parameterDisplayName: string;
  parameterUnit: string;
  startDate?: string;
  endDate?: string;
  aggregation?: "hourly" | "daily" | "monthly";
}

export interface DataUploadProps {
  onDataUploaded: () => void;
}

export interface LayoutProps {
  children: React.ReactNode;
}

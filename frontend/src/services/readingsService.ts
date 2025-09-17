import axios from "axios";
import { 
  ReadingsDataPoint, 
  DataSummary, 
  UploadResult, 
  PaginatedResponse,
  ParameterStatistics,
  ParametersResponse
} from "../types";
import { API_BASE_URL } from "../constants";
import { apiCache } from "../utils/cache";

export class ReadingsService {
  private static api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
  });

  static async getAvailableParameters(): Promise<string[]> {
    const cacheKey = "available-parameters";
    const cached = apiCache.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      const response = await this.api.get<ParametersResponse>("/parameters");
      const parameters = response.data.parameters;
      apiCache.set(cacheKey, parameters, 600000);
      return parameters;
    } catch (error) {
      console.error("Error fetching available parameters:", error);
      throw error;
    }
  }

  static async getDataSummary(): Promise<DataSummary> {
    const cacheKey = "data-summary";
    const cached = apiCache.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      const response = await this.api.get("/summary");
      const summary = response.data;
      apiCache.set(cacheKey, summary, 300000);
      return summary;
    } catch (error) {
      console.error("Error fetching data summary:", error);
      throw error;
    }
  }

  static async getTimeSeriesData(
    parameter: string,
    startDate?: string,
    endDate?: string,
    page: number = 1,
    limit: number = 1000
  ): Promise<PaginatedResponse<ReadingsDataPoint>> {
    try {
      const params: Record<string, string | number> = { 
        parameter,
        page: page.toString(),
        limit: limit.toString()
      };
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await this.api.get<PaginatedResponse<ReadingsDataPoint>>("/data", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching time series data:", error);
      throw error;
    }
  }

  static async getParameterStatistics(
    parameter: string,
    startDate?: string,
    endDate?: string,
    aggregation: 'hourly' | 'daily' | 'monthly' = 'daily'
  ): Promise<ParameterStatistics[]> {
    try {
      const params: Record<string, string> = { aggregation };
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await this.api.get<ParameterStatistics[]>(`/statistics/${parameter}`, { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching parameter statistics:", error);
      throw error;
    }
  }

  static async uploadData(file: File): Promise<UploadResult> {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await this.api.post("/ingest", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error uploading data:", error);
      throw error;
    }
  }

  static downloadErrorFile(downloadUrl: string): void {
    const link = document.createElement('a');
    link.href = `http://localhost:3001${downloadUrl}`;
    link.download = 'validation_errors.csv';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

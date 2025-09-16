import axios from "axios";
import { ReadingsDataPoint, DataSummary, UploadResult } from "../types";
import { API_BASE_URL } from "../constants";

/**
 * Service class for handling air quality data API calls
 */
export class ReadingsService {
  private static api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
  });

  /**
   * Get list of available air quality parameters
   */
  static async getAvailableParameters(): Promise<string[]> {
    try {
      const response = await this.api.get("/parameters");
      return response.data;
    } catch (error) {
      console.error("Error fetching available parameters:", error);
      throw error;
    }
  }

  /**
   * Get summary statistics of the dataset
   */
  static async getDataSummary(): Promise<DataSummary> {
    try {
      const response = await this.api.get("/summary");
      return response.data;
    } catch (error) {
      console.error("Error fetching data summary:", error);
      throw error;
    }
  }

  /**
   * Get time series data for a specific parameter
   */
  static async getTimeSeriesData(
    parameter: string,
    startDate?: string,
    endDate?: string
  ): Promise<ReadingsDataPoint[]> {
    try {
      const params: Record<string, string> = { parameter };
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await this.api.get("/data", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching time series data:", error);
      throw error;
    }
  }

  /**
   * Upload CSV file with air quality data
   */
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

  /**
   * Download error file for validation issues
   */
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

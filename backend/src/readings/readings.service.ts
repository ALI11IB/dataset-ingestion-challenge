import { Injectable, Logger, Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual } from "typeorm";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import { Readings } from "./readings.entity";
import { ValidationService } from "./validation.service";
import { ValidationSummary, RowValidationResult, DataSummary } from "../types";
import {
  PARAMETER_MAPPING,
  AVAILABLE_PARAMETERS,
  BATCH_SIZE,
  CSV_SEPARATOR,
} from "../constants";
import * as fs from "fs";
import * as csv from "csv-parser";

/**
 * Service for managing air quality readings data
 */
@Injectable()
export class ReadingsService {
  private readonly logger = new Logger(ReadingsService.name);

  constructor(
    @InjectRepository(Readings)
    private readingsRepository: Repository<Readings>,
    private validationService: ValidationService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  /**
   * Ingest CSV data file and process with validation
   */
  async ingestData(
    filePath: string
  ): Promise<ValidationSummary & { errorCSV?: string }> {
    const results: any[] = [];

    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv({ separator: CSV_SEPARATOR }))
        .on("data", (data) => results.push(data))
        .on("end", async () => {
          try {
            const validationSummary =
              await this.processDataWithValidation(results);
            resolve(validationSummary);
          } catch (error) {
            reject(error);
          }
        })
        .on("error", reject);
    });
  }

  /**
   * Process data with validation and save to database
   */
  private async processDataWithValidation(
    results: any[]
  ): Promise<ValidationSummary & { errorCSV?: string }> {
    const validReadings: Readings[] = [];
    const errorRows: RowValidationResult[] = [];

    for (let i = 0; i < results.length; i++) {
      const row = results[i];
      const validationResult = this.validationService.validateRow(row, i + 2); // +2 for header and 0-based index

      if (validationResult.isValid && validationResult.processedData) {
        const reading = new Readings();
        Object.assign(reading, validationResult.processedData);
        validReadings.push(reading);
      } else {
        errorRows.push(validationResult);
      }
    }

    let savedCount = 0;
    if (validReadings.length > 0) {
      for (let i = 0; i < validReadings.length; i += BATCH_SIZE) {
        const batch = validReadings.slice(i, i + BATCH_SIZE);
        await this.readingsRepository.save(batch);
        savedCount += batch.length;
      }
    }

    let errorCSV: string | undefined;
    if (errorRows.length > 0) {
      errorCSV = this.validationService.generateErrorCSV(errorRows);
    }

    return {
      totalRows: results.length,
      validRows: savedCount,
      invalidRows: errorRows.length,
      errorRows,
      errorCSV,
    };
  }

  /**
   * Get time series data for a specific parameter with pagination
   */
  async getTimeSeriesData(
    parameter: string,
    startDate?: string,
    endDate?: string,
    page: number = 1,
    limit: number = 1000
  ): Promise<{
    data: Readings[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const startTime = Date.now();

    const queryBuilder = this.readingsRepository.createQueryBuilder("readings");

    if (startDate && endDate) {
      queryBuilder.where("readings.date BETWEEN :startDate AND :endDate", {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      });
    }

    const selectFields = ["readings.id", "readings.date", "readings.time"];

    if (PARAMETER_MAPPING[parameter]) {
      selectFields.push(PARAMETER_MAPPING[parameter]);
    }

    queryBuilder.select(selectFields);
    queryBuilder.orderBy("readings.date", "ASC");
    queryBuilder.addOrderBy("readings.time", "ASC");

    const offset = (page - 1) * limit;
    queryBuilder.skip(offset).take(limit);

    const countQuery = this.readingsRepository.createQueryBuilder("readings");

    if (startDate && endDate) {
      countQuery.where("readings.date BETWEEN :startDate AND :endDate", {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      });
    }

    const totalResult = await countQuery.getCount();
    const total = totalResult;

    const data = await queryBuilder.getMany();

    const executionTime = Date.now() - startTime;
    this.logger.log(
      `Time series query for ${parameter} took ${executionTime}ms, returned ${data.length} records`
    );

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get list of available parameters
   */
  async getAvailableParameters(): Promise<string[]> {
    return AVAILABLE_PARAMETERS;
  }

  /**
   * Get data summary statistics with caching
   */
  async getDataSummary(): Promise<DataSummary> {
    const cacheKey = "data-summary";
    const cached = await this.cacheManager.get<DataSummary>(cacheKey);

    if (cached) {
      this.logger.log("Returning cached data summary");
      return cached;
    }

    const totalRecords = await this.readingsRepository.count();
    const dateRange = await this.readingsRepository
      .createQueryBuilder("readings")
      .select("MIN(readings.date)", "minDate")
      .addSelect("MAX(readings.date)", "maxDate")
      .getRawOne();

    const summary = {
      totalRecords,
      dateRange: {
        start: dateRange.minDate,
        end: dateRange.maxDate,
      },
    };

    await this.cacheManager.set(cacheKey, summary, 600);

    return summary;
  }

  /**
   * Get aggregated statistics for a parameter
   */
  async getParameterStatistics(
    parameter: string,
    startDate?: string,
    endDate?: string,
    aggregationType: "hourly" | "daily" | "monthly" = "daily"
  ): Promise<any[]> {
    const startTime = Date.now();

    if (!PARAMETER_MAPPING[parameter]) {
      throw new Error(`Invalid parameter: ${parameter}`);
    }

    const queryBuilder = this.readingsRepository.createQueryBuilder("readings");

    if (startDate && endDate) {
      queryBuilder.where("readings.date BETWEEN :startDate AND :endDate", {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      });
    }

    let dateTrunc: string;
    switch (aggregationType) {
      case "hourly":
        dateTrunc = "DATE_TRUNC('hour', readings.date)";
        break;
      case "daily":
        dateTrunc = "DATE_TRUNC('day', readings.date)";
        break;
      case "monthly":
        dateTrunc = "DATE_TRUNC('month', readings.date)";
        break;
      default:
        dateTrunc = "DATE_TRUNC('day', readings.date)";
    }

    const parameterField = PARAMETER_MAPPING[parameter].replace(
      "readings.",
      ""
    );

    queryBuilder
      .select([
        `${dateTrunc} as period`,
        `AVG(readings.${parameterField}) as avg_value`,
        `MIN(readings.${parameterField}) as min_value`,
        `MAX(readings.${parameterField}) as max_value`,
        `COUNT(readings.${parameterField}) as count`,
      ])
      .where(`readings.${parameterField} IS NOT NULL`)
      .groupBy("period")
      .orderBy("period", "ASC");

    const result = await queryBuilder.getRawMany();

    const executionTime = Date.now() - startTime;
    this.logger.log(
      `Statistics query for ${parameter} (${aggregationType}) took ${executionTime}ms, returned ${result.length} records`
    );

    return result;
  }
}

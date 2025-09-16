import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Readings } from './readings.entity';
import { ValidationService } from './validation.service';
import { ValidationSummary, RowValidationResult, DataSummary } from '../types';
import { PARAMETER_MAPPING, AVAILABLE_PARAMETERS, BATCH_SIZE, CSV_SEPARATOR } from '../constants';
import * as fs from 'fs';
import * as csv from 'csv-parser';

/**
 * Service for managing air quality readings data
 */
@Injectable()
export class ReadingsService {
  constructor(
    @InjectRepository(Readings)
    private readingsRepository: Repository<Readings>,
    private validationService: ValidationService,
  ) {}

  /**
   * Ingest CSV data file and process with validation
   */
  async ingestData(filePath: string): Promise<ValidationSummary & { errorCSV?: string }> {
    const results: any[] = [];
    
    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv({ separator: CSV_SEPARATOR }))
        .on('data', (data) => results.push(data))
        .on('end', async () => {
          try {
            const validationSummary = await this.processDataWithValidation(results);
            resolve(validationSummary);
          } catch (error) {
            reject(error);
          }
        })
        .on('error', reject);
    });
  }

  /**
   * Process data with validation and save to database
   */
  private async processDataWithValidation(results: any[]): Promise<ValidationSummary & { errorCSV?: string }> {
    const validReadings: Readings[] = [];
    const errorRows: RowValidationResult[] = [];

    // First pass: validate all rows
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

    // Save valid readings to database in batches
    let savedCount = 0;
    if (validReadings.length > 0) {
      for (let i = 0; i < validReadings.length; i += BATCH_SIZE) {
        const batch = validReadings.slice(i, i + BATCH_SIZE);
        await this.readingsRepository.save(batch);
        savedCount += batch.length;
      }
    }

    // Generate error CSV if there are errors
    let errorCSV: string | undefined;
    if (errorRows.length > 0) {
      errorCSV = this.validationService.generateErrorCSV(errorRows);
    }

    return {
      totalRows: results.length,
      validRows: savedCount,
      invalidRows: errorRows.length,
      errorRows,
      errorCSV
    };
  }

  /**
   * Get time series data for a specific parameter
   */
  async getTimeSeriesData(parameter: string, startDate?: string, endDate?: string): Promise<Readings[]> {
    const queryBuilder = this.readingsRepository.createQueryBuilder('readings');
    
    // Add date range filter if provided
    if (startDate && endDate) {
      queryBuilder.where('readings.date BETWEEN :startDate AND :endDate', {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      });
    }
    
    // Select only the requested parameter and timestamp fields
    const selectFields = ['readings.id', 'readings.date', 'readings.time'];
    
    // Add the requested parameter field
    if (PARAMETER_MAPPING[parameter]) {
      selectFields.push(PARAMETER_MAPPING[parameter]);
    }
    
    queryBuilder.select(selectFields);
    queryBuilder.orderBy('readings.date', 'ASC');
    queryBuilder.addOrderBy('readings.time', 'ASC');
    
    return queryBuilder.getMany();
  }

  /**
   * Get list of available parameters
   */
  async getAvailableParameters(): Promise<string[]> {
    return AVAILABLE_PARAMETERS;
  }

  /**
   * Get data summary statistics
   */
  async getDataSummary(): Promise<DataSummary> {
    const totalRecords = await this.readingsRepository.count();
    const dateRange = await this.readingsRepository
      .createQueryBuilder('readings')
      .select('MIN(readings.date)', 'minDate')
      .addSelect('MAX(readings.date)', 'maxDate')
      .getRawOne();
    
    return {
      totalRecords,
      dateRange: {
        start: dateRange.minDate,
        end: dateRange.maxDate,
      },
    };
  }
}


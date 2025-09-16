import { Injectable } from '@nestjs/common';
import { ValidationResult, RowValidationResult, ValidationSummary } from '../types';
import { NUMERIC_FIELD_MAPPING } from '../constants';
import { parseNumericValue, parseDate, parseTime, createErrorCSV } from '../utils';

/**
 * Service for validating air quality data rows
 */
@Injectable()
export class ValidationService {
  
  /**
   * Validate a single row of air quality data
   */
  validateRow(row: any, rowIndex: number): RowValidationResult {
    const errors: string[] = [];
    let processedData: any = {};

    // Validate Date
    const date = parseDate(row.Date);
    if (!date) {
      errors.push('Date is required and must be in DD/MM/YYYY format');
    } else {
      processedData.date = date;
    }

    // Validate Time
    const time = parseTime(row.Time);
    if (!time) {
      errors.push('Time is required and must be in HH.MM.SS format');
    } else {
      processedData.time = time;
    }

    // Validate numeric fields
    NUMERIC_FIELD_MAPPING.forEach(({ key, field }) => {
      const value = parseNumericValue(row[key]);
      if (value !== null) {
        processedData[field] = value;
      }
      // Note: We don't add errors for missing numeric values as they're nullable
    });

    return {
      rowIndex,
      originalRow: row,
      isValid: errors.length === 0,
      errors,
      processedData: errors.length === 0 ? processedData : undefined
    };
  }

  /**
   * Generate error CSV content for validation failures
   */
  generateErrorCSV(errorRows: RowValidationResult[]): string {
    return createErrorCSV(errorRows);
  }
}

import { ParameterInfo } from '../types';
import { MAX_FILE_SIZE, REQUIRED_CSV_COLUMNS } from '../constants';

export const getParameterInfo = (param: string): ParameterInfo => {
  const parameterMap: Record<string, ParameterInfo> = {
    co: { key: 'co', displayName: 'Carbon Monoxide (CO)', unit: 'mg/m³' },
    nmhc: { key: 'nmhc', displayName: 'Non-Methanic Hydrocarbons (NMHC)', unit: 'mg/m³' },
    c6h6: { key: 'c6h6', displayName: 'Benzene (C6H6)', unit: 'mg/m³' },
    nox: { key: 'nox', displayName: 'Nitrogen Oxides (NOx)', unit: 'ppb' },
    no2: { key: 'no2', displayName: 'Nitrogen Dioxide (NO2)', unit: 'ppb' },
    pt08_s1_co: { key: 'pt08_s1_co', displayName: 'PT08.S1 (CO)', unit: 'ppb' },
    pt08_s2_nmhc: { key: 'pt08_s2_nmhc', displayName: 'PT08.S2 (NMHC)', unit: 'ppb' },
    pt08_s3_nox: { key: 'pt08_s3_nox', displayName: 'PT08.S3 (NOx)', unit: 'ppb' },
    pt08_s4_no2: { key: 'pt08_s4_no2', displayName: 'PT08.S4 (NO2)', unit: 'ppb' },
    pt08_s5_o3: { key: 'pt08_s5_o3', displayName: 'PT08.S5 (O3)', unit: 'ppb' },
    temperature: { key: 'temperature', displayName: 'Temperature', unit: '°C' },
    relative_humidity: { key: 'relative_humidity', displayName: 'Relative Humidity', unit: '%' },
    absolute_humidity: { key: 'absolute_humidity', displayName: 'Absolute Humidity', unit: 'g/m³' },
  };

  return parameterMap[param] || { key: param, displayName: param, unit: '' };
};

export const parseDate = (dateInput: string | Date): Date | null => {
  try {
    let date: Date;

    if (typeof dateInput === 'string') {
      if (dateInput.includes('/')) {
        const [day, month, year] = dateInput.split('/');
        date = new Date(`${year}-${month}-${day}`);
      } else {
        date = new Date(dateInput);
      }
    } else {
      date = new Date(dateInput);
    }

    if (isNaN(date.getTime())) {
      console.warn('Invalid date:', dateInput);
      return null;
    }

    return date;
  } catch (error) {
    console.warn('Error parsing date:', error, dateInput);
    return null;
  }
};

export const parseTime = (timeInput: string): string => {
  try {
    let timeStr = timeInput || '00:00:00';

    if (timeStr && !timeStr.includes(':')) {
      timeStr = timeStr.replace(/\./g, ':');
    }

    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
    if (!timeRegex.test(timeStr)) {
      console.warn('Invalid time format:', timeInput, 'Using default 00:00:00');
      return '00:00:00';
    }

    return timeStr;
  } catch (error) {
    console.warn('Error parsing time:', error, timeInput);
    return '00:00:00';
  }
};

export const createTimestamp = (date: string | Date, time: string): Date | null => {
  try {
    const parsedDate = parseDate(date);
    if (!parsedDate) return null;

    const parsedTime = parseTime(time);
    const dateStr = parsedDate.toISOString().split('T')[0];
    const finalDateTime = new Date(`${dateStr}T${parsedTime}`);

    if (isNaN(finalDateTime.getTime())) {
      console.warn('Invalid datetime combination:', dateStr, parsedTime);
      return null;
    }

    return finalDateTime;
  } catch (error) {
    console.warn('Error creating timestamp:', error);
    return null;
  }
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const validateCSVFile = (file: File): string[] => {
  const errors: string[] = [];

  if (!file.type.includes("csv") && !file.name.endsWith(".csv")) {
    errors.push("File must be a CSV file");
  }

  if (file.size > MAX_FILE_SIZE) {
    errors.push("File size must be less than 10MB");
  }

  if (file.size === 0) {
    errors.push("File cannot be empty");
  }

  return errors;
};

export const validateCSVContent = async (file: File): Promise<string[]> => {
  const errors: string[] = [];
  
  try {
    const text = await file.text();
    
    if (!text.trim()) {
      errors.push("CSV file is empty or contains no data");
      return errors;
    }

    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length < 2) {
      errors.push("CSV file must contain at least a header row and one data row");
    }

    const firstLine = lines[0];
    if (!firstLine.includes(';') && !firstLine.includes(',')) {
      errors.push("File does not appear to be a valid CSV format (no semicolon or comma separators found)");
    }

    const hasRequiredColumns = REQUIRED_CSV_COLUMNS.some(col => 
      firstLine.includes(col)
    );
    
    if (!hasRequiredColumns) {
      errors.push("CSV file should contain air quality data columns (Date, Time, CO(GT), NO2(GT), PT08.S5(O3))");
    }

  } catch (error) {
    errors.push("Unable to read file content. Please check if the file is corrupted.");
  }

  return errors;
};

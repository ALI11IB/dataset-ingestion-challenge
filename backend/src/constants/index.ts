// Application constants

export const PARAMETER_MAPPING: Record<string, string> = {
  'co': 'readings.co',
  'nmhc': 'readings.nmhc',
  'c6h6': 'readings.c6h6',
  'nox': 'readings.nox',
  'no2': 'readings.no2',
  'pt08_s1_co': 'readings.pt08S1Co',
  'pt08_s2_nmhc': 'readings.pt08S2Nmhc',
  'pt08_s3_nox': 'readings.pt08S3Nox',
  'pt08_s4_no2': 'readings.pt08S4No2',
  'pt08_s5_o3': 'readings.pt08S5O3',
  'temperature': 'readings.temperature',
  'relative_humidity': 'readings.relativeHumidity',
  'absolute_humidity': 'readings.absoluteHumidity',
};

export const AVAILABLE_PARAMETERS = [
  'co',
  'nmhc', 
  'c6h6',
  'nox',
  'no2',
  'pt08_s1_co',
  'pt08_s2_nmhc',
  'pt08_s3_nox',
  'pt08_s4_no2',
  'pt08_s5_o3',
  'temperature',
  'relative_humidity',
  'absolute_humidity',
];

export const NUMERIC_FIELD_MAPPING = [
  { key: 'CO(GT)', field: 'co' },
  { key: 'PT08.S1(CO)', field: 'pt08S1Co' },
  { key: 'NMHC(GT)', field: 'nmhc' },
  { key: 'C6H6(GT)', field: 'c6h6' },
  { key: 'PT08.S2(NMHC)', field: 'pt08S2Nmhc' },
  { key: 'NOx(GT)', field: 'nox' },
  { key: 'PT08.S3(NOx)', field: 'pt08S3Nox' },
  { key: 'NO2(GT)', field: 'no2' },
  { key: 'PT08.S4(NO2)', field: 'pt08S4No2' },
  { key: 'PT08.S5(O3)', field: 'pt08S5O3' },
  { key: 'T', field: 'temperature' },
  { key: 'RH', field: 'relativeHumidity' },
  { key: 'AH', field: 'absoluteHumidity' }
];

export const CSV_HEADERS = [
  'Row_Index', 'Date', 'Time', 'CO(GT)', 'PT08.S1(CO)', 'NMHC(GT)', 
  'C6H6(GT)', 'PT08.S2(NMHC)', 'NOx(GT)', 'PT08.S3(NOx)', 'NO2(GT)', 
  'PT08.S4(NO2)', 'PT08.S5(O3)', 'T', 'RH', 'AH', 'Error_Reasons'
];

export const BATCH_SIZE = 1000;
export const ERROR_FILE_CLEANUP_DELAY = 5 * 60 * 1000; // 5 minutes
export const MISSING_VALUE_INDICATOR = '-200';
export const CSV_SEPARATOR = ';';

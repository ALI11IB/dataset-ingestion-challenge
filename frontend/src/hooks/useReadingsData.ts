import { useState, useEffect, useCallback } from 'react';
import { ReadingsService } from '../services/readingsService';
import { ReadingsDataPoint, DataSummary } from '../types';

export interface UseReadingsDataOptions {
  parameter?: string;
  startDate?: string;
  endDate?: string;
  autoFetch?: boolean;
}

export interface UseReadingsDataReturn {
  data: ReadingsDataPoint[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useReadingsData = (options: UseReadingsDataOptions = {}): UseReadingsDataReturn => {
  const { parameter, startDate, endDate, autoFetch = true } = options;
  
  const [data, setData] = useState<ReadingsDataPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!parameter) return;
    
    try {
      setLoading(true);
      setError(null);
      const result = await ReadingsService.getTimeSeriesData(parameter, startDate, endDate);
      setData(result);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch data');
      console.error('Error fetching readings data:', err);
    } finally {
      setLoading(false);
    }
  }, [parameter, startDate, endDate]);

  useEffect(() => {
    if (autoFetch && parameter) {
      fetchData();
    }
  }, [fetchData, autoFetch, parameter]);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
};

export const useDataSummary = () => {
  const [summary, setSummary] = useState<DataSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await ReadingsService.getDataSummary();
      setSummary(result);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch data summary');
      console.error('Error fetching data summary:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return {
    summary,
    loading,
    error,
    refetch: fetchSummary
  };
};

export const useAvailableParameters = () => {
  const [parameters, setParameters] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchParameters = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await ReadingsService.getAvailableParameters();
      setParameters(result);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch available parameters');
      console.error('Error fetching available parameters:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchParameters();
  }, [fetchParameters]);

  return {
    parameters,
    loading,
    error,
    refetch: fetchParameters
  };
};

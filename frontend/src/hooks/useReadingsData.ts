import { useState, useEffect, useCallback } from 'react';
import { ReadingsService } from '../services/readingsService';
import { 
  ReadingsDataPoint, 
  DataSummary, 
  PaginatedResponse,
  ParameterStatistics
} from '../types';

export interface UseReadingsDataOptions {
  parameter?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  autoFetch?: boolean;
}

export interface UseReadingsDataReturn {
  data: ReadingsDataPoint[];
  pagination: {
    total: number;
    page: number;
    totalPages: number;
  };
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
}

export const useReadingsData = (options: UseReadingsDataOptions = {}): UseReadingsDataReturn => {
  const { 
    parameter, 
    startDate, 
    endDate, 
    page: initialPage = 1, 
    limit: initialLimit = 1000, 
    autoFetch = true 
  } = options;
  
  const [data, setData] = useState<ReadingsDataPoint[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: initialPage,
    totalPages: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (page: number = pagination.page, limit: number = initialLimit) => {
    if (!parameter) return;
    
    try {
      setLoading(true);
      setError(null);
      const result = await ReadingsService.getTimeSeriesData(parameter, startDate, endDate, page, limit);
      setData(result.data);
      setPagination({
        total: result.total,
        page: result.page,
        totalPages: result.totalPages
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch data');
      console.error('Error fetching readings data:', err);
    } finally {
      setLoading(false);
    }
  }, [parameter, startDate, endDate, pagination.page, initialLimit]);

  const setPage = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, page }));
    fetchData(page, initialLimit);
  }, [fetchData, initialLimit]);

  const setLimit = useCallback((limit: number) => {
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchData(1, limit);
  }, [fetchData]);

  useEffect(() => {
    if (autoFetch && parameter) {
      fetchData();
    }
  }, [fetchData, autoFetch, parameter]);

  return {
    data,
    pagination,
    loading,
    error,
    refetch: () => fetchData(),
    setPage,
    setLimit
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

export const useParameterStatistics = (
  parameter?: string,
  startDate?: string,
  endDate?: string,
  aggregation: 'hourly' | 'daily' | 'monthly' = 'daily'
) => {
  const [statistics, setStatistics] = useState<ParameterStatistics[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStatistics = useCallback(async () => {
    if (!parameter) return;
    
    try {
      setLoading(true);
      setError(null);
      const result = await ReadingsService.getParameterStatistics(parameter, startDate, endDate, aggregation);
      setStatistics(result);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch parameter statistics');
      console.error('Error fetching parameter statistics:', err);
    } finally {
      setLoading(false);
    }
  }, [parameter, startDate, endDate, aggregation]);

  useEffect(() => {
    if (parameter) {
      fetchStatistics();
    }
  }, [fetchStatistics, parameter]);

  return {
    statistics,
    loading,
    error,
    refetch: fetchStatistics
  };
};


import React, { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useReadingsData } from "../../hooks/useReadingsData";
import { ChartProps, ChartDataPoint, ChartType } from "../../types";
import { createTimestamp } from "../../utils";
import Pagination from "../Pagination";

const Chart: React.FC<ChartProps> = ({
  parameter,
  parameterDisplayName,
  parameterUnit,
  startDate,
  endDate,
}) => {
  const [activeTab, setActiveTab] = useState<ChartType>("line");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(1000);

  const {
    data: rawData,
    pagination,
    loading,
    error,
    setPage: setPageFromHook,
    setLimit: setLimitFromHook,
  } = useReadingsData({
    parameter,
    startDate,
    endDate,
    page,
    limit,
    autoFetch: !!parameter,
  });

  const chartData = useMemo((): ChartDataPoint[] => {
    const processed = rawData
      .map((point) => {
        const value = point[parameter];
        if (value === null || value === undefined || value === '') return null;

        const numericValue = Number(value);
        if (isNaN(numericValue)) return null;

        const timestamp = createTimestamp(point.date, point.time);
        if (!timestamp) return null;

        return {
          timestamp,
          value: numericValue,
          date: point.date,
          time: point.time,
        };
      })
      .filter((point): point is ChartDataPoint => point !== null)
      .sort(
        (a, b) =>
          a.timestamp.getTime() - b.timestamp.getTime()
      );
    
    return processed;
  }, [rawData, parameter]);

  const stats = useMemo(() => {
    if (chartData.length === 0) return null;

    const values = chartData.map((d) => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const avg = values.reduce((sum, val) => sum + val, 0) / values.length;

    return { min, max, avg, count: chartData.length };
  }, [chartData]);

  const yAxisDomain = useMemo(() => {
    if (chartData.length === 0) {
      return ['auto', 'auto'];
    }
    
    const values = chartData.map((d) => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    
    if (min === max) {
      return [Math.max(0, min - 1), max + 1];
    }
    
    const padding = (max - min) * 0.1;
    return [Math.max(0, min - padding), max + padding];
  }, [chartData]);

  const formatTooltipValue = (value: number) => {
    return `${value.toFixed(2)} ${parameterUnit}`;
  };

  const formatXAxisLabel = (tickItem: Date) => {
    return tickItem.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderChart = () => {
    const tooltipContent = ({ active, payload, label }: any) => {
      if (active && payload && payload.length) {
        return (
          <div className="chart-tooltip">
            <p className="tooltip-label">{formatXAxisLabel(label)}</p>
            <p className="tooltip-value">
              {parameterDisplayName}: {formatTooltipValue(payload[0].value)}
            </p>
          </div>
        );
      }
      return null;
    };

    switch (activeTab) {
      case "line":
        return (
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={formatXAxisLabel}
              tick={{ fontSize: 12 }}
              type="category"
            />
            <YAxis 
              tick={{ fontSize: 12 }} 
              domain={yAxisDomain}
              label={{ value: parameterUnit, angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={tooltipContent} />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#667eea"
              strokeWidth={2}
              dot={{ r: 4 }}
              name={parameterDisplayName}
            />
          </LineChart>
        );

      case "bar":
        return (
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={formatXAxisLabel}
              tick={{ fontSize: 12 }}
              type="category"
            />
            <YAxis 
              tick={{ fontSize: 12 }} 
              domain={yAxisDomain}
              label={{ value: parameterUnit, angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={tooltipContent} />
            <Legend />
            <Bar dataKey="value" fill="#82ca9d" name={parameterDisplayName} />
          </BarChart>
        );

      case "area":
        return (
          <AreaChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={formatXAxisLabel}
              tick={{ fontSize: 12 }}
              type="category"
            />
            <YAxis 
              tick={{ fontSize: 12 }} 
              domain={yAxisDomain}
              label={{ value: parameterUnit, angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={tooltipContent} />
            <Legend />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#ffc658"
              fill="#ffc658"
              fillOpacity={0.6}
              name={parameterDisplayName}
            />
          </AreaChart>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="chart-container">
        <div className="chart-loading-overlay">
          <div className="loading-container">
            <div className="spinner"></div>
            <p className="loading-text">Loading chart data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chart-container">
        <div className="chart-error">
          <h4>Error Loading Chart</h4>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="chart-container">
        <div className="chart-no-data">
          <h4>No Data Available</h4>
          <p>No data available for the selected parameters</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3 className="chart-title">
          {parameterDisplayName} ({parameterUnit})
        </h3>
        <div className="chart-controls">
          <div className="chart-type-selector">
            <button
              className={`chart-type-button ${
                activeTab === "line" ? "active" : ""
              }`}
              onClick={() => setActiveTab("line")}
            >
              Line
            </button>
            <button
              className={`chart-type-button ${
                activeTab === "bar" ? "active" : ""
              }`}
              onClick={() => setActiveTab("bar")}
            >
              Bar
            </button>
            <button
              className={`chart-type-button ${
                activeTab === "area" ? "active" : ""
              }`}
              onClick={() => setActiveTab("area")}
            >
              Area
            </button>
          </div>
        </div>
      </div>

      <div className="chart-content">
        <ResponsiveContainer width="100%" height={400}>
          {renderChart() as any}
        </ResponsiveContainer>
      </div>

      {stats && (
        <div className="chart-info">
          <div className="chart-stats">
            <div className="chart-stat">
              <div className="chart-stat-value">
                {stats.count.toLocaleString()}
              </div>
              <div className="chart-stat-label">Data Points (Current Page)</div>
            </div>
            <div className="chart-stat">
              <div className="chart-stat-value">{stats.min.toFixed(2)}</div>
              <div className="chart-stat-label">Min Value</div>
            </div>
            <div className="chart-stat">
              <div className="chart-stat-value">{stats.max.toFixed(2)}</div>
              <div className="chart-stat-label">Max Value</div>
            </div>
            <div className="chart-stat">
              <div className="chart-stat-value">{stats.avg.toFixed(2)}</div>
              <div className="chart-stat-label">Average</div>
            </div>
            <div className="chart-stat">
              <div className="chart-stat-value">
                {pagination.total.toLocaleString()}
              </div>
              <div className="chart-stat-label">Total Records</div>
            </div>
          </div>
          <div>
            Date range: {formatXAxisLabel(chartData[0].timestamp)} -{" "}
            {formatXAxisLabel(chartData[chartData.length - 1].timestamp)}
          </div>
        </div>
      )}

      {pagination.totalPages > 1 && (
        <div className="chart-pagination">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            totalItems={pagination.total}
            itemsPerPage={limit}
            onPageChange={(newPage) => {
              setPage(newPage);
              setPageFromHook(newPage);
            }}
            onItemsPerPageChange={(newLimit) => {
              setLimit(newLimit);
              setLimitFromHook(newLimit);
            }}
            loading={loading}
          />
        </div>
      )}
    </div>
  );
};

export default Chart;

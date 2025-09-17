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
import { useParameterStatistics } from "../hooks/useReadingsData";
import { StatisticsChartProps, ChartType } from "../types";

const StatisticsChart: React.FC<StatisticsChartProps> = ({
  parameter,
  parameterDisplayName,
  parameterUnit,
  startDate,
  endDate,
  aggregation = "daily",
}) => {
  const [activeTab, setActiveTab] = useState<ChartType>("line");

  const { statistics, loading, error } = useParameterStatistics(
    parameter,
    startDate,
    endDate,
    aggregation
  );

  const chartData = useMemo(() => {
    return statistics.map((stat) => ({
      period: new Date(stat.period).toLocaleDateString(),
      avgValue: parseFloat(stat.avg_value),
      minValue: parseFloat(stat.min_value),
      maxValue: parseFloat(stat.max_value),
      count: parseInt(stat.count),
      fullPeriod: stat.period,
    }));
  }, [statistics]);

  const formatTooltipValue = (value: number) => {
    return `${value.toFixed(2)} ${parameterUnit}`;
  };

  const renderChart = () => {
    const tooltipContent = ({ active, payload, label }: any) => {
      if (active && payload && payload.length) {
        return (
          <div className="chart-tooltip">
            <p className="tooltip-label">{label}</p>
            {payload.map((entry: any, index: number) => (
              <p
                key={index}
                className="tooltip-value"
                style={{ color: entry.color }}
              >
                {entry.name}: {formatTooltipValue(entry.value)}
              </p>
            ))}
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
            <XAxis dataKey="period" tick={{ fontSize: 12 }} />
            <YAxis 
              tick={{ fontSize: 12 }} 
              label={{ value: parameterUnit, angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={tooltipContent} />
            <Legend />
            <Line
              type="monotone"
              dataKey="avgValue"
              stroke="#667eea"
              strokeWidth={2}
              dot={{ r: 4 }}
              name="Average"
            />
            <Line
              type="monotone"
              dataKey="minValue"
              stroke="#ff6b6b"
              strokeWidth={1}
              strokeDasharray="5 5"
              name="Minimum"
            />
            <Line
              type="monotone"
              dataKey="maxValue"
              stroke="#4ecdc4"
              strokeWidth={1}
              strokeDasharray="5 5"
              name="Maximum"
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
            <XAxis dataKey="period" tick={{ fontSize: 12 }} />
            <YAxis 
              tick={{ fontSize: 12 }} 
              label={{ value: parameterUnit, angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={tooltipContent} />
            <Legend />
            <Bar dataKey="avgValue" fill="#82ca9d" name="Average" />
            <Bar dataKey="minValue" fill="#ffc658" name="Minimum" />
            <Bar dataKey="maxValue" fill="#8884d8" name="Maximum" />
          </BarChart>
        );

      case "area":
        return (
          <AreaChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" tick={{ fontSize: 12 }} />
            <YAxis 
              tick={{ fontSize: 12 }} 
              label={{ value: parameterUnit, angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={tooltipContent} />
            <Legend />
            <Area
              type="monotone"
              dataKey="avgValue"
              stroke="#ffc658"
              fill="#ffc658"
              fillOpacity={0.6}
              name="Average"
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
            <p className="loading-text">Loading statistics...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chart-container">
        <div className="chart-error">
          <h4>Error Loading Statistics</h4>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="chart-container">
        <div className="chart-no-data">
          <h4>No Statistics Available</h4>
          <p>No statistics available for the selected parameters</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3 className="chart-title">
          {parameterDisplayName} Statistics ({aggregation})
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

      <div className="chart-info">
        <div className="chart-stats">
          <div className="chart-stat">
            <div className="chart-stat-value">{chartData.length}</div>
            <div className="chart-stat-label">Periods</div>
          </div>
          <div className="chart-stat">
            <div className="chart-stat-value">
              {Math.round(
                chartData.reduce((sum, d) => sum + d.count, 0) /
                  chartData.length
              )}
            </div>
            <div className="chart-stat-label">Avg Data Points</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsChart;

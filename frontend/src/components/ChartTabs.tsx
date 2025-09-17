import React, { useState, useEffect } from "react";
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
import { ReadingsService } from "../services/readingsService";
import { ChartTabsProps, ChartDataPoint, ChartType } from "../types";
import { createTimestamp } from "../utils";

const ChartTabs: React.FC<ChartTabsProps> = ({
  parameter,
  parameterDisplayName,
  parameterUnit,
  startDate,
  endDate,
}) => {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ChartType>("line");

  useEffect(() => {
    loadChartData();
  }, [parameter, startDate, endDate]);

  const loadChartData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await ReadingsService.getTimeSeriesData(
        parameter,
        startDate,
        endDate
      );

      const chartData: ChartDataPoint[] = response.data
        .map((point: any) => {
          const value = point[parameter];
          if (value === null || value === undefined) return null;

          const timestamp = createTimestamp(point.date, point.time);
          if (!timestamp) return null;

          return {
            timestamp,
            value: Number(value),
            date: point.date,
            time: point.time,
          };
        })
        .filter((point): point is ChartDataPoint => point !== null)
        .sort(
          (a: ChartDataPoint, b: ChartDataPoint) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );

      setData(chartData);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load chart data");
      console.error("Error loading chart data:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatTooltipValue = (value: number) => {
    return `${value.toFixed(2)} ${parameterUnit}`;
  };

  const formatXAxisLabel = (tickItem: string) => {
    const date = new Date(tickItem);
    return date.toLocaleDateString();
  };

  const renderChart = () => {
    const commonProps = {
      data: data,
      margin: {
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      },
    };

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
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={formatXAxisLabel}
              tick={{ fontSize: 12 }}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip content={tooltipContent} />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#8884d8"
              strokeWidth={2}
              dot={{ r: 4 }}
              name={parameterDisplayName}
            />
          </LineChart>
        );

      case "bar":
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={formatXAxisLabel}
              tick={{ fontSize: 12 }}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip content={tooltipContent} />
            <Legend />
            <Bar dataKey="value" fill="#82ca9d" name={parameterDisplayName} />
          </BarChart>
        );

      case "area":
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={formatXAxisLabel}
              tick={{ fontSize: 12 }}
            />
            <YAxis tick={{ fontSize: 12 }} />
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
        <div className="chart-loading">Loading chart data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chart-container">
        <div className="chart-error">Error: {error}</div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="chart-container">
        <div className="chart-no-data">
          No data available for the selected parameters
        </div>
      </div>
    );
  }

  return (
    <div className="chart-tabs-container">
      <div className="chart-tabs-header">
        <h3>
          {parameterDisplayName} ({parameterUnit})
        </h3>
        <div className="chart-tabs">
          <button
            className={`tab-button ${activeTab === "line" ? "active" : ""}`}
            onClick={() => setActiveTab("line")}
          >
            📈 Line Chart
          </button>
          <button
            className={`tab-button ${activeTab === "bar" ? "active" : ""}`}
            onClick={() => setActiveTab("bar")}
          >
            📊 Bar Chart
          </button>
          <button
            className={`tab-button ${activeTab === "area" ? "active" : ""}`}
            onClick={() => setActiveTab("area")}
          >
            📉 Area Chart
          </button>
        </div>
      </div>

      <div className="chart-content">
        <ResponsiveContainer width="100%" height={400}>
          {renderChart() as any}
        </ResponsiveContainer>
      </div>

      <div className="chart-info">
        <p>
          Data points: {data.length} | Date range:{" "}
          {data.length > 0
            ? `${formatXAxisLabel(data[0].timestamp)} - ${formatXAxisLabel(
                data[data.length - 1].timestamp
              )}`
            : "N/A"}
        </p>
      </div>
    </div>
  );
};

export default ChartTabs;

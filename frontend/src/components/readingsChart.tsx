import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ReadingsService } from "../services/readingsService";
import { ChartDataPoint } from "../types";
import { createTimestamp } from "../utils";

interface ReadingsChartProps {
  parameter: string;
  parameterDisplayName: string;
  parameterUnit: string;
  startDate?: string;
  endDate?: string;
}

/**
 * Simple line chart component for air quality data visualization
 */
const ReadingsChart: React.FC<ReadingsChartProps> = ({
  parameter,
  parameterDisplayName,
  parameterUnit,
  startDate,
  endDate,
}) => {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

      // Transform data for chart display
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

  if (loading) {
    return (
      <div className="chart-container">
        <div className="loading">Loading chart data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chart-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="chart-container">
        <div className="loading">
          No data available for the selected parameters
        </div>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <h3 className="chart-title">
        {parameterDisplayName} ({parameterUnit})
      </h3>
      <p style={{ textAlign: "center", marginBottom: "1rem", color: "#666" }}>
        Data points: {data.length.toLocaleString()}
      </p>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 60,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="timestamp"
            tickFormatter={formatXAxisLabel}
            angle={-45}
            textAnchor="end"
            height={80}
            stroke="#666"
          />
          <YAxis
            label={{ value: parameterUnit, angle: -90, position: "insideLeft" }}
            stroke="#666"
          />
          <Tooltip
            labelFormatter={(value) => {
              const date = new Date(value);
              return date.toLocaleString();
            }}
            formatter={(value: number) => [
              formatTooltipValue(value),
              parameterDisplayName,
            ]}
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #ccc",
              borderRadius: "6px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#667eea"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, stroke: "#667eea", strokeWidth: 2 }}
            name={parameterDisplayName}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ReadingsChart;

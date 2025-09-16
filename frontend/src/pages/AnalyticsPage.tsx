import React, { useState, useEffect } from 'react';
import { ReadingsService } from '../services/readingsService';
import ChartTabs from '../components/ChartTabs';
import { DataSummary } from '../types';

const AnalyticsPage: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<DataSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);
      const summary = await ReadingsService.getDataSummary();
      setAnalyticsData(summary);
    } catch (err) {
      setError(
        "Failed to load analytics data. Please make sure the backend is running."
      );
      console.error("Error loading analytics data:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Analytics</h1>
        <p>Detailed analysis and visualization of air quality trends</p>
      </div>

      {loading && <div className="loading">Loading analytics...</div>}

      {error && <div className="error">{error}</div>}

      {!loading && !error && (
        <>
          {analyticsData && (
            <div className="analytics-overview">
              <div className="overview-card">
                <h3>Data Overview</h3>
                <div className="overview-stats">
                  <div className="stat">
                    <span className="stat-label">Total Records:</span>
                    <span className="stat-value">{analyticsData.totalRecords.toLocaleString()}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Date Range:</span>
                    <span className="stat-value">
                      {new Date(analyticsData.dateRange.start).toLocaleDateString()} - 
                      {new Date(analyticsData.dateRange.end).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="analytics-content">
            <div className="chart-section">
              <h2>Air Quality Trends</h2>
              <p>Interactive charts showing pollutant levels over time</p>
              <div className="charts-grid">
                <div className="chart-container">
                  <ChartTabs 
                    parameter="co"
                    parameterDisplayName="Carbon Monoxide"
                    parameterUnit="mg/m³"
                  />
                </div>
                <div className="chart-container">
                  <ChartTabs 
                    parameter="no2"
                    parameterDisplayName="Nitrogen Dioxide"
                    parameterUnit="μg/m³"
                  />
                </div>
                <div className="chart-container">
                  <ChartTabs 
                    parameter="pt08_s5_o3"
                    parameterDisplayName="Ozone"
                    parameterUnit="μg/m³"
                  />
                </div>
                <div className="chart-container">
                  <ChartTabs 
                    parameter="temperature"
                    parameterDisplayName="Temperature"
                    parameterUnit="°C"
                  />
                </div>
              </div>
            </div>

            <div className="insights-section">
              <h2>Key Insights</h2>
              <div className="insights-grid">
                <div className="insight-card">
                  <h4>Pollution Patterns</h4>
                  <p>Analyze seasonal and daily patterns in air quality measurements</p>
                </div>
                <div className="insight-card">
                  <h4>Correlation Analysis</h4>
                  <p>Understand relationships between different pollutants</p>
                </div>
                <div className="insight-card">
                  <h4>Health Impact</h4>
                  <p>Assess air quality against health guidelines and standards</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AnalyticsPage;

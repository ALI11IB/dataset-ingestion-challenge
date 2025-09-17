import React, { useState, useEffect } from "react";
import Dashboard from "../components/Dashboard";
import { ReadingsService } from "../services/readingsService";
import { DataSummary } from "../types";

const DashboardPage: React.FC = () => {
  const [dataSummary, setDataSummary] = useState<DataSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDataSummary();
  }, []);

  const loadDataSummary = async () => {
    try {
      setLoading(true);
      setError(null);
      const summary = await ReadingsService.getDataSummary();
      setDataSummary(summary);
    } catch (err) {
      setError(
        "Failed to load data summary. Please make sure the backend is running."
      );
      console.error("Error loading data summary:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDataUploaded = () => {
    loadDataSummary();
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Overview of air quality data and key metrics</p>
      </div>

      {loading && <div className="loading">Loading dashboard...</div>}

      {error && <div className="error">{error}</div>}

      {!loading && !error && (
        <>
          {dataSummary && (
            <div className="summary-grid">
              <div className="summary-card">
                <div className="summary-icon">📊</div>
                <div className="summary-content">
                  <h3>Total Records</h3>
                  <p className="summary-value">
                    {dataSummary.totalRecords.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="summary-card">
                <div className="summary-icon">📅</div>
                <div className="summary-content">
                  <h3>Date Range</h3>
                  <p className="summary-value">
                    {new Date(dataSummary.dateRange.start).toLocaleDateString()}{" "}
                    - {new Date(dataSummary.dateRange.end).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          <Dashboard />
        </>
      )}
    </div>
  );
};

export default DashboardPage;

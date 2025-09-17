import React, { useState, useEffect } from "react";
import Chart from "./charts/Chart";
import StatisticsChart from "./StatisticsChart";
import { useAvailableParameters, useDataSummary } from "../hooks/useReadingsData";
import { getParameterInfo } from "../utils";

type DashboardTab = "timeseries" | "statistics";

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<DashboardTab>("timeseries");
  const [selectedParameter, setSelectedParameter] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [aggregation, setAggregation] = useState<
    "hourly" | "daily" | "monthly"
  >("daily");

  // Applied filters (used for API calls)
  const [appliedParameter, setAppliedParameter] = useState<string>("");
  const [appliedStartDate, setAppliedStartDate] = useState<string>("");
  const [appliedEndDate, setAppliedEndDate] = useState<string>("");
  const [appliedAggregation, setAppliedAggregation] = useState<
    "hourly" | "daily" | "monthly"
  >("daily");

  const {
    parameters,
    loading: parametersLoading,
    error: parametersError,
  } = useAvailableParameters();

  const {
    summary,
    loading: summaryLoading,
    error: summaryError,
  } = useDataSummary();

  useEffect(() => {
    if (parameters.length > 0 && !selectedParameter) {
      setSelectedParameter(parameters[0]);
      setAppliedParameter(parameters[0]); // Auto-apply first parameter for initial load
    }
  }, [parameters, selectedParameter]);

  useEffect(() => {
    if (summary && !startDate && !endDate) {
      const startDateStr = summary.dateRange.start.split('T')[0];
      const endDateStr = summary.dateRange.end.split('T')[0];
      setStartDate(startDateStr);
      setEndDate(endDateStr);
      setAppliedStartDate(startDateStr);
      setAppliedEndDate(endDateStr);
    }
  }, [summary, startDate, endDate]);

  if (parametersLoading) {
    return (
      <div className="dashboard">
        <div className="loading-container">
          <div className="spinner"></div>
          <p className="loading-text">Loading parameters...</p>
        </div>
      </div>
    );
  }

  if (parametersError) {
    return (
      <div className="dashboard">
        <div className="error">
          <h4>Error Loading Parameters</h4>
          <p>{parametersError}</p>
        </div>
      </div>
    );
  }

  const parameterInfo = appliedParameter
    ? getParameterInfo(appliedParameter)
    : null;

  const applyFilters = () => {
    setAppliedParameter(selectedParameter);
    setAppliedStartDate(startDate);
    setAppliedEndDate(endDate);
    setAppliedAggregation(aggregation);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "timeseries":
        return appliedParameter && parameterInfo ? (
          <Chart
            parameter={appliedParameter}
            parameterDisplayName={parameterInfo.displayName}
            parameterUnit={parameterInfo.unit}
            startDate={appliedStartDate || undefined}
            endDate={appliedEndDate || undefined}
          />
        ) : (
          <div className="no-selection">
            <p>Please select a parameter and click "Apply Filters" to view time series data.</p>
          </div>
        );

      case "statistics":
        return appliedParameter && parameterInfo ? (
          <StatisticsChart
            parameter={appliedParameter}
            parameterDisplayName={parameterInfo.displayName}
            parameterUnit={parameterInfo.unit}
            startDate={appliedStartDate || undefined}
            endDate={appliedEndDate || undefined}
            aggregation={appliedAggregation}
          />
        ) : (
          <div className="no-selection">
            <p>Please select a parameter and click "Apply Filters" to view statistics.</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="dashboard">
      <h2> Air Quality Data Analysis</h2>

      <div className="dashboard-tabs">
        <button
          className={`tab-button ${activeTab === "timeseries" ? "active" : ""}`}
          onClick={() => setActiveTab("timeseries")}
        >
          Time Series
        </button>
        <button
          className={`tab-button ${activeTab === "statistics" ? "active" : ""}`}
          onClick={() => setActiveTab("statistics")}
        >
          Statistics
        </button>
      </div>

      <div className="controls">
        <div className="control-group">
          <label htmlFor="parameter-select">Parameter</label>
          <select
            id="parameter-select"
            value={selectedParameter}
            onChange={(e) => setSelectedParameter(e.target.value)}
            disabled={parametersLoading}
          >
            {parameters.map((param) => {
              const info = getParameterInfo(param);
              return (
                <option key={param} value={param}>
                  {info.displayName}
                </option>
              );
            })}
          </select>
        </div>

        <div className="control-group">
          <label htmlFor="start-date">Start Date</label>
          <input
            id="start-date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className="control-group">
          <label htmlFor="end-date">End Date</label>
          <input
            id="end-date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>


        {activeTab === "statistics" && (
          <div className="control-group">
            <label htmlFor="aggregation-select">Aggregation</label>
            <select
              id="aggregation-select"
              value={aggregation}
              onChange={(e) =>
                setAggregation(e.target.value as "hourly" | "daily" | "monthly")
              }
            >
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        )}

        <div className="control-group">
          <button
            type="button"
            onClick={applyFilters}
            className="apply-filters-button"
            disabled={!selectedParameter}
          >
            Apply Filters
          </button>
        </div>
      </div>

      <div className="tab-content">{renderTabContent()}</div>
    </div>
  );
};

export default Dashboard;

import React, { useState } from "react";
import Chart from "./charts/Chart";
import { useAvailableParameters } from "../hooks/useReadingsData";
import { getParameterInfo } from "../utils";

const Dashboard: React.FC = () => {
  const [selectedParameter, setSelectedParameter] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const {
    parameters,
    loading: parametersLoading,
    error: parametersError,
  } = useAvailableParameters();

  // Set default parameter when available
  React.useEffect(() => {
    if (parameters.length > 0 && !selectedParameter) {
      setSelectedParameter(parameters[0]);
    }
  }, [parameters, selectedParameter]);

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

  const parameterInfo = selectedParameter
    ? getParameterInfo(selectedParameter)
    : null;

  return (
    <div className="dashboard">
      <h2>Air Quality Data Visualization</h2>

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
      </div>

      {selectedParameter && parameterInfo && (
        <Chart
          parameter={selectedParameter}
          parameterDisplayName={parameterInfo.displayName}
          parameterUnit={parameterInfo.unit}
          startDate={startDate || undefined}
          endDate={endDate || undefined}
        />
      )}
    </div>
  );
};

export default Dashboard;

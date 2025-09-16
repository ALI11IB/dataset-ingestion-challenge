import React, { useState, useEffect } from "react";
import ChartTabs from "./ChartTabs";
import { ReadingsService } from "../services/readingsService";
import { getParameterInfo } from "../utils";

/**
 * Dashboard component for air quality data visualization
 */
const Dashboard: React.FC = () => {
  const [availableParameters, setAvailableParameters] = useState<string[]>([]);
  const [selectedParameter, setSelectedParameter] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAvailableParameters();
  }, []);

  const loadAvailableParameters = async () => {
    try {
      setLoading(true);
      setError(null);
      const parameters = await ReadingsService.getAvailableParameters();
      setAvailableParameters(parameters);
      if (parameters.length > 0) {
        setSelectedParameter(parameters[0]);
      }
    } catch (err) {
      setError("Failed to load available parameters");
      console.error("Error loading parameters:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading">Loading parameters...</div>
      </div>
    );
  }

  const parameterInfo = selectedParameter ? getParameterInfo(selectedParameter) : null;

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
            disabled={loading}
          >
            {availableParameters.map((param) => {
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

      {error && <div className="error">{error}</div>}

      {selectedParameter && parameterInfo && (
        <ChartTabs
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

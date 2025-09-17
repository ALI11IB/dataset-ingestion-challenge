import React from "react";
import DataUpload from "../components/DataUpload";

const UploadPage: React.FC = () => {
  const handleDataUploaded = () => {};

  return (
    <div className="page">
      <div className="page-header">
        <h1>Upload Data</h1>
        <p>Upload new air quality data files to the system</p>
      </div>

      <div className="upload-section">
        <DataUpload onDataUploaded={handleDataUploaded} />
      </div>

      <div className="upload-info">
        <h3>Supported File Formats</h3>
        <ul>
          <li>CSV files with air quality measurements</li>
          <li>Required columns: Date, Time, CO(GT), NO2(GT), PT08.S5(O3)</li>
          <li>File format: Semicolon-separated values (;)</li>
          <li>Maximum file size: 10MB</li>
        </ul>

        <h3>Data Format Requirements</h3>
        <p>
          Your CSV file should contain columns for various air quality
          parameters. The file should use semicolons (;) as separators between
          values. The system will automatically detect and process the data once
          uploaded.
        </p>
      </div>
    </div>
  );
};

export default UploadPage;

import React, { useState } from "react";
import { toast } from "react-toastify";
import { ReadingsService } from "../services/readingsService";
import { DataUploadProps, UploadResult } from "../types";
import { validateCSVFile, validateCSVContent, formatFileSize } from "../utils";

/**
 * Component for uploading air quality data files
 */
const DataUpload: React.FC<DataUploadProps> = ({ onDataUploaded }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    
    if (!selectedFile) {
      setFile(null);
      setValidationErrors([]);
      return;
    }

    // Validate file format and size
    const basicErrors = validateCSVFile(selectedFile);
    
    if (basicErrors.length > 0) {
      setValidationErrors(basicErrors);
      setFile(null);
      basicErrors.forEach(error => toast.error(error));
      return;
    }

    // Validate CSV content
    const contentErrors = await validateCSVContent(selectedFile);
    
    if (contentErrors.length > 0) {
      setValidationErrors(contentErrors);
      setFile(null);
      contentErrors.forEach(error => toast.error(error));
      return;
    }

    setFile(selectedFile);
    setValidationErrors([]);
    toast.success("File validated successfully! Ready to upload.");
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }

    // Re-validate file before upload
    const errors = validateCSVFile(file);
    if (errors.length > 0) {
      errors.forEach(error => toast.error(error));
      return;
    }

    try {
      setUploading(true);
      setValidationErrors([]);

      const result = await ReadingsService.uploadData(file);
      setUploadResult(result);
      
      const { totalRows, validRows, invalidRows } = result.summary;
      
      // Show appropriate success/warning messages
      if (validRows > 0) {
        toast.success(`Successfully processed ${validRows} valid records!`);
        onDataUploaded();
      }
      
      if (invalidRows > 0) {
        toast.warning(`${invalidRows} rows had validation errors.`);
        toast.info("Click the download link below to get the error details.");
      }
      
      toast.info(`Total: ${totalRows} | Valid: ${validRows} | Invalid: ${invalidRows}`);
      
      // Reset file input
      setFile(null);
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to upload data";
      toast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-section">
      <h3>Upload Air Quality Data</h3>
      <p>Upload a CSV file containing air quality measurements</p>

      <div className="file-input">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          id="file-upload"
          disabled={uploading}
        />
        <label htmlFor="file-upload" className={uploading ? "disabled" : ""}>
          {file ? file.name : "Choose CSV File"}
        </label>
      </div>

      {validationErrors.length > 0 && (
        <div className="validation-errors">
          <h4>Validation Errors:</h4>
          <ul>
            {validationErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {file && !validationErrors.length && (
        <div className="file-info">
          <p><strong>File:</strong> {file.name}</p>
          <p><strong>Size:</strong> {formatFileSize(file.size)}</p>
          <p><strong>Type:</strong> {file.type || "text/csv"}</p>
        </div>
      )}

      {file && !validationErrors.length && (
        <button 
          className="btn" 
          onClick={handleUpload} 
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload Data"}
        </button>
      )}

      {uploading && (
        <div className="upload-progress">
          <p>Uploading your data... Please wait.</p>
        </div>
      )}

      {uploadResult && (
        <div className="upload-results">
          <h4>Upload Results</h4>
          <div className="results-summary">
            <div className="summary-item">
              <span className="label">Total Rows:</span>
              <span className="value">{uploadResult.summary.totalRows}</span>
            </div>
            <div className="summary-item">
              <span className="label">Valid Rows:</span>
              <span className="value success">{uploadResult.summary.validRows}</span>
            </div>
            <div className="summary-item">
              <span className="label">Invalid Rows:</span>
              <span className="value error">{uploadResult.summary.invalidRows}</span>
            </div>
          </div>
          
          {uploadResult.errorFileDownloadUrl && (
            <div className="error-download">
              <p>Some rows had validation errors. Download the error file to see details:</p>
              <button 
                className="btn btn-secondary"
                onClick={() => ReadingsService.downloadErrorFile(uploadResult.errorFileDownloadUrl!)}
              >
                📥 Download Error File
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DataUpload;

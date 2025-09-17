import React, { useState, useCallback } from "react";
import { toast } from "react-toastify";
import { ReadingsService } from "../services/readingsService";
import { DataUploadProps, UploadResult } from "../types";
import { validateCSVFile, validateCSVContent, formatFileSize } from "../utils";

const DataUpload: React.FC<DataUploadProps> = ({ onDataUploaded }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = useCallback(async (selectedFile: File) => {
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
      basicErrors.forEach((error) => toast.error(error));
      return;
    }

    // Validate CSV content
    const contentErrors = await validateCSVContent(selectedFile);

    if (contentErrors.length > 0) {
      setValidationErrors(contentErrors);
      setFile(null);
      contentErrors.forEach((error) => toast.error(error));
      return;
    }

    setFile(selectedFile);
    setValidationErrors([]);
    toast.success("File validated successfully! Ready to upload.");
  }, []);

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      handleFileChange(selectedFile);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFileChange(e.dataTransfer.files[0]);
      }
    },
    [handleFileChange]
  );

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }

    // Re-validate file before upload
    const errors = validateCSVFile(file);
    if (errors.length > 0) {
      errors.forEach((error) => toast.error(error));
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

      toast.info(
        `Total: ${totalRows} | Valid: ${validRows} | Invalid: ${invalidRows}`
      );

      // Reset file input
      setFile(null);
      const fileInput = document.getElementById(
        "file-upload"
      ) as HTMLInputElement;
      if (fileInput) {
        fileInput.value = "";
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to upload data";
      toast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setValidationErrors([]);
    setUploadResult(null);
    const fileInput = document.getElementById(
      "file-upload"
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  return (
    <div className="upload-section">
      <h3>Upload Air Quality Data</h3>
      <p>Upload a CSV file containing air quality measurements</p>

      <div
        className={`file-drop-zone ${dragActive ? "drag-active" : ""} ${
          file ? "has-file" : ""
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".csv"
          onChange={handleFileInputChange}
          id="file-upload"
          disabled={uploading}
        />
        <label htmlFor="file-upload" className={uploading ? "disabled" : ""}>
          {file ? (
            <div className="file-selected">
              <span className="file-icon"></span>
              <div className="file-details">
                <div className="file-name">{file.name}</div>
                <div className="file-size">{formatFileSize(file.size)}</div>
              </div>
            </div>
          ) : (
            <div className="file-placeholder">
              <span className="upload-icon"></span>
              <div className="upload-text">
                <strong>Click to select</strong> or drag and drop your CSV file
                here
              </div>
              <div className="upload-hint">Maximum file size: 10MB</div>
            </div>
          )}
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
        <div className="upload-actions">
          <button
            className="btn btn-primary"
            onClick={handleUpload}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Upload Data"}
          </button>
          <button
            className="btn btn-secondary"
            onClick={resetUpload}
            disabled={uploading}
          >
            Cancel
          </button>
        </div>
      )}

      {uploading && (
        <div className="upload-progress">
          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>
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
              <span className="value success">
                {uploadResult.summary.validRows}
              </span>
            </div>
            <div className="summary-item">
              <span className="label">Invalid Rows:</span>
              <span className="value error">
                {uploadResult.summary.invalidRows}
              </span>
            </div>
          </div>

          {uploadResult.errorFileDownloadUrl && (
            <div className="error-download">
              <p>
                Some rows had validation errors. Download the error file to see
                details:
              </p>
              <button
                className="btn btn-secondary"
                onClick={() =>
                  ReadingsService.downloadErrorFile(
                    uploadResult.errorFileDownloadUrl!
                  )
                }
              >
                Download Error File
              </button>
            </div>
          )}

          <div className="upload-actions">
            <button className="btn btn-primary" onClick={resetUpload}>
              Upload Another File
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataUpload;

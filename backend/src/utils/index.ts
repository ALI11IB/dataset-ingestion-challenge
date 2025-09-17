import { MISSING_VALUE_INDICATOR } from "../constants";

/**
 * Parse numeric value from CSV string
 */
export const parseNumericValue = (value: string): number | null => {
  if (!value || value.trim() === "" || value === MISSING_VALUE_INDICATOR) {
    return null;
  }

  const normalizedValue = value.replace(",", ".");
  const parsed = parseFloat(normalizedValue);

  return isNaN(parsed) ? null : parsed;
};

/**
 * Parse date from DD/MM/YYYY format
 */
export const parseDate = (dateString: string): Date | null => {
  if (!dateString || dateString.trim() === "") {
    return null;
  }

  try {
    const [day, month, year] = dateString.split("/");
    if (!day || !month || !year) {
      return null;
    }

    const date = new Date(`${year}-${month}-${day}`);
    return isNaN(date.getTime()) ? null : date;
  } catch (error) {
    return null;
  }
};

/**
 * Parse time from HH.MM.SS format to HH:MM:SS
 */
export const parseTime = (timeString: string): string | null => {
  if (!timeString || timeString.trim() === "") {
    return null;
  }

  try {
    const formattedTime = timeString.replace(/\./g, ":");
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;

    return timeRegex.test(formattedTime) ? formattedTime : null;
  } catch (error) {
    return null;
  }
};

/**
 * Generate random filename for uploaded files
 */
export const generateRandomFilename = (originalName: string): string => {
  const randomName = Array(32)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join("");

  const extension = originalName.split(".").pop();
  return `${randomName}.${extension}`;
};

/**
 * Validate CSV file type
 */
export const isValidCSVFile = (file: Express.Multer.File): boolean => {
  return file.mimetype === "text/csv" || file.originalname.endsWith(".csv");
};

/**
 * Create error CSV content
 */
export const createErrorCSV = (errorRows: any[]): string => {
  if (errorRows.length === 0) {
    return "";
  }

  const headers = [
    "Row_Index",
    "Date",
    "Time",
    "CO(GT)",
    "PT08.S1(CO)",
    "NMHC(GT)",
    "C6H6(GT)",
    "PT08.S2(NMHC)",
    "NOx(GT)",
    "PT08.S3(NOx)",
    "NO2(GT)",
    "PT08.S4(NO2)",
    "PT08.S5(O3)",
    "T",
    "RH",
    "AH",
    "Error_Reasons",
  ];

  const csvRows = errorRows.map((row) => {
    const values = [
      row.rowIndex.toString(),
      row.originalRow.Date || "",
      row.originalRow.Time || "",
      row.originalRow["CO(GT)"] || "",
      row.originalRow["PT08.S1(CO)"] || "",
      row.originalRow["NMHC(GT)"] || "",
      row.originalRow["C6H6(GT)"] || "",
      row.originalRow["PT08.S2(NMHC)"] || "",
      row.originalRow["NOx(GT)"] || "",
      row.originalRow["PT08.S3(NOx)"] || "",
      row.originalRow["NO2(GT)"] || "",
      row.originalRow["PT08.S4(NO2)"] || "",
      row.originalRow["PT08.S5(O3)"] || "",
      row.originalRow["T"] || "",
      row.originalRow["RH"] || "",
      row.originalRow["AH"] || "",
      `"${row.errors.join("; ")}"`,
    ];
    return values.join(";");
  });

  return [headers.join(";"), ...csvRows].join("\n");
};


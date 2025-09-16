// Application constants

export const API_BASE_URL = "http://localhost:3001/api/readings";

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const REQUIRED_CSV_COLUMNS = [
  'Date', 
  'Time', 
  'CO(GT)', 
  'NO2(GT)', 
  'PT08.S5(O3)'
];

export const CHART_COLORS = {
  primary: '#667eea',
  secondary: '#764ba2',
  success: '#28a745',
  warning: '#ffc107',
  danger: '#dc3545',
  info: '#17a2b8',
  light: '#f8f9fa',
  dark: '#343a40'
} as const;

export const TOAST_CONFIG = {
  position: "top-right" as const,
  autoClose: 5000,
  hideProgressBar: false,
  newestOnTop: false,
  closeOnClick: true,
  rtl: false,
  pauseOnFocusLoss: true,
  draggable: true,
  pauseOnHover: true,
  theme: "light" as const
};

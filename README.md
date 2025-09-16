# Air Quality Data Analysis Dashboard

A full-stack web application for analyzing and visualizing air quality data from Italian monitoring stations. This application provides an interactive dashboard to explore time series data with filtering capabilities.

## Features

### Backend (NestJS + PostgreSQL)
- **Data Ingestion**: REST API endpoint to upload and process CSV files
- **Database Storage**: PostgreSQL database with optimized schema for air quality data
- **Time Series API**: Endpoints to fetch data by parameter and date range
- **Data Validation**: Input validation and error handling

### Frontend (React + TypeScript)
- **Interactive Dashboard**: Modern, responsive UI for data visualization
- **Parameter Selection**: Choose from 13 different air quality parameters
- **Date Range Filtering**: Filter data by custom date ranges
- **Interactive Charts**: Real-time charts using Recharts library
- **Data Upload**: File upload interface for CSV data ingestion

## Dataset

The application processes air quality data containing 9,358 hourly records collected from March 2004 to February 2005. The dataset includes:

- **Date/Time**: Timestamps for each record
- **CO (mg/m³)**: Carbon monoxide concentration
- **Non-Methanic Hydrocarbons (NMHC)**: Concentration levels
- **Benzene (mg/m³)**: Benzene concentration
- **NOx (ppb)**: Total nitrogen oxides
- **NO2 (ppb)**: Nitrogen dioxide levels
- **Sensor Readings**: Various metal oxide chemical sensor values
- **Environmental Data**: Temperature, relative humidity, absolute humidity

## Tech Stack

### Backend
- **Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Language**: TypeScript
- **File Processing**: CSV parser with European decimal format support

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Charts**: Recharts
- **HTTP Client**: Axios
- **Build Tool**: Webpack
- **Styling**: CSS3 with modern design

## Prerequisites

Before running the application, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** (v8 or higher)
- **PostgreSQL** (v12 or higher)

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd air-quality-dashboard
```

### 2. Database Setup

1. Install and start PostgreSQL
2. Create a database named `air_quality`:

```sql
CREATE DATABASE air_quality;
```

3. Update database credentials in `backend/config.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=air_quality
```

### 3. Backend Setup

```bash
cd backend
npm install
```

### 4. Frontend Setup

```bash
cd ../frontend
npm install
```

## Running the Application

### 1. Start the Backend

```bash
cd backend
npm run start:dev
```

The backend will start on `http://localhost:3001`

### 2. Start the Frontend

```bash
cd frontend
npm start
```

The frontend will start on `http://localhost:3000`

### 3. Upload Data

1. Open the application in your browser at `http://localhost:3000`
2. Use the "Upload Air Quality Data" section to upload the `AirQualityUCI.csv` file
3. Wait for the data ingestion to complete
4. Start exploring the data using the dashboard

## API Endpoints

### Data Ingestion
- `POST /api/air-quality/ingest` - Upload CSV file for data ingestion

### Data Retrieval
- `GET /api/air-quality/parameters` - Get available parameters
- `GET /api/air-quality/summary` - Get data summary (total records, date range)
- `GET /api/air-quality/data?parameter={param}&startDate={date}&endDate={date}` - Get time series data

### Example API Usage

```bash
# Get available parameters
curl http://localhost:3001/api/air-quality/parameters

# Get CO data for a specific date range
curl "http://localhost:3001/api/air-quality/data?parameter=co&startDate=2004-03-10&endDate=2004-03-15"

# Get data summary
curl http://localhost:3001/api/air-quality/summary
```

## Available Parameters

The application supports visualization of the following parameters:

- **CO**: Carbon Monoxide (mg/m³)
- **NMHC**: Non-Methanic Hydrocarbons (mg/m³)
- **C6H6**: Benzene (mg/m³)
- **NOx**: Nitrogen Oxides (ppb)
- **NO2**: Nitrogen Dioxide (ppb)
- **PT08.S1 (CO)**: Metal oxide sensor 1 (ppb)
- **PT08.S2 (NMHC)**: Metal oxide sensor 2 (ppb)
- **PT08.S3 (NOx)**: Metal oxide sensor 3 (ppb)
- **PT08.S4 (NO2)**: Metal oxide sensor 4 (ppb)
- **PT08.S5 (O3)**: Metal oxide sensor 5 (ppb)
- **Temperature**: Ambient temperature (°C)
- **Relative Humidity**: Relative humidity (%)
- **Absolute Humidity**: Absolute humidity (g/m³)

## Project Structure

```
air-quality-dashboard/
├── backend/
│   ├── src/
│   │   ├── air-quality/
│   │   │   ├── air-quality.controller.ts
│   │   │   ├── air-quality.entity.ts
│   │   │   ├── air-quality.module.ts
│   │   │   └── air-quality.service.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── uploads/
│   ├── package.json
│   ├── tsconfig.json
│   └── config.env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AirQualityChart.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   └── DataUpload.tsx
│   │   ├── services/
│   │   │   └── airQualityService.ts
│   │   ├── App.tsx
│   │   ├── App.css
│   │   ├── index.tsx
│   │   └── index.css
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── webpack.config.js
├── AirQualityUCI.csv
└── README.md
```

## Development

### Backend Development

```bash
cd backend
npm run start:dev  # Start with hot reload
npm run build      # Build for production
```

### Frontend Development

```bash
cd frontend
npm start          # Start development server
npm run build      # Build for production
```

## Data Processing

The application handles European CSV format with:
- Semicolon (`;`) as delimiter
- Comma (`,`) as decimal separator
- Automatic conversion to standard numeric format
- Null value handling for missing data points

## Performance Considerations

- **Batch Processing**: Data is saved in batches of 1000 records to optimize memory usage
- **Database Indexing**: Automatic indexing on date fields for fast queries
- **Chart Optimization**: Data is filtered and sorted on the backend before sending to frontend
- **Responsive Design**: Mobile-friendly interface with adaptive layouts

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify PostgreSQL is running
   - Check database credentials in `config.env`
   - Ensure database `air_quality` exists

2. **CORS Errors**
   - Backend CORS is configured for `http://localhost:3000`
   - Ensure frontend is running on the correct port

3. **File Upload Issues**
   - Ensure CSV file format matches expected structure
   - Check file size limits (default: no limit set)

4. **Chart Not Loading**
   - Verify data has been uploaded successfully
   - Check browser console for API errors
   - Ensure selected date range contains data

### Logs

- Backend logs are displayed in the terminal where `npm run start:dev` is running
- Frontend errors are shown in browser console and application UI

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For issues and questions, please check the troubleshooting section or create an issue in the repository.


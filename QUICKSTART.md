# Quick Start Guide

## Prerequisites
- Node.js (v16+)
- PostgreSQL (v12+)
- npm (v8+)

## 1. Database Setup
```bash
# Create PostgreSQL database
createdb air_quality
```

## 2. Backend Setup
```bash
cd backend
npm install
npm run start:dev
```

## 3. Frontend Setup (in new terminal)
```bash
cd frontend
npm install
npm start
```

## 4. Upload Data
1. Open http://localhost:3000
2. Upload the `AirQualityUCI.csv` file
3. Wait for ingestion to complete

## 5. Explore Data
- Select parameters from dropdown
- Set date ranges
- View interactive charts

## Alternative: Command Line Data Ingestion
```bash
cd backend
npm run ingest
```

## Troubleshooting
- **Backend not starting**: Check PostgreSQL is running and database exists
- **CORS errors**: Ensure frontend runs on port 3000
- **Upload fails**: Check CSV file format and backend logs

## Default Ports
- Backend: http://localhost:3001
- Frontend: http://localhost:3000
- Database: localhost:5432


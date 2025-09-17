# Air Quality Data Analysis Application

A high-performance full-stack web application for analyzing and visualizing air quality data with interactive charts, advanced filtering, and efficient data ingestion capabilities.

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher)
- **PostgreSQL** (v12 or higher)
- **npm** or **yarn**

### Installation & Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd dataset-ingestion-challenge
   ```

2. **Backend Setup**

   ```bash
   cd backend
   npm install

   # Configure database (config.env is already set up)
   # Edit config.env with your PostgreSQL credentials if needed

   # Start the backend server
   npm run start:dev
   ```

3. **Frontend Setup**

   ```bash
   cd frontend
   npm install

   # Start the frontend development server
   npm start
   ```

4. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## 📁 Project Structure

```
dataset-ingestion-challenge/
├── backend/                 # Enhanced NestJS API server
│   ├── src/
│   │   ├── readings/       # Air quality data endpoints & services
│   │   ├── config/         # Database, app, and cache configuration
│   │   ├── constants/      # Application constants
│   │   ├── dto/            # Data transfer objects
│   │   ├── types/          # TypeScript type definitions
│   │   ├── utils/          # Utility functions
│   │   └── migrations/     # Database migrations
│   ├── uploads/            # CSV file uploads
│   ├── config.env          # Environment configuration
│   └── env.example         # Environment template
├── frontend/               # Enhanced React application
│   ├── src/
│   │   ├── components/     # Reusable UI components & charts
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service layer with caching
│   │   ├── hooks/          # Custom React hooks
│   │   ├── utils/          # Utility functions
│   │   ├── types/          # TypeScript type definitions
│   │   ├── constants/      # Application constants
│   │   └── styles/         # CSS styling
│   └── public/             # Static assets
└── uploads/                # Sample CSV datasets
```

## 🛠️ Available Scripts

### Backend

- `npm run start` - Start production server
- `npm run start:dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run test` - Run tests

### Frontend

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## 🔧 Configuration

### Backend Environment Variables

The backend uses `config.env` for configuration (already set up):

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=air_quality

# Application Configuration
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### Database Setup

1. Create a PostgreSQL database named `air_quality`
2. The application will automatically create tables and indexes on first run
3. Use the provided CSV files in the `uploads` directory for initial data ingestion

## 📊 Features

### Core Functionality
- **Data Upload**: Upload CSV files with comprehensive validation and error reporting
- **Interactive Charts**: Visualize data with line, bar, and area charts with pagination
- **Parameter Selection**: Filter data by specific air quality parameters
- **Date Range Filtering**: Analyze data within custom time periods with apply filters
- **Statistics Dashboard**: Monitor air quality trends with aggregated statistics
- **Pagination**: Efficient handling of large datasets with configurable page sizes

### Performance Features
- **Database Indexing**: Optimized queries with strategic database indexes
- **Connection Pooling**: Efficient database connection management
- **Caching**: In-memory caching for frequently accessed data
- **Client-side Caching**: Reduced API calls with intelligent caching
- **Compression**: Gzip compression for improved performance
- **Security**: Helmet.js security headers and CORS protection

## 🎯 API Endpoints

### Data Management

- `POST /api/readings/ingest` - Upload and process CSV data
- `GET /api/readings/parameters` - Get available parameters
- `GET /api/readings/summary` - Get data summary statistics
- `GET /api/readings/data` - Get paginated time series data with filtering
- `GET /api/readings/statistics/:parameter` - Get aggregated statistics for a parameter
- `GET /api/readings/download-error/:filename` - Download validation error files

## 🧪 Testing

### Backend Tests

```bash
cd backend
npm run test
npm run test:e2e
```

### Frontend Tests

```bash
cd frontend
npm test
```

## 🚀 Deployment

### Production Build

```bash
# Backend
cd backend
npm run build
npm run start:prod

# Frontend
cd frontend
npm run build
# Serve the build folder with a web server
```

### Docker (Optional)

```bash
# Build and run with Docker Compose
docker-compose up --build
```

## 📝 Data Format

The application expects CSV files with the following columns:

- `Date` - Date in YYYY-MM-DD format
- `Time` - Time in HH:MM:SS format
- `CO(GT)` - Carbon monoxide concentration
- `PT08.S1(CO)` - Metal oxide sensor 1
- `NMHC(GT)` - Non-methanic hydrocarbons
- `C6H6(GT)` - Benzene concentration
- `PT08.S2(NMHC)` - Metal oxide sensor 2
- `NOx(GT)` - Total nitrogen oxides
- `PT08.S3(NOx)` - Metal oxide sensor 3
- `NO2(GT)` - Nitrogen dioxide
- `PT08.S4(NO2)` - Metal oxide sensor 4
- `PT08.S5(O3)` - Metal oxide sensor 5
- `T` - Temperature
- `RH` - Relative humidity
- `AH` - Absolute humidity

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

**Database Connection Error**

- Verify PostgreSQL is running
- Check database credentials in `.env`
- Ensure database exists

**Port Already in Use**

- Change ports in configuration files
- Kill existing processes using the ports

**CSV Upload Fails**

- Verify CSV format matches expected columns
- Check file size limits
- Ensure proper date/time formatting

For more help, check the PROJECT_OVERVIEW.md file for detailed feature documentation.

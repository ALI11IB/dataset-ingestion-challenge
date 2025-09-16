const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

/**
 * Ingest CSV data into the air quality database
 */
async function ingestData() {
  try {
    console.log('🔄 Starting data ingestion...');
    
    const csvPath = path.join(__dirname, '../../AirQualityUCI.csv');
    
    if (!fs.existsSync(csvPath)) {
      console.error('❌ CSV file not found at:', csvPath);
      console.log('📁 Please ensure AirQualityUCI.csv is in the project root directory');
      return;
    }

    const formData = new FormData();
    formData.append('file', fs.createReadStream(csvPath));

    const response = await axios.post('http://localhost:3001/api/readings/ingest', formData, {
      headers: {
        ...formData.getHeaders(),
      },
      timeout: 60000, // 60 seconds timeout
    });

    console.log('✅ Data ingestion completed successfully!');
    console.log(`📊 Total rows: ${response.data.summary.totalRows}`);
    console.log(`✅ Valid rows: ${response.data.summary.validRows}`);
    console.log(`❌ Invalid rows: ${response.data.summary.invalidRows}`);
    console.log(`💾 Message: ${response.data.message}`);
    
    if (response.data.errorFileDownloadUrl) {
      console.log(`📥 Error file available at: http://localhost:3001${response.data.errorFileDownloadUrl}`);
    }
    
  } catch (error) {
    console.error('❌ Error during data ingestion:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else if (error.request) {
      console.error('No response received. Make sure the backend server is running on port 3001');
    } else {
      console.error('Error:', error.message);
    }
  }
}

/**
 * Check if backend server is running
 */
async function checkBackend() {
  try {
    await axios.get('http://localhost:3001/api/readings/summary', { timeout: 5000 });
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Main function to run the ingestion process
 */
async function main() {
  console.log('🔍 Checking if backend server is running...');
  
  const isBackendRunning = await checkBackend();
  
  if (!isBackendRunning) {
    console.log('❌ Backend server is not running on port 3001');
    console.log('📋 Please start the backend server first:');
    console.log('  cd backend');
    console.log('  npm run start:dev');
    return;
  }
  
  console.log('✅ Backend server is running');
  await ingestData();
}

main().catch((error) => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});


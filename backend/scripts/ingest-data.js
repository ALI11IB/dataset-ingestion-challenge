const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");

/**
 * Ingest CSV data into the air quality database
 */
async function ingestData() {
  try {
    const csvPath = path.join(__dirname, "../../AirQualityUCI.csv");

    if (!fs.existsSync(csvPath)) {
      console.error(" CSV file not found at:", csvPath);
      return;
    }

    const formData = new FormData();
    formData.append("file", fs.createReadStream(csvPath));

    const response = await axios.post(
      "http://localhost:3001/api/readings/ingest",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
        },
        timeout: 60000, // 60 seconds timeout
      }
    );

    console.log(" Data ingestion completed successfully!");

    if (response.data.errorFileDownloadUrl) {
      console.log(
        `📥 Error file available at: http://localhost:3001${response.data.errorFileDownloadUrl}`
      );
    }
  } catch (error) {
    console.error(" Error during data ingestion:");
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    } else if (error.request) {
      console.error("No response received.");
    } else {
      console.error("Error:", error.message);
    }
  }
}

async function checkBackend() {
  try {
    await axios.get("http://localhost:3001/api/readings/summary", {
      timeout: 5000,
    });
    return true;
  } catch (error) {
    return false;
  }
}

async function main() {
  const isBackendRunning = await checkBackend();

  if (!isBackendRunning) {
    console.log(" Backend server is not running on port 3001");
    return;
  }

  console.log("Backend server is running");
  await ingestData();
}

main().catch((error) => {
  console.error(" Script failed:", error);
  process.exit(1);
});

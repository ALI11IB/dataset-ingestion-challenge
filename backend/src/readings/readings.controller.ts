import {
  Controller,
  Get,
  Post,
  Query,
  Param,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Res,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ReadingsService } from "./readings.service";
import { diskStorage } from "multer";
import { extname, join } from "path";
import { Response } from "express";
import {
  DataSummaryResponseDto,
  UploadResultResponseDto,
  ParametersResponseDto,
} from "../dto";
import { AVAILABLE_PARAMETERS, ERROR_FILE_CLEANUP_DELAY } from "../constants";
import { generateRandomFilename, isValidCSVFile } from "../utils";
import * as fs from "fs";

/**
 * Controller for handling air quality readings API endpoints
 */
@Controller("readings")
export class ReadingsController {
  constructor(private readonly readingsService: ReadingsService) {}

  /**
   * Upload and ingest CSV data file
   */
  @Post("ingest")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: "./uploads",
        filename: (req, file, cb) => {
          cb(null, generateRandomFilename(file.originalname));
        },
      }),
      fileFilter: (req, file: any, cb) => {
        if (isValidCSVFile(file)) {
          cb(null, true);
        } else {
          cb(new BadRequestException("Only CSV files are allowed"), false);
        }
      },
    })
  )
  async ingestData(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response
  ): Promise<void> {
    if (!file) {
      throw new BadRequestException("No file uploaded");
    }

    const result = await this.readingsService.ingestData(file.path);

    const response: UploadResultResponseDto = {
      message:
        result.invalidRows > 0
          ? "Data processed with validation errors"
          : "Data processed successfully",
      summary: {
        totalRows: result.totalRows,
        validRows: result.validRows,
        invalidRows: result.invalidRows,
      },
    };

    if (result.errorCSV) {
      const errorFileName = `validation_errors_${Date.now()}.csv`;
      const errorFilePath = join("./uploads", errorFileName);

      if (!fs.existsSync("./uploads")) {
        fs.mkdirSync("./uploads", { recursive: true });
      }

      fs.writeFileSync(errorFilePath, result.errorCSV);

      response.errorFileDownloadUrl = `/api/readings/download-error/${errorFileName}`;
    }

    res.json(response);
  }

  /**
   * Get list of available parameters
   */
  @Get("parameters")
  async getAvailableParameters(): Promise<ParametersResponseDto> {
    const parameters = await this.readingsService.getAvailableParameters();
    return { parameters };
  }

  /**
   * Get data summary statistics
   */
  @Get("summary")
  async getDataSummary(): Promise<DataSummaryResponseDto> {
    return this.readingsService.getDataSummary();
  }

  /**
   * Get time series data for a specific parameter (alternative endpoint)
   */
  @Get("timeseries/:parameter")
  async getTimeSeriesDataByParam(
    @Param("parameter") parameter: string,
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string
  ) {
    if (!AVAILABLE_PARAMETERS.includes(parameter)) {
      throw new BadRequestException(`Invalid parameter: ${parameter}`);
    }

    return this.readingsService.getTimeSeriesData(
      parameter,
      startDate,
      endDate
    );
  }

  /**
   * Get time series data for a specific parameter with pagination
   */
  @Get("data")
  async getData(
    @Query("parameter") parameter: string,
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string,
    @Query("page") page?: string,
    @Query("limit") limit?: string
  ) {
    if (!parameter) {
      throw new BadRequestException("Parameter is required");
    }

    if (!AVAILABLE_PARAMETERS.includes(parameter)) {
      throw new BadRequestException(`Invalid parameter: ${parameter}`);
    }

    const pageNum = page ? parseInt(page) : 1;
    const limitNum = limit ? parseInt(limit) : 1000;

    if (pageNum < 1 || limitNum < 1 || limitNum > 10000) {
      throw new BadRequestException("Invalid pagination parameters");
    }

    return this.readingsService.getTimeSeriesData(
      parameter,
      startDate,
      endDate,
      pageNum,
      limitNum
    );
  }

  /**
   * Get aggregated statistics for a parameter
   */
  @Get("statistics/:parameter")
  async getParameterStatistics(
    @Param("parameter") parameter: string,
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string,
    @Query("aggregation") aggregation?: string
  ) {
    if (!AVAILABLE_PARAMETERS.includes(parameter)) {
      throw new BadRequestException(`Invalid parameter: ${parameter}`);
    }

    const aggregationType =
      (aggregation as "hourly" | "daily" | "monthly") || "daily";

    if (!["hourly", "daily", "monthly"].includes(aggregationType)) {
      throw new BadRequestException(
        "Invalid aggregation type. Must be: hourly, daily, or monthly"
      );
    }

    return this.readingsService.getParameterStatistics(
      parameter,
      startDate,
      endDate,
      aggregationType
    );
  }

  /**
   * Download error file for validation issues
   */
  @Get("download-error/:filename")
  async downloadErrorFile(
    @Param("filename") filename: string,
    @Res() res: Response
  ): Promise<void> {
    const filePath = join("./uploads", filename);

    if (!fs.existsSync(filePath)) {
      throw new BadRequestException("Error file not found or has expired");
    }

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    fileStream.on("end", () => {
      setTimeout(() => {
        try {
          fs.unlinkSync(filePath);
        } catch (error) {
          console.log("Error deleting temporary file:", error);
        }
      }, ERROR_FILE_CLEANUP_DELAY);
    });
  }
}

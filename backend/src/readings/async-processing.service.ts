import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Readings } from './readings.entity';

export interface ProcessingJob {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  totalRows: number;
  processedRows: number;
  startTime: Date;
  endTime?: Date;
  error?: string;
}

@Injectable()
export class AsyncProcessingService {
  private readonly logger = new Logger(AsyncProcessingService.name);
  private readonly jobs = new Map<string, ProcessingJob>();

  constructor(
    @InjectRepository(Readings)
    private readingsRepository: Repository<Readings>,
    private eventEmitter: EventEmitter2,
  ) {}

  /**
   * Start async data processing job
   */
  async startProcessingJob(
    jobId: string,
    data: any[],
    batchSize: number = 1000
  ): Promise<ProcessingJob> {
    const job: ProcessingJob = {
      id: jobId,
      status: 'pending',
      progress: 0,
      totalRows: data.length,
      processedRows: 0,
      startTime: new Date(),
    };

    this.jobs.set(jobId, job);

    // Process in background
    this.processDataAsync(jobId, data, batchSize).catch((error) => {
      this.logger.error(`Job ${jobId} failed:`, error);
      const job = this.jobs.get(jobId);
      if (job) {
        job.status = 'failed';
        job.error = error.message;
        job.endTime = new Date();
      }
    });

    return job;
  }

  /**
   * Get job status
   */
  getJobStatus(jobId: string): ProcessingJob | undefined {
    return this.jobs.get(jobId);
  }

  /**
   * Process data asynchronously
   */
  private async processDataAsync(
    jobId: string,
    data: any[],
    batchSize: number
  ): Promise<void> {
    const job = this.jobs.get(jobId);
    if (!job) return;

    job.status = 'processing';
    this.logger.log(`Starting async processing for job ${jobId}`);

    try {
      for (let i = 0; i < data.length; i += batchSize) {
        const batch = data.slice(i, i + batchSize);
        
        // Process batch (simulate processing time)
        await this.processBatch(batch);
        
        // Update progress
        job.processedRows = Math.min(i + batchSize, data.length);
        job.progress = Math.round((job.processedRows / job.totalRows) * 100);
        
        // Emit progress event
        this.eventEmitter.emit('job.progress', { jobId, progress: job.progress });
        
        // Small delay to prevent overwhelming the database
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      job.status = 'completed';
      job.endTime = new Date();
      this.logger.log(`Job ${jobId} completed successfully`);
      
      // Emit completion event
      this.eventEmitter.emit('job.completed', { jobId });
      
    } catch (error) {
      job.status = 'failed';
      job.error = error.message;
      job.endTime = new Date();
      this.logger.error(`Job ${jobId} failed:`, error);
      
      // Emit failure event
      this.eventEmitter.emit('job.failed', { jobId, error: error.message });
    }
  }

  /**
   * Process a batch of data
   */
  private async processBatch(batch: any[]): Promise<void> {
    // Simulate batch processing
    const readings = batch.map(item => {
      const reading = new Readings();
      // Map data to entity (simplified)
      Object.assign(reading, item);
      return reading;
    });

    await this.readingsRepository.save(readings);
  }

  /**
   * Clean up completed jobs older than specified time
   */
  cleanupOldJobs(maxAgeHours: number = 24): void {
    const cutoffTime = new Date(Date.now() - maxAgeHours * 60 * 60 * 1000);
    
    for (const [jobId, job] of this.jobs.entries()) {
      if (job.endTime && job.endTime < cutoffTime) {
        this.jobs.delete(jobId);
        this.logger.log(`Cleaned up old job: ${jobId}`);
      }
    }
  }
}

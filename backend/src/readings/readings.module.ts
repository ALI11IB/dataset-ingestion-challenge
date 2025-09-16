import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Readings } from './readings.entity';
import { ReadingsService } from './readings.service';
import { ReadingsController } from './readings.controller';
import { ValidationService } from './validation.service';

/**
 * Module for managing air quality readings
 */
@Module({
  imports: [TypeOrmModule.forFeature([Readings])],
  controllers: [ReadingsController],
  providers: [ReadingsService, ValidationService],
  exports: [ReadingsService],
})
export class ReadingsModule {}


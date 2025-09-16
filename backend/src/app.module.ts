import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ReadingsModule } from "./readings/readings.module";
import { getDatabaseConfig } from "./config/database.config";

/**
 * Main application module
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', 'config.env'],
    }),
    TypeOrmModule.forRoot(getDatabaseConfig()),
    ReadingsModule,
  ],
})
export class AppModule {}

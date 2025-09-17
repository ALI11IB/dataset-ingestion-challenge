import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CacheModule } from "@nestjs/cache-manager";
import { ReadingsModule } from "./readings/readings.module";
import { getDatabaseConfig } from "./config/database.config";
import { getCacheConfig } from "./config/cache.config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', 'config.env'],
    }),
    TypeOrmModule.forRoot(getDatabaseConfig()),
    CacheModule.register(getCacheConfig()),
    ReadingsModule,
  ],
})
export class AppModule {}

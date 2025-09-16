// Database configuration

import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DatabaseConfig } from '../types';

export const getDatabaseConfig = (): TypeOrmModuleOptions => {
  const config: DatabaseConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'air_quality',
  };

  return {
    type: 'postgres',
    ...config,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: process.env.NODE_ENV !== 'production',
    logging: process.env.NODE_ENV === 'development',
  };
};

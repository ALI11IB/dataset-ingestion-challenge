import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DatabaseConfig } from '../types';
import { CONNECTION_POOL_SIZE, CONNECTION_POOL_IDLE_TIMEOUT, QUERY_TIMEOUT } from '../constants';

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
    migrations: [__dirname + '/../migrations/*{.ts,.js}'],
    synchronize: process.env.NODE_ENV !== 'production',
    logging: process.env.NODE_ENV === 'development',
    extra: {
      max: CONNECTION_POOL_SIZE,
      idleTimeoutMillis: CONNECTION_POOL_IDLE_TIMEOUT,
      connectionTimeoutMillis: QUERY_TIMEOUT,
      acquireTimeoutMillis: QUERY_TIMEOUT,
      statement_timeout: QUERY_TIMEOUT,
      query_timeout: QUERY_TIMEOUT,
    },
    cache: {
      type: 'database',
      tableName: 'query_result_cache',
      duration: 30000,
    },
  };
};

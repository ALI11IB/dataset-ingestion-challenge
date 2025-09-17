import { AppConfig } from '../types';

export const getAppConfig = (): AppConfig => {
  return {
    port: parseInt(process.env.PORT) || 3001,
    nodeEnv: process.env.NODE_ENV || 'development',
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  };
};

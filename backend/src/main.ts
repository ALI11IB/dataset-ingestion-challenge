import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { getAppConfig } from './config/app.config';
import * as compression from 'compression';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = getAppConfig();
  const logger = new Logger('Bootstrap');
  
  app.use(helmet());
  app.use(compression());
  
  app.enableCors({
    origin: config.corsOrigin,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));
  
  app.setGlobalPrefix('api');
  
  await app.listen(config.port);
  logger.log(`🚀 Air Quality Monitor API is running on: http://localhost:${config.port}`);
  logger.log(`📊 Environment: ${config.nodeEnv}`);
  logger.log(`🌐 CORS enabled for: ${config.corsOrigin}`);
  logger.log(`🔒 Security headers enabled`);
  logger.log(`🗜️  Compression enabled`);
}

bootstrap().catch((error) => {
  console.error('❌ Failed to start application:', error);
  process.exit(1);
});


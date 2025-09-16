import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { getAppConfig } from './config/app.config';

/**
 * Bootstrap the application
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = getAppConfig();
  
  // Enable CORS for frontend communication
  app.enableCors({
    origin: config.corsOrigin,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  
  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));
  
  await app.listen(config.port);
  console.log(`🚀 Air Quality Monitor API is running on: http://localhost:${config.port}`);
  console.log(`📊 Environment: ${config.nodeEnv}`);
  console.log(`🌐 CORS enabled for: ${config.corsOrigin}`);
}

bootstrap().catch((error) => {
  console.error('❌ Failed to start application:', error);
  process.exit(1);
});


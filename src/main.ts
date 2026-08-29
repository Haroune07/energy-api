import { NestFactory } from '@nestjs/core';
import { VersioningType } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`L'application tourne sur : http://localhost:${port}/api/v1`);
}
bootstrap();

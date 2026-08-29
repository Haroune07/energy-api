import { NestFactory } from '@nestjs/core';
import { VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  const config = new DocumentBuilder()
    .setTitle('Energy Platform API')
    .setDescription("Spécification de l'API de gestion d'énergie pour les bâtiments, locaux et capteurs")
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/docs', app, document);
  
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`L'application tourne sur : http://localhost:${port}/api/v1`);
  console.log(`Documentation Swagger disponible sur : http://localhost:${port}/api/v1/docs`);
}
bootstrap();

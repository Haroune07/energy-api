import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { log } from 'console';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("/api")
  const port = 3000
  await app.listen(process.env.PORT ?? port);
  console.log(`App running at : http://localhost:${port}`);
  
}
bootstrap();

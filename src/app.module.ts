import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BuildingsModule } from './buildings/buildings.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [BuildingsModule, HealthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

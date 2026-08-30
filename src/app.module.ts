import { Module } from '@nestjs/common';
import { BuildingsModule } from './buildings/buildings.module';
import { HealthModule } from './health/health.module';
import { RoomsModule } from './rooms/rooms.module';

@Module({
  imports: [BuildingsModule, HealthModule, RoomsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

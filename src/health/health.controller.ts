import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {

  @Get()
  getApiState() {
    return {
      status: 'ok',
      service: 'energy-api',
      timestamp: new Date().toISOString(),
    };
  }
}

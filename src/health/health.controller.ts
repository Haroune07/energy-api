import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {

  @Get()
  getApiState() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}

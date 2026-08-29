import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Santé')
@Controller('health')
export class HealthController {

  @Get()
  @ApiOperation({ summary: "Vérifier l'état de santé du service" })
  @ApiResponse({ status: 200, description: "Le service est opérationnel et en bonne santé." })
  getApiState() {
    return {
      status: 'ok',
      service: 'energy-api',
      timestamp: new Date().toISOString(),
    };
  }
}

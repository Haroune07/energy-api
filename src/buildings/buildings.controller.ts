import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { BuildingsService } from './buildings.service';
import { CreateBuildingDto } from './dto/create-building.dto';
import { Building } from './entities/building.entity';

@ApiTags('Bâtiments')
@Controller('buildings')
export class BuildingsController {
  constructor(private readonly buildingsService: BuildingsService) {}

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les bâtiments' })
  @ApiResponse({ status: 200, description: 'Liste des bâtiments retournée avec succès.', type: [Building] })
  findAll(): Building[] {
    return this.buildingsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un bâtiment par son identifiant' })
  @ApiParam({ name: 'id', description: 'Identifiant du bâtiment', example: 'bld-001' })
  @ApiResponse({ status: 200, description: 'Détails du bâtiment retournés.', type: Building })
  @ApiResponse({ status: 404, description: 'Bâtiment non trouvé.' })
  findOne(@Param('id') id: string): Building {
    return this.buildingsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Créer un nouveau bâtiment' })
  @ApiResponse({ status: 201, description: 'Le bâtiment a été créé avec succès.', type: Building })
  create(@Body() dto: CreateBuildingDto): Building {
    return this.buildingsService.create(dto);
  }
}

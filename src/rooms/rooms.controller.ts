import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Room } from './entities/room.entity';

@ApiTags('Locaux')
@Controller()
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get('buildings/:buildingId/rooms')
  @ApiOperation({ summary: 'Consulter les locaux d’un bâtiment' })
  @ApiParam({ name: 'buildingId', description: 'Identifiant du bâtiment', example: 'bld-001' })
  @ApiResponse({ status: 200, description: 'Liste des locaux du bâtiment.', type: [Room] })
  @ApiResponse({ status: 404, description: 'Bâtiment non trouvé.' })
  findByBuilding(@Param('buildingId') buildingId: string): Room[] {
    return this.roomsService.findByBuilding(buildingId);
  }

  @Post('buildings/:buildingId/rooms')
  @ApiOperation({ summary: 'Ajouter un local à un bâtiment' })
  @ApiParam({ name: 'buildingId', description: 'Identifiant du bâtiment', example: 'bld-001' })
  @ApiResponse({ status: 201, description: 'Local créé avec succès.', type: Room })
  @ApiResponse({ status: 404, description: 'Bâtiment non trouvé.' })
  @ApiResponse({ status: 409, description: 'Un local avec ce code existe déjà dans ce bâtiment.' })
  createForBuilding(
    @Param('buildingId') buildingId: string,
    @Body() createRoomDto: CreateRoomDto,
  ): Room {
    return this.roomsService.createForBuilding(buildingId, createRoomDto);
  }

  @Get('rooms/:id')
  @ApiOperation({ summary: 'Obtenir un local par son identifiant' })
  @ApiParam({ name: 'id', description: 'Identifiant du local', example: 'rom-001' })
  @ApiResponse({ status: 200, description: 'Détails du local.', type: Room })
  @ApiResponse({ status: 404, description: 'Local non trouvé.' })
  findOne(@Param('id') id: string): Room {
    return this.roomsService.findOne(id);
  }

  @Patch('rooms/:id')
  @ApiOperation({ summary: 'Modifier un local' })
  @ApiParam({ name: 'id', description: 'Identifiant du local', example: 'rom-001' })
  @ApiResponse({ status: 200, description: 'Local modifié avec succès.', type: Room })
  @ApiResponse({ status: 404, description: 'Local non trouvé.' })
  @ApiResponse({ status: 409, description: 'Conflit de code de local.' })
  update(
    @Param('id') id: string,
    @Body() updateRoomDto: UpdateRoomDto,
  ): Room {
    return this.roomsService.update(id, updateRoomDto);
  }

  @Delete('rooms/:id')
  @ApiOperation({ summary: 'Supprimer un local' })
  @ApiParam({ name: 'id', description: 'Identifiant du local', example: 'rom-001' })
  @ApiResponse({ status: 200, description: 'Local supprimé avec succès.', type: Room })
  @ApiResponse({ status: 404, description: 'Local non trouvé.' })
  remove(@Param('id') id: string): Room {
    return this.roomsService.remove(id);
  }
}

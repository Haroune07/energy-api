import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { Room } from './entities/room.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { BuildingsService } from '../buildings/buildings.service';

@Injectable()
export class RoomsService {
  private readonly rooms: Room[] = [];
  private idCounter = 1;

  constructor(private readonly buildingsService: BuildingsService) {}

  findByBuilding(buildingId: string): Room[] {
    // Vérifier l'existence du bâtiment (lève 404 Not Found si inexistant)
    this.buildingsService.findOne(buildingId);

    return this.rooms.filter((r) => r.buildingId === buildingId);
  }

  findOne(id: string): Room {
    const room = this.rooms.find((r) => r.id === id);
    if (!room) {
      throw new NotFoundException(`Le local avec l'identifiant ${id} n'existe pas.`);
    }
    return room;
  }

  createForBuilding(buildingId: string, dto: CreateRoomDto): Room {
    // Vérifier l'existence du bâtiment (lève 404 Not Found si inexistant)
    this.buildingsService.findOne(buildingId);

    // Vérifier les conflits d'unicité du code au sein du même bâtiment
    const existingCode = this.rooms.find(
      (r) => r.buildingId === buildingId && r.code === dto.code,
    );
    if (existingCode) {
      throw new ConflictException(
        `Un local avec le code '${dto.code}' existe déjà dans ce bâtiment.`,
      );
    }

    const newRoom: Room = {
      id: `rom-${String(this.idCounter++).padStart(3, '0')}`,
      buildingId,
      code: dto.code,
      floor: dto.floor,
      type: dto.type,
      capacity: dto.capacity,
      createdAt: new Date().toISOString(),
    };

    this.rooms.push(newRoom);
    return newRoom;
  }

  update(id: string, dto: UpdateRoomDto): Room {
    const room = this.findOne(id);

    if (dto.code && dto.code !== room.code) {
      const existingCode = this.rooms.find(
        (r) => r.buildingId === room.buildingId && r.code === dto.code && r.id !== id,
      );
      if (existingCode) {
        throw new ConflictException(
          `Un local avec le code '${dto.code}' existe déjà dans ce bâtiment.`,
        );
      }
      room.code = dto.code;
    }

    if (dto.floor !== undefined) room.floor = dto.floor;
    if (dto.type !== undefined) room.type = dto.type;
    if (dto.capacity !== undefined) room.capacity = dto.capacity;

    return room;
  }

  remove(id: string): Room {
    const index = this.rooms.findIndex((r) => r.id === id);
    if (index === -1) {
      throw new NotFoundException(`Le local avec l'identifiant ${id} n'existe pas.`);
    }

    const [deleted] = this.rooms.splice(index, 1);
    return deleted;
  }
}

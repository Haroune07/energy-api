import { Injectable, NotFoundException } from '@nestjs/common';
import { Building } from './entities/building.entity';
import { CreateBuildingDto } from './dto/create-building.dto';

@Injectable()
export class BuildingsService {
  private readonly buildings: Building[] = [];
  private idCounter = 1;

  findAll(): Building[] {
    return this.buildings;
  }

  findOne(id: string): Building {
    const building = this.buildings.find((b) => b.id === id);
    if (!building) {
      throw new NotFoundException(`Le bâtiment avec l'identifiant ${id} n'existe pas.`);
    }
    return building;
  }

  create(dto: CreateBuildingDto): Building {
    const newBuilding: Building = {
      id: `bld-${String(this.idCounter++).padStart(3, '0')}`,
      name: dto.name,
      city: dto.city,
      createdAt: new Date().toISOString(),
    };
    this.buildings.push(newBuilding);
    return newBuilding;
  }
}

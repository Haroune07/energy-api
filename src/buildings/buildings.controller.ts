import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { BuildingsService } from './buildings.service';
import { CreateBuildingDto } from './dto/create-building.dto';
import { Building } from './entities/building.entity';

@Controller('buildings')
export class BuildingsController {
  constructor(private readonly buildingsService: BuildingsService) {}

  @Get()
  findAll(): Building[] {
    return this.buildingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Building {
    return this.buildingsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateBuildingDto): Building {
    return this.buildingsService.create(dto);
  }
}

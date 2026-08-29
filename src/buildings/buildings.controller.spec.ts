import { Test, TestingModule } from '@nestjs/testing';
import { BuildingsController } from './buildings.controller';
import { BuildingsService } from './buildings.service';
import { CreateBuildingDto } from './dto/create-building.dto';
import { NotFoundException } from '@nestjs/common';

describe('BuildingsController', () => {
  let controller: BuildingsController;
  let service: BuildingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BuildingsController],
      providers: [BuildingsService],
    }).compile();

    controller = module.get<BuildingsController>(BuildingsController);
    service = module.get<BuildingsService>(BuildingsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an empty array by default', () => {
      expect(controller.findAll()).toEqual([]);
    });

    it('should return list of buildings', () => {
      const dto: CreateBuildingDto = { name: 'Pavillon Principal', city: 'Montréal' };
      const created = service.create(dto);
      expect(controller.findAll()).toEqual([created]);
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException if building does not exist', () => {
      expect(() => controller.findOne('bld-999')).toThrow(NotFoundException);
    });

    it('should return the building if it exists', () => {
      const dto: CreateBuildingDto = { name: 'Pavillon Principal', city: 'Montréal' };
      const created = service.create(dto);
      expect(controller.findOne(created.id)).toEqual(created);
    });
  });

  describe('create', () => {
    it('should create and return a building', () => {
      const dto: CreateBuildingDto = { name: 'Pavillon Principal', city: 'Montréal' };
      const result = controller.create(dto);
      expect(result).toHaveProperty('id', 'bld-001');
      expect(result).toHaveProperty('name', 'Pavillon Principal');
      expect(result).toHaveProperty('city', 'Montréal');
      expect(result).toHaveProperty('createdAt');
    });
  });
});

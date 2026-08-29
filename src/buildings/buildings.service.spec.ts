import { Test, TestingModule } from '@nestjs/testing';
import { BuildingsService } from './buildings.service';
import { CreateBuildingDto } from './dto/create-building.dto';
import { NotFoundException } from '@nestjs/common';

describe('BuildingsService', () => {
  let service: BuildingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BuildingsService],
    }).compile();

    service = module.get<BuildingsService>(BuildingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create and find', () => {
    it('should generate zero-padded IDs starting from bld-001', () => {
      const dto1: CreateBuildingDto = { name: 'Pavillon Principal', city: 'Montréal' };
      const dto2: CreateBuildingDto = { name: 'Pavillon Secondaire', city: 'Québec' };

      const b1 = service.create(dto1);
      const b2 = service.create(dto2);

      expect(b1.id).toBe('bld-001');
      expect(b2.id).toBe('bld-002');
    });

    it('should find one by ID', () => {
      const dto: CreateBuildingDto = { name: 'Pavillon Principal', city: 'Montréal' };
      const created = service.create(dto);
      const found = service.findOne(created.id);
      expect(found).toEqual(created);
    });

    it('should throw NotFoundException for unknown ID', () => {
      expect(() => service.findOne('unknown-id')).toThrow(NotFoundException);
    });
  });
});

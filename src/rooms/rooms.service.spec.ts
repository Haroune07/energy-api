import { Test, TestingModule } from '@nestjs/testing';
import { RoomsService } from './rooms.service';
import { BuildingsService } from '../buildings/buildings.service';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';

describe('RoomsService', () => {
  let service: RoomsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomsService,
        {
          provide: BuildingsService,
          useValue: {
            findOne: jest.fn().mockImplementation((id: string) => {
              if (id === 'bld-001') {
                return {
                  id: 'bld-001',
                  name: 'Pavillon Principal',
                  city: 'Montréal',
                  createdAt: '2026-08-31T00:00:00Z',
                };
              }
              throw new NotFoundException(
                `Le bâtiment avec l'identifiant ${id} n'existe pas.`,
              );
            }),
          },
        },
      ],
    }).compile();

    service = module.get<RoomsService>(RoomsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createForBuilding', () => {
    it('should throw NotFoundException if building does not exist', () => {
      const dto: CreateRoomDto = {
        code: 'A-100',
        floor: 1,
        type: 'bureau',
        capacity: 10,
      };
      expect(() => service.createForBuilding('bld-999', dto)).toThrow(
        NotFoundException,
      );
    });

    it('should create room with rom-001 ID format', () => {
      const dto: CreateRoomDto = {
        code: 'A-204',
        floor: 2,
        type: 'laboratoire',
        capacity: 30,
      };
      const room = service.createForBuilding('bld-001', dto);
      expect(room.id).toBe('rom-001');
      expect(room.buildingId).toBe('bld-001');
      expect(room.code).toBe('A-204');
    });

    it('should throw ConflictException if room code already exists in same building', () => {
      const dto: CreateRoomDto = {
        code: 'A-204',
        floor: 2,
        type: 'laboratoire',
        capacity: 30,
      };
      service.createForBuilding('bld-001', dto);
      expect(() => service.createForBuilding('bld-001', dto)).toThrow(
        ConflictException,
      );
    });
  });

  describe('findByBuilding', () => {
    it('should return list of rooms for existing building', () => {
      const dto: CreateRoomDto = {
        code: 'A-204',
        floor: 2,
        type: 'laboratoire',
        capacity: 30,
      };
      service.createForBuilding('bld-001', dto);
      const rooms = service.findByBuilding('bld-001');
      expect(rooms).toHaveLength(1);
    });
  });
});

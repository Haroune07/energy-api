import { ApiProperty } from '@nestjs/swagger';

export class Room {
  @ApiProperty({ example: 'rom-001', description: "L'identifiant du local" })
  id: string;

  @ApiProperty({ example: 'A-204', description: 'Le code du local au sein du bâtiment (ex: A-204)' })
  code: string;

  @ApiProperty({ example: 'bld-001', description: "L'identifiant du bâtiment auquel est rattaché le local" })
  buildingId: string;

  @ApiProperty({ example: 2, description: "Le numéro d'étage" })
  floor: number;

  @ApiProperty({ example: 'laboratoire', description: 'Le type de local (ex: laboratoire, bureau, salle_de_classe)' })
  type: string;

  @ApiProperty({ example: 30, description: 'La capacité maximale d’accueil du local' })
  capacity: number;

  @ApiProperty({ example: '2026-08-31T15:00:00.000Z', description: 'La date et heure de création en format ISO 8601 UTC' })
  createdAt: string;
}

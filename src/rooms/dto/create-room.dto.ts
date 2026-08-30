import { ApiProperty } from '@nestjs/swagger';

export class CreateRoomDto {
  @ApiProperty({ example: 'A-204', description: 'Le code unique du local au sein du bâtiment' })
  code: string;

  @ApiProperty({ example: 2, description: "Le numéro d'étage où se situe le local" })
  floor: number;

  @ApiProperty({ example: 'laboratoire', description: 'Le type de local (ex: laboratoire, bureau, salle_de_classe)' })
  type: string;

  @ApiProperty({ example: 30, description: 'La capacité maximale d’accueil du local' })
  capacity: number;
}

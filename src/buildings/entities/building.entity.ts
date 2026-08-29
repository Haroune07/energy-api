import { ApiProperty } from '@nestjs/swagger';

export class Building {
  @ApiProperty({ example: 'bld-001', description: "L'identifiant du bâtiment" })
  id: string;

  @ApiProperty({ example: 'Pavillon Principal', description: 'Le nom du bâtiment' })
  name: string;

  @ApiProperty({ example: 'Montréal', description: 'La ville du bâtiment' })
  city: string;

  @ApiProperty({ example: '2026-08-29T14:30:00.000Z', description: 'La date de création du bâtiment dans le système' })
  createdAt: string;
}

import { ApiProperty } from '@nestjs/swagger';

export class CreateBuildingDto {
  @ApiProperty({ example: 'Pavillon Principal', description: 'Le nom du bâtiment' })
  name: string;

  @ApiProperty({ example: 'Montréal', description: 'La ville où se situe le bâtiment' })
  city: string;
}

import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class Policies {
  @ApiProperty()
  policy: string;
  @ApiProperty()
  MANAGE: boolean;
  @ApiProperty()
  CREATE: boolean;
  @ApiProperty()
  READ: boolean;
  @ApiProperty()
  UPDATE: boolean;
  @ApiProperty()
  DELETE: boolean;
  @ApiProperty()
  VIEWALL: boolean;
}
export class CreateRoleDto {
  @IsNotEmpty()
  @ApiProperty()
  readonly name: string;

  @IsNotEmpty()
  @ApiProperty()
  readonly description: string;

  @ApiProperty()
  readonly policies: [string];
}

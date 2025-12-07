import { CreateRoleDto } from './create-role.dto';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
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

export class UpdateRoleDto  {
  @ApiProperty()
  id: string;

  @IsNotEmpty()
  @ApiProperty()
  readonly name: string;

  @IsNotEmpty()
  @ApiProperty()
  readonly description: string;

  @ApiProperty({type:[Policies]})
  readonly policies: [Policies];
}

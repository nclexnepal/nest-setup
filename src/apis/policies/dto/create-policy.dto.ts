import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class Action {
  @ApiProperty({ default: false })
  canMANAGE: boolean;
  @ApiProperty({ default: false })
  canCREATE: boolean;
  @ApiProperty({ default: false })
  canREAD: boolean;
  @ApiProperty({ default: false })
  canUPDATE: boolean;
  @ApiProperty({ default: false })
  canDELETE: boolean;
}

export class CreatePolicyDto {
  @IsNotEmpty()
  @ApiProperty()
  readonly name: string;

  @ApiProperty({ type: Action })
  @IsNotEmpty()
  readonly action: Action;
}

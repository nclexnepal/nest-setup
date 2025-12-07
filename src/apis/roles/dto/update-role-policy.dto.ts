import { ApiProperty } from '@nestjs/swagger';

class Policies {
  @ApiProperty({ default: false })
  policy: string;
  @ApiProperty({ default: false })
  MANAGE: boolean;
  @ApiProperty({ default: false })
  CREATE: boolean;
  @ApiProperty({ default: false })
  READ: boolean;
  @ApiProperty({ default: false })
  UPDATE: boolean;
  @ApiProperty({ default: false })
  DELETE: boolean;
  @ApiProperty({ default: false })
  VIEWALL: boolean;
}

export class UpdateRolePolicies {
  @ApiProperty()
  readonly roleId: string;

  @ApiProperty()
  readonly policyId: string;

  @ApiProperty({ type: [Policies] })
  readonly policies: [Policies];
}

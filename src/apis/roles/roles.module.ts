import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from './schemas/role.schema';
import { Policy, PolicySchema } from '../policies/schemas/policy.schema';
import { User, UserSchema } from '../users/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Role.name, schema: RoleSchema },
      { name: Policy.name, schema: PolicySchema },
      { name: User.name, schema: UserSchema },
    ])
  ],
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule {}

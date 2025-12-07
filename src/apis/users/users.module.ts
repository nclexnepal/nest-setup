import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { Role, RoleSchema } from '../roles/schemas/role.schema';
import { Policy, PolicySchema } from '../policies/schemas/policy.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Role.name, schema: RoleSchema },
      { name: Policy.name, schema: PolicySchema },
    ])
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule { }

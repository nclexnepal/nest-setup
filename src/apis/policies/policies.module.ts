import { Module } from '@nestjs/common';
import { PoliciesService } from './policies.service';
import { PoliciesController } from './policies.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Policy, PolicySchema } from './schemas/policy.schema';
import { Role, RoleSchema } from '../roles/schemas/role.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Policy.name, schema: PolicySchema },
      { name: Role.name, schema: RoleSchema },
    ]),
  ],
  controllers: [PoliciesController],
  providers: [PoliciesService],
})
export class PoliciesModule {}

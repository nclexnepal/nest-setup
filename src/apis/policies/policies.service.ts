import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Policy, PolicyDocument } from './schemas/policy.schema';
import { Model } from 'mongoose';
import { Role, RoleDocument } from '../roles/schemas/role.schema';


@Injectable()
export class PoliciesService {

  constructor(
    @InjectModel(Policy.name)
    private readonly Policy: Model<PolicyDocument>,
    @InjectModel(Role.name)
    private readonly Role: Model<RoleDocument>,
  ) { }
  async create() {
    const allPolicies = [] as any;
    const action = {
      canMANAGE: true,
      canCREATE: true,
      canREAD: true,
      canUPDATE: true,
      canDELETE: true,
      canVIEWALL: true
    };
    const policies = [
      { name: 'User', action: action },
      { name: 'Role', action: action },
    ];

    try {
      const existingPolicies = await this.Policy.find().exec();

      const existingPolicyNames = existingPolicies.map(policy => policy.name);

      const newPolicies = policies.filter(policy => !existingPolicyNames.includes(policy.name));

      for (const policy of newPolicies) {
        const savedPolicies = await this.Policy.create(policy);
        allPolicies.push(savedPolicies);
      }
      return allPolicies;

    } catch (error) {
      throw error;
    }
  }


}

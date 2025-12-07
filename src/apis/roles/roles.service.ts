import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { errorMessage } from 'src/helpers/response';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDocument, RolePolicy } from './schemas/role.schema';
import { Model, Types } from 'mongoose';
import { Policy, PolicyDocument } from '../policies/schemas/policy.schema';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name)
    private readonly Role: Model<RoleDocument>,
    @InjectModel(Policy.name)
    private readonly Policy: Model<PolicyDocument>,
  ) { }


  // Seed Roles of Admin and Superadmin
  async seedRole() {
    const gotPolicies = await this.Policy.find().exec();
    if (!gotPolicies || gotPolicies.length < 1) {
      return errorMessage('Policy Needs To Be Added For Role', 'Policy');
    }

    const allPolicyRole: RolePolicy[] = [];
    const allPolicyAdmin: RolePolicy[] = [];

    // Build SuperAdmin policies (all true)
    for (const policy of gotPolicies) {
      const idPolicy = policy._id as Types.ObjectId; // no await here
      const policyRole: RolePolicy = {
        policy: idPolicy,
        MANAGE: true,
        CREATE: true,
        READ: true,
        UPDATE: true,
        DELETE: true,
        VIEWALL: true,
      };
      allPolicyRole.push(policyRole);
    }

    // Build Admin policies (some limited)
    for (const policy of gotPolicies) {
      const idPolicy = policy._id as Types.ObjectId;
      // default admin-permission set
      const defaultAdminPolicy: RolePolicy = {
        policy: idPolicy,
        MANAGE: true,
        CREATE: true,
        READ: true,
        UPDATE: true,
        DELETE: true,
        VIEWALL: true,
      };

      const limitedPolicyForSensitive: RolePolicy = {
        policy: idPolicy,
        MANAGE: false,
        CREATE: false,
        READ: true,
        UPDATE: false,
        DELETE: false,
        VIEWALL: false,
      };

      if (policy.name === 'User' || policy.name === 'Role') {
        allPolicyAdmin.push(limitedPolicyForSensitive);
      } else {
        allPolicyAdmin.push(defaultAdminPolicy);
      }
    }

    const superAdminDto = {
      name: 'SuperAdmin',
      description: 'Super Admin Role',
      policies: allPolicyRole,
    };

    const adminDto = {
      name: 'Admin',
      description: 'Admin Role',
      policies: allPolicyAdmin,
    };

    const savedSuperAdmin = await this.Role.findOneAndUpdate(
      { name: superAdminDto.name },
      superAdminDto,
      { upsert: true, new: true, setDefaultsOnInsert: true },
    ).exec();

    const savedAdmin = await this.Role.findOneAndUpdate(
      { name: adminDto.name },
      adminDto,
      { upsert: true, new: true, setDefaultsOnInsert: true },
    ).exec();

    // return
    return { superAdmin: savedSuperAdmin, admin: savedAdmin };
  }

  // Create
  async create(createRoleDto: CreateRoleDto) {
    try {
      const { name, description, policies: policyIds } = createRoleDto;

      const builtPolicies: RolePolicy[] = [];

      // Build each policy object
      for (const policyId of policyIds) {
        const gotPolicy = await this.Policy.findById(policyId);

        if (!gotPolicy) {
          return errorMessage('Policy Not Found', 'Policy');
        }

        builtPolicies.push({
          policy: gotPolicy._id as Types.ObjectId,
          MANAGE: false,
          CREATE: false,
          READ: false,
          UPDATE: false,
          DELETE: false,
          VIEWALL: false,
        });
      }

      // Create role
      const createdRole = await this.Role.create({
        name,
        description,
        policies: builtPolicies,
      });

      return await this.Role.findById(createdRole._id).populate({
        path: 'policies',
        populate: { path: 'policy', select: 'name' },
      });

    } catch (err) {
      throw err;
    }
  }

  // Find
  async findAll() {
    const roles = await this.Role.find().populate({
      path: 'policies',
      populate: { path: 'policy', select: 'name' },
    });

    return roles;
  }

  async findOne(id: string) {
    const role = await this.Role.findById(id).populate({
      path: 'policies',
      populate: { path: 'policy', select: 'name' },
    });
    return role;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    const role = await this.Role.findById(id);

    if (!role) {
      return errorMessage('Role Not Found', 'Role');
    }

    const { name, description } = updateRoleDto;

    role.name = name;
    role.description = description;

    return await role.save();
  }

  async updateRolePolicy(roleId, updateRolePolicyDto) {
    try {
      const role = await this.Role.findById(roleId);
      if(!role) return errorMessage('Role Not Found', 'Role');
      const policy = await this.Policy.findById(
        updateRolePolicyDto.policyId.toString(),
      );

      if (!policy) {
        return errorMessage('Policy Not Found', 'Policy');
      }

      role.policies.map((polcy) => {
        if (
          polcy.policy.toString() == updateRolePolicyDto.policyId.toString()
        ) {
          polcy.MANAGE = updateRolePolicyDto.policies.MANAGE;
          polcy.UPDATE = updateRolePolicyDto.policies.UPDATE;
          polcy.CREATE = updateRolePolicyDto.policies.CREATE;
          polcy.READ = updateRolePolicyDto.policies.READ;
          polcy.DELETE = updateRolePolicyDto.policies.DELETE;
          polcy.VIEWALL = updateRolePolicyDto.policies.VIEWALL;
        }
      });

      const savedRole = await role.save();

      return await this.Role.findById(savedRole._id).populate({
        path: 'policies',
        populate: { path: 'policy', select: 'name' },
      });
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    const deletedRole = await this.Role.findByIdAndDelete(id);
    return deletedRole;
  }


}

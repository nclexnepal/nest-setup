import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { errorMessage, successMessage } from '../../helpers/response';
import { UpdateRolePolicies } from './dto/update-role-policy.dto';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) { }

  // Seend Roles
  @Post('seed')
  @ApiOperation({ summary: 'Seed Roles' })
  async seedRole() {
    try {
      return successMessage(
        'Roles seeded',
        await this.rolesService.seedRole()
      );
    } catch (error) {
      return errorMessage('Error seeding roles', error);
    }
  }



  @Post()
  @ApiOperation({ summary: 'Create Role' })
  async create(@Body() createRoleDto: CreateRoleDto) {
    try {
      return successMessage(
        'Role created',
        await this.rolesService.create(createRoleDto)
      );
    } catch (error) {
      return errorMessage('Error creating role', error);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get All Roles' })
  async findAll() {
    try {
      return successMessage(
        'Roles found',
        await this.rolesService.findAll()
      );
    } catch (error) {
      return errorMessage('Error finding roles', error);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Role By Id' })
  async findOne(@Param('id') id: string) {
    try {
      return successMessage(
        'Role found',
        await this.rolesService.findOne(id)
      );
    } catch (error) {
      return errorMessage('Error finding role', error);
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update Role' })
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    try {
      return successMessage(
        'Role updated',
        await this.rolesService.update(id, updateRoleDto)
      );
    } catch (error) {
      return errorMessage('Error updating role', error);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete Role' })
  async remove(@Param('id') id: string) {
    try {
      return successMessage(
        'Role deleted',
        await this.rolesService.remove(id)
      );
    } catch (error) {
      return errorMessage('Error deleting role', error);
    }
  }

  // update roles policies
  @Patch(':id/policies')
  @ApiOperation({ summary: 'Update Role Policies' })
  async updateRole(@Body() updateRolePolicyDto: UpdateRolePolicies) {
    return successMessage(
      'Role-Policy Updated',
      await this.rolesService.updateRolePolicy(
        updateRolePolicyDto.roleId,
        updateRolePolicyDto,
      ),
    );
  }
}

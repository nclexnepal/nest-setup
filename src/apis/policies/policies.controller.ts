import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PoliciesService } from './policies.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { errorMessage, successMessage } from '../../helpers/response';

@ApiTags('Policies')
@Controller('policies')
export class PoliciesController {
  constructor(private readonly policiesService: PoliciesService) { }

  @Post()
  @ApiOperation({ summary: 'Seed policies' })
  async create() {
    try {
      return successMessage(
        'Policies seeded',
        await this.policiesService.create()
      );
    } catch (error) {
      return errorMessage('Error seeding policies', error);
    }
  }

}

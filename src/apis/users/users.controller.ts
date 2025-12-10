import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { errorMessage, successMessage } from '../../helpers/response';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create user' })
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      return successMessage(
        'User created',
        await this.usersService.create(createUserDto),
      );
    } catch (error) {
      return errorMessage('Error creating user', error.message);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Find all users' })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'search', required: false })
  async findAll(
    @Param('limit') limit: number,
    @Param('page') page: number,
    @Param('search') search: string,
  ) {
    try {
      return successMessage(
        'All users ',
        await this.usersService.findAll(limit, page, search),
      );
    } catch (error) {
      return errorMessage('Error finding users', error.message);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find user by id' })
  async findOne(@Param('id') id: string) {
    try {
      return successMessage(
        'Single user',
        await this.usersService.findOne(id),
      );
    } catch (error) {
      return errorMessage('Error finding user', error.message);
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user by id' })
  async remove(@Param('id') id: string) {
    try {
      return successMessage(
        'User deleted',
        await this.usersService.remove(id),
      );
    } catch (error) {
      return errorMessage('Error deleting user', error.message);
    }
  }
}

import {
  IsString,
  IsEmail,
  IsOptional,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UserProfileDto } from './user-profile.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ type: String, description: 'The username of the user' })
  @IsString()
  username: string;

  @ApiProperty({ type: String, description: 'Password', minLength: 6 })
  @IsString()
  password: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ type: String, description: 'Email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  role?: string;

  @ApiProperty({ type: () => UserProfileDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => UserProfileDto)
  profile?: UserProfileDto;

  @ApiProperty({ type: Number, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  employeeId?: number;
}

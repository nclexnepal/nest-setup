
import {
  IsString,
  IsEmail,
  IsOptional,
  IsBoolean,
  IsArray,
  ArrayNotEmpty,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UserProfileDto } from './user-profile.dto';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsEmail()
  email: string;

  @IsOptional()
  role?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => UserProfileDto)
  profile?: UserProfileDto;

  @IsOptional()
  @IsNumber()
  employeeId?: number;

}

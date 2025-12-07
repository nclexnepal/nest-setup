import { IsOptional, IsString, IsDateString } from 'class-validator';

export class UserProfileDto {
  @IsOptional()
  @IsString()
  profileIcon?: string; 

  @IsOptional()
  @IsString()
  profileImage?: string;

  @IsOptional()
  @IsString()
  contact?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsString()
  emergencyContact?: string;

  @IsOptional()
  @IsDateString()
  joinedDate?: string;

  @IsOptional()
  @IsDateString()
  leftDate?: string;
}

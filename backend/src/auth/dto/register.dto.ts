// auth/dto/register.dto.ts
import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsNotEmpty,
} from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Please enter a valid email' })
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'Username must be at least 2 characters long' })
  @MaxLength(50, { message: 'Username cannot exceed 50 characters' })
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}


import { IsString, IsEmail, MinLength, IsOptional, IsIn, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  readonly name: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  @MinLength(10)
  @MaxLength(11)
  readonly phone: string;

  @IsString()
  @MinLength(6)
  readonly password: string;

  @IsOptional()
  @IsString()
  @IsIn(['user', 'admin'], { message: 'Role phải là user hoặc admin' })
  readonly role: string = 'user'; 
}

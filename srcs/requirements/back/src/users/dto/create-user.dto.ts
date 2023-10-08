import { IsString, IsNotEmpty } from 'class-validator';

export class CreateUserDTO {
  @IsString({ message: 'error: username must be a string' })
  @IsNotEmpty({ message: 'error: username cant be empty' })
  userName: string;

  constructor(userData: Partial<CreateUserDTO>) {
    Object.assign(this, userData);
  }
}
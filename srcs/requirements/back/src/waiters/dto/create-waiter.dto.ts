import { IsString, IsNotEmpty } from 'class-validator';

export class CreateWaiterDTO {
  @IsString({ message: 'error: waiterSocket must be a string' })
  @IsNotEmpty({ message: 'error: waiterSocket cant be empty' })
  waiterSocket: string;

  constructor(userData: Partial<CreateWaiterDTO>) {
    Object.assign(this, userData);
  }
}
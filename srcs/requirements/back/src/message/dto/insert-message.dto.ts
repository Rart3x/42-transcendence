import { IsString, IsNotEmpty } from 'class-validator';

export class InsertMessageDTO {
  @IsString({ message: 'error: message must be a string' })
  @IsNotEmpty({ message: 'error: message cant be empty' })
  message_text: string;

  constructor(userData: Partial<InsertMessageDTO>) {
    Object.assign(this, userData);
  }
}
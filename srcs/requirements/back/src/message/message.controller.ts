import { BadRequestException, Body, Controller, Get, Param, Post} from '@nestjs/common';
import { InsertMessageDTO } from './dto/insert-message.dto';
import { Message } from '@prisma/client';
import { MessageService } from './message.service';
import { Prisma } from '@prisma/client';
import { validateOrReject } from 'class-validator';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get()
  async getMessage(): Promise<{ message_text: string; message_date: Date }[]> {
    try{
      return await this.messageService.getMessage();
    }
    catch (validationErrors) {
      throw new BadRequestException(validationErrors);
    }
  }
}
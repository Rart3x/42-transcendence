import { BadRequestException, Body, Controller, Get, Param, Post} from '@nestjs/common';
// import { CreateUserDTO } from './dto/create-user.dto';
import { Message } from '@prisma/client';
import { MessageService } from './message.service';
import { Prisma } from '@prisma/client';
import { validateOrReject } from 'class-validator';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  async insertMessage(@Body() body: { message_text: string }): Promise<Message> {
    try {
      const newMessage: Prisma.MessageCreateInput = {
        message_text: body.message_text,
      };
      return this.messageService.insertMessage(newMessage);
    }
    catch (validationErrors) {
      throw new BadRequestException(validationErrors);
    }
  }
}
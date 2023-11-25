import { BadRequestException, Body, Controller, Get, Param, Post} from '@nestjs/common';
import { InsertMessageDTO } from './dto/insert-message.dto';
import { Message, User } from '@prisma/client';
import { MessageService } from './message.service';
import { Prisma } from '@prisma/client';

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

  @Post(':channelName/post/message')
  async insertMessageToChannel(@Body('channelName') channelName: string, @Body('message_text') message_text : string, @Body('user') user : User): Promise<Message> {
    try {
      return await this.messageService.insertMessageToChannel(channelName, message_text, user);
    }
    catch (validationErrors) {
      throw new BadRequestException(validationErrors);
    }
  }
}

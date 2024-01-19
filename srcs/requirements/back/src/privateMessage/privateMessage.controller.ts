import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Delete} from '@nestjs/common';
import { PrivateMessage } from '@prisma/client';
import { PrivateMessageService } from './privateMessage.service';

import { plainToClass } from 'class-transformer';
import { validateOrReject } from 'class-validator';

import { CreateDMDTO } from './dto/create-dm.dto';

@Controller('privateMessage')
export class PrivateMessageController {
  constructor(private readonly privateMessageService: PrivateMessageService) {}

  @Get(':userName1/:userName2/lastMessage')
  async getLastPrivateMessage(@Param('userName1') userName1: string, @Param('userName2') userName2: string): Promise<PrivateMessage> {
    return await this.privateMessageService.getLastPrivateMessage(userName1, userName2);
  }

  @Get(':userName1/:userName2')
  async getPrivateMessages(@Param('userName1') userName1: string, @Param('userName2') userName2: string): Promise<PrivateMessage> {
    return await this.privateMessageService.getPrivateMessage(userName1, userName2);
  }

  @Get(':userName')
  async getPrivateMessagesByUserName(@Param('userName') userName: string): Promise<{ [key: string]: PrivateMessage[] }> {
    return this.privateMessageService.getPrivateMessagesByUserName(userName);
  }

  @Post('create/:userName1/:userName2')
  async createPrivateMessage( @Param('userName1') userName1: string, @Param('userName2') userName2: string, @Body('messageContent') messageContent: string, ): Promise<{ success: boolean }> {
    const createDMDTO = plainToClass(CreateDMDTO, { senderName: userName1, receiverName: userName2, messageContent });

    try {
      await validateOrReject(createDMDTO);
    } catch (errors) {
      throw new HttpException({ errors, message: 'error: createDMDTO' }, HttpStatus.BAD_REQUEST);
    }

    const result = await this.privateMessageService.createPrivateMessage(
      createDMDTO.senderName,
      createDMDTO.receiverName,
      createDMDTO.messageContent,
    );

    return { success: result };
  }

  @Delete('delete/:userName/:friendName')
  async deletePrivateMessages(@Body('userName') userName: string, @Body('friendName') friendName: string): Promise<{ success: boolean }> {
    const result = await this.privateMessageService.deletePrivateMessages(userName, friendName);
    return { success: result };
  }
}
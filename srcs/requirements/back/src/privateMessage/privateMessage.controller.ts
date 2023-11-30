import { Body, Controller, Get, Param, Post} from '@nestjs/common';
import { PrivateMessage } from '@prisma/client';
import { PrivateMessageService } from './privateMessage.service';

@Controller('privateMessage')
export class PrivateMessageController {
  constructor(private readonly privateMessageService: PrivateMessageService) {}

  @Get(':userName1/:userName2')
  async getPrivateMessages(@Param('userName1') userName1: string, @Param('userName2') userName2: string): Promise<PrivateMessage> {
    return await this.privateMessageService.getPrivateMessage(userName1, userName2);
  }

  @Get(':userName')
  async getPrivateMessagesByUserName(@Param('userName') userName: string): Promise<PrivateMessage[]> {
    return this.privateMessageService.getPrivateMessagesByUserName(userName);
  }

  @Post('create/:userName1/:userName2')
  async createPrivateMessage(@Body('userName1') userName1: string, @Body('userName2') userName2: string, @Body('privateMessageText') privateMessageText: string): Promise<{ success: boolean }> {
    const result = await this.privateMessageService.createPrivateMessage(userName1, userName2, privateMessageText);
    return { success: result };
  }
}
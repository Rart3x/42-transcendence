import { Body, Delete, Controller, Get, Param, Post } from '@nestjs/common';
import { Channel, Message, User } from '@prisma/client';
import { ChannelService } from './channel.service';
import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma.service';

@Controller('channel')
export class ChannelController {
  constructor(private readonly channelService: ChannelService, private readonly prisma: PrismaService, private readonly userService: UserService) {}

  @Post(':channelName/ban/:userName')
  async banUserFromChannel(@Body('channelName') channelName: string, @Body('userName') userName: string): Promise<User> {
    return await this.channelService.banUserFromChannel(channelName, userName);
  }

  @Get(':channelName/messages')
  async getMessagesFromChannel(@Param('channelName') channelName: string): Promise<Message[]> {
    try {
      return this.channelService.getMessagesFromChannel(channelName);
    }
    catch (error) {
      return null;
    }    
  }

  @Get(':channelName/users')
  async getUsersFromChannel(@Param('channelName') channelName: string): Promise<User[]> {
    try {
      return this.channelService.getUsersFromChannel(channelName);
    }
    catch (error) {
      return null;
    }    
  }

  @Get('get/:channelName')
  async getChannelByName(@Param('channelName') channelName: string): Promise<Channel> {
    try {
      return this.channelService.getChannelByName(channelName);
    }
    catch (error) {
      return null;
    }    
  }

  @Post(':channelName')
  async createChannel(@Body('channelName') channelName: string, @Body('userName') userName: string, @Body('invitedUserName') invitedUserName: string): Promise<{ success: boolean }> {
    const result = await this.channelService.createChannel(channelName, userName, invitedUserName);
    return { success: result };
	}

  @Post(':channelName/set/password')
  async setPassword(@Body('channelName') channelName: string, @Body('password') password: string ): Promise<Channel> {
    try {
      return this.channelService.setPassword(channelName, password);
    }
    catch (error) {
      return null;
    }    
	}

  @Post(':channelName/unset/password')
  async unsetPassword(@Body('channelName') channelName: string): Promise<Channel> {
    try {
      return this.channelService.unsetPassword(channelName);
    }
    catch (error) {
      return null;
    }    
	}

  @Delete('delete/:channelName')
  async deleteChannel(@Body('channelName') channelName: string): Promise<{ success: boolean }> {
    const result = await this.channelService.deleteChannel(channelName);
    return { success: result };
  }

  @Delete(':channelName/delete/:friendName')
  async removeUserFromChannel(@Body('channelName') channelName: string, @Body('friendName') friendName: string): Promise<{ success: boolean }> {
    const response = await this.channelService.removeUserFromChannel(channelName, friendName);
    return { success: response };
  }
}
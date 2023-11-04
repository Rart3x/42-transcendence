import { Body, Delete, Controller, Get, Param, Post } from '@nestjs/common';
import { Channel, Message, User } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { ChannelService } from './channel.service';

@Controller('channel')
export class ChannelController {
  constructor(private readonly channelService: ChannelService, private readonly prisma: PrismaService) {}

  @Get(':channelName/messages')
  async getAllMessagesFromChannel(@Param('channelName') channelName: string): Promise<Message[]> {
    try {
      return this.channelService.getAllMessagesFromChannel(channelName);
    }
    catch (error) {
      return null;
    }    
  }

  @Get(':channelName/users')
  async getAllUsersFromChannel(@Param('channelName') channelName: string): Promise<User[]> {
    try {
      return this.channelService.getAllUsersFromChannel(channelName);
    }
    catch (error) {
      return null;
    }    
  }

  @Get('get/:channelName')
  async getChannelByChannelName(@Param('channelName') channelName: string): Promise<Channel> {
    try {
      return this.channelService.getChannelByChannelName(channelName);
    }
    catch (error) {
      return null;
    }    
  }

  @Post(':channelName')
  async createChannel(@Body('channelName') channelName: string, @Body('userName') userName: string, @Body('invitedUserName') invitedUserName: string): Promise<Channel> {
    try {
      return this.channelService.createChannel(channelName, userName, invitedUserName);
    }
    catch (error) {
      return null;
    }    
	}

  @Delete('delete/:channelName')
  async deleteChannel(@Body('channelName') channelName: string): Promise<Channel> {
    try {
      return this.channelService.deleteChannel(channelName);
    }
    catch (error) {
      return null;
    }    
  }

  @Delete(':channelName/delete/:friendName')
  async removeFriendFromChannel(@Body('channelName') channelName: string, @Body('friendName') friendName: string): Promise<Channel> {
    try {
      return this.channelService.removeFriendFromChannel(channelName, friendName);
    }
    catch (error) {
      return null;
    }    
  }
}
import { Body, Delete, Controller, Get, Param, Post } from '@nestjs/common';
import { Channel } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { ChannelService } from './channel.service';

@Controller('channel')
export class ChannelController {
  constructor(private readonly channelService: ChannelService, private readonly prisma: PrismaService) {}

  @Post(':channelName')
  async createChannel(@Param('channelName') channelName: string, @Body('userName') userName: string, @Body('invitedUserName') invitedUserName: string): Promise<Channel> {
    try {
      console.log(userName);
      console.log(invitedUserName);
      return this.channelService.createChannel(channelName, userName, invitedUserName);
    }
    catch (error) {
      console.error("error: creating channel");
      return null;
    }    
	}
}
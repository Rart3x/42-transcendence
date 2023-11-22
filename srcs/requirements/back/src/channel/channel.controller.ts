import { Body, Delete, Controller, Get, Param, Post } from '@nestjs/common';
import { Channel, Message, User } from '@prisma/client';
import { ChannelService } from './channel.service';
import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma.service';

@Controller('channel')
export class ChannelController {
  constructor(private readonly channelService: ChannelService, private readonly prisma: PrismaService, private readonly userService: UserService) {}

  @Post(':channelName/add/operator/:operatorName')
  async addOperator(@Body('channelName') channelName: string, @Body('operatorName') operatorName: string): Promise<{ success: boolean }> {
    const result = await this.channelService.addOperator(channelName, operatorName);
    return { success: result };
  }

  @Post(':channelName/ban/:userName')
  async banUserFromChannel(@Body('channelName') channelName: string, @Body('userName') userName: string): Promise<{ success: boolean }> {
    const result = await this.channelService.banUserFromChannel(channelName, userName);
    return { success: result };
  }

  @Post(':channelName/checkPass')
  async checkPass(@Param('channelName') channelName: string, @Body('password') password: string): Promise<{ success: boolean }> {
    const result = await this.channelService.checkPass(channelName, password);
    return { success: result };
  }

  @Post(':channelName/mute/:userName')
  async muteUserFromChannel(@Body('channelName') channelName: string, @Body('userName') userName: string): Promise<{ success: boolean }> {
    const result = await this.channelService.muteUserFromChannel(channelName, userName);
    return { success: result };
  }

  @Get('getAllChannels')
  async getAllChannels(): Promise<Channel[]> {
    return this.channelService.getAllChannels();
  }

  @Get('getAllNewChannels/:userName')
  async getAllNewChannels(@Param('userName') userName : string): Promise<Channel[]> {
    return this.channelService.getAllNewChannels(userName);
  }

  @Get(':channelName/messages')
  async getMessagesFromChannel(@Param('channelName') channelName: string): Promise<Message[]> {
    return this.channelService.getMessagesFromChannel(channelName);
  }

  @Get(':channelName/users')
  async getUsersFromChannel(@Param('channelName') channelName: string): Promise<User[]> {
    return this.channelService.getUsersFromChannel(channelName);
  }

  @Get('get/:channelName')
  async getChannelByName(@Param('channelName') channelName: string): Promise<Channel> {
    return this.channelService.getChannelByName(channelName);
  }

  @Get(':channelName/isOperator/:userName')
  async isOperator(@Param('channelName') channelName: string, @Param('userName') userName: string): Promise<User> | null {
    const result = await this.channelService.isOperator(channelName, userName);
    return result;
  }

  @Get(':channelName/isUser/:userName')
  async isUserInChannel(@Param('channelName') channelName: string, @Param('userName') userName: string): Promise<{ success: boolean }> {
    const result = await this.channelService.isUserInChannel(channelName, userName);
    return { success: result };
  }

  @Get(':channelName/isBan/:userName')
  async isUserBanInChannel(@Param('channelName') channelName: string, @Param('userName') userName: string): Promise<{ success: boolean }> {
    const result = await this.channelService.isUserBanInChannel(channelName, userName);
    return { success: result };
  }

  @Get(':channelName/isMute/:userName')
  async isUserMuteInChannel(@Param('channelName') channelName: string, @Param('userName') userName: string): Promise<{ success: boolean }> {
    const result = await this.channelService.isUserMuteInChannel(channelName, userName);
    return { success: result };
  }

  @Post(':channelName')
  async createChannel(@Body('channelName') channelName: string, @Body('userName') userName: string, @Body('invitedUserName') invitedUserName: string): Promise<{ success: boolean }> {
    const result = await this.channelService.createChannel(channelName, userName, invitedUserName);
    return { success: result };
	}

  @Post('create/:channelName/empty')
  async createEmptyChannel(@Body('channelName') channelName: string, @Body('userName') userName: string, ): Promise<{ success: boolean }> {
    const result = await this.channelService.createEmptyChannel(channelName, userName);
    return { success: result };
	}

  @Post(':channelName/join/:userName')
  async joinChannel(@Body('channelName') channelName: string, @Body('userName') userName: string): Promise<{ success: boolean }> {
    const result = await this.channelService.joinChannel(channelName, userName);
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

  @Delete(':channelName/operator/delete/:operatorName')
  async removeOperator(@Body('channelName') channelName: string, @Body('operatorName') operatorName: string): Promise<{ success: boolean }> {
    const response = await this.channelService.removeOperator(channelName, operatorName);
    return { success: response };
  }
}
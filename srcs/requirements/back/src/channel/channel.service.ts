import { Injectable } from '@nestjs/common';
import { Channel, User, Prisma } from '@prisma/client';
import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma.service'

@Injectable()
export class ChannelService {
  constructor (private prisma: PrismaService, private userService: UserService) {}

  async isUserAdminOfChannel(channel: Channel, user: User): Promise<Boolean> {
    const channelUser = await this.prisma.channel.findFirst({
      where: { channelAdmin: user.userId },
    });
    if(!channelUser)
      return false;
    return true;
  }

  async isUserMemberOfChannel(channel: Channel, user: User): Promise<Boolean> {
    const channelUser = await this.prisma.channel.findFirst({
      where: { channelId: channel.channelId },
      select: {
        channelUsers: {
          where: { userId: user.userId } 
        }
      },
    });
    if(!channelUser)
      return false;
    return true;
  }
  
  async createChannel(channelName: string, userName: string, invitedUserName: string): Promise<Channel> {
    const user = await this.userService.getUserByUserName(userName);
    const invitedUser = await this.userService.getUserByUserName(invitedUserName);
  
    if (!user || !invitedUser)
      console.error("error: user or invited user not found");
  
    const existingChannel = await this.getChannelByChannelName(channelName);
  
    if (existingChannel) {
      if (await this.isUserAdminOfChannel(existingChannel, user))
        console.error("error: user is already admin of this channel");
  
      if (await this.isUserMemberOfChannel(existingChannel, invitedUser)){
        console.error("error: invited user is already member of this channel");
        return null;
      }
  
      await this.prisma.channel.update({
        where: { channelId: existingChannel.channelId },
        data: {
          channelUsers: {
            connect: { userId: invitedUser.userId },
          },
        },
      });
      return existingChannel;
    }
  
    const channel = await this.prisma.channel.create({
      data: {
        channelName: channelName,
        channelAdmin: user.userId,
        channelUsers: {
          connect: [
            { userId: user.userId },
            { userId: invitedUser.userId },
          ],
        },
      },
    });
    return channel;
  }

  async getChannelByChannelName(channelName: string): Promise<Channel> {
    const channel = await this.prisma.channel.findUnique({
      where: { channelName: channelName },
    });
    if (!channel)
      console.error("error: channel not found");
    return channel;
  }
}

import { Injectable } from '@nestjs/common';
import { Channel, Message, User, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service'
import { MessageService } from '../message/message.service';
import { UserService } from '../user/user.service';

@Injectable()
export class ChannelService {
  constructor (private prisma: PrismaService, private messageService: MessageService, private userService: UserService) {}
  
  async createChannel(channelName: string, userName: string, invitedUserName: string): Promise<Channel> {
    const user = await this.userService.getUserByUserName(userName);
    const invitedUser = await this.userService.getUserByUserName(invitedUserName);
  
    if (!user || !invitedUser) {
      console.error("error: user or invited user not found");
      return null;
    }
  
    const existingChannel = await this.getChannelByChannelName(channelName);
  
    if (existingChannel) {
      if (await this.isUserAdminOfChannel(existingChannel, user)) {
        console.error("error: user is already admin of this channel");
        return null;
      }
  
      if (await this.isUserMemberOfChannel(existingChannel, invitedUser)) {
        console.error("error: invited user is already a member of this channel");
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
  
      await this.messageService.createMessage(existingChannel);
  
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
  
    await this.messageService.createMessage(channel);
  
    return channel;
  }
  

  async getAllMessagesFromChannel(channelName: string): Promise<Message[]> {
    const channel = await this.getChannelByChannelName(channelName);

    if (!channel)
      console.error("error: channel not found");

    const messages = await this.prisma.channel.findUnique({
      where: { channelId: channel.channelId },
    }).channelMessages();

    return messages;
  }

  async getAllUsersFromChannel(channelName: string): Promise<User[]> {
    const channel = await this.getChannelByChannelName(channelName);

    if (!channel)
      console.error("error: channel not found");

    const users = await this.prisma.channel.findUnique({
      where: { channelId: channel.channelId },
    }).channelUsers();

    return users;
  }

  async getChannelByChannelName(channelName: string): Promise<Channel> {
    const channel = await this.prisma.channel.findUnique({
      where: { channelName: channelName },
    });
    if (!channel)
      console.error("error: channel not found");
    return channel;
  }

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
}

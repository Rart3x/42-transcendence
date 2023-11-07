import { Injectable } from '@nestjs/common';
import { Channel, Message, User, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service'
import { MessageService } from '../message/message.service';
import { UserService } from '../user/user.service';

@Injectable()
export class ChannelService {
  constructor (private prisma: PrismaService, private messageService: MessageService, private userService: UserService) {}
  
  async banUserFromChannel(channelName: string, userName: string): Promise<User> {
    const channel = await this.getChannelByName(channelName);
    const user = await this.userService.getUserByName(userName);
  
    if (!channel || !user)
      console.error("error: channel or user not found");
  
    await this.prisma.channel.update({
      where: { channelId: channel.channelId },
      data: {
        channelUsers: {
          disconnect: { userId: user.userId },
        },
        channelUsersBan: {
          connect: { userId: user.userId },
        },
      },
    });

    await this.prisma.user.update({
      where: { userId: user.userId },
      data: {
        channelsBan: {
          connect: { channelId: channel.channelId },
        },
      },
    });
    return user;
  }

  async createChannel(channelName: string, userName: string, invitedUserName: string): Promise<boolean> {
    const user = await this.userService.getUserByName(userName);
    const invitedUser = await this.userService.getUserByName(invitedUserName);
  
    if (!user || !invitedUser)
      return false;
  
    const existingChannel = await this.getChannelByName(channelName);
  
    if (existingChannel) {
      if (await !this.isUserAdminOfChannel(existingChannel, user)) {
        console.error("error: user is not admin of this channel");
        return null;
      }

      if (await this.isUserMemberOfChannel(existingChannel, invitedUser)) {
        console.error("error: invited user is already a member of this channel");
        return null;
      }
  
      const message = await this.messageService.createMessage(existingChannel);

      await this.prisma.channel.update({
        where: { channelId: existingChannel.channelId },
        data: {
          channelUsers: {
            connect: { userId: invitedUser.userId },
          },
          channelMessages: {
            connect: { messageId: message.messageId },
          },
        },
      });
  
      return true;
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
  
    return true;
  }
  
  async deleteChannel(channelName: string): Promise<boolean> {
    const channel = await this.getChannelByName(channelName);

    if (!channel)
      return false;

    await this.prisma.channel.delete({
      where: { channelId: channel.channelId },
    });

    return true;
  }
  catch (error) {
    return false;
  }

  async getMessagesFromChannel(channelName: string): Promise<Message[]> {
    
    const messages = await this.prisma.channel.findFirst({
      where: { channelName: channelName },
      include: {
        channelMessages: {
          include: {
            sender: true,
            Channel: true,
          },
        },
      },
    });
    
    if (!messages) {
      console.error("error: channel not found");
      return [];
    }
    return messages.channelMessages;
  }

  async getUsersFromChannel(channelName: string): Promise<User[]> {
    const channel = await this.getChannelByName(channelName);

    if (!channel)
      console.error("error: channel not found");

    const users = await this.prisma.channel.findUnique({
      where: { channelId: channel.channelId },
    }).channelUsers();

    return users;
  }

  async getChannelByName(channelName: string): Promise<Channel> {
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
    const channelUsers = await this.prisma.channel.findFirst({
      where: { channelId: channel.channelId },
      select: {
        channelUsers: {
          where: { userId: user.userId }
        }
      },
    });
    if (channelUsers && channelUsers.channelUsers.length > 0)
      return true;
    return false;
  }

  async removeUserFromChannel(channelName: string, friendName: string): Promise<boolean> {
    const channel = await this.getChannelByName(channelName);
    const friend = await this.userService.getUserByName(friendName);

    if (!channel || !friend)
      return false;

    await this.prisma.channel.update({
      where: { channelId: channel.channelId },
      data: {
        channelUsers: {
          disconnect: { userId: friend.userId },
        },
      },
    });
    return true;
  }

  async setPassword(channelName: string, password: string): Promise<Channel> {
    try {
      const channel = await this.getChannelByName(channelName);
  
      if (!channel)
        console.error("error: channel not found");
  
      await this.prisma.channel.update({
        where: { channelId: channel.channelId },
        data: {
          channelPassword: password,
        },
      });
      return channel;
    }
    catch (error) {
      return null;
    }
  }

  async unsetPassword(channelName: string): Promise<Channel> {
    try {
      const channel = await this.getChannelByName(channelName);
  
      if (!channel)
        console.error("error: channel not found");
  
      await this.prisma.channel.update({
        where: { channelId: channel.channelId },
        data: {
          channelPassword: "",
        },
      });
      return channel;
    }
    catch (error) {
      return null;
    }
  }
}
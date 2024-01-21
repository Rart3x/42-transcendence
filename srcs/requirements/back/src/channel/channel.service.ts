import { Injectable } from '@nestjs/common';
import { Channel, Message, User, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service'
import { MessageService } from '../message/message.service';
import { UserService } from '../user/user.service';

@Injectable()
export class ChannelService {
  constructor (private prisma: PrismaService, private messageService: MessageService, private userService: UserService) {}
  
  async addOperator(channelName: string, operatorName: string): Promise<boolean> {
    const channel = await this.getChannelByName(channelName);
    const operator = await this.userService.getUserByName(operatorName);

    if (!channel || !operator)
      return false;

    await this.prisma.channel.update({
      where: { channelId: channel.channelId },
      data: {
        channelOperators: {
          connect: { userId: operator.userId },
        },
      },
    });
    return true;
  }

  async banUserFromChannel(channelName: string, userName: string): Promise<boolean> {
    const channel = await this.getChannelByName(channelName);
    const user = await this.userService.getUserByName(userName);
  
    if (!channel || !user)
      return false;
  
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
    return true;
  }

  async checkPass(channelName: string, password: string): Promise<boolean> {
    const channel = await this.getChannelByName(channelName);

    if (!channel)
      return false;

    if (channel.channelPassword === password)
      return true;
    return false;
  }

  async createChannel(channelName: string, userName: string, invitedUserName: string): Promise<boolean> {
    const user = await this.userService.getUserByName(userName);
    const invitedUser = await this.userService.getUserByName(invitedUserName);
  
    if (!user || !invitedUser) {
      return false;
    }
  
    const existingChannel = await this.getChannelByName(channelName);
  
    if (existingChannel) {
      if (!this.isUserAdminOfChannel(existingChannel, user)) {
        return false;
      }
  
      if (await this.isUserMemberOfChannel(existingChannel, invitedUser)) {
        return false;
      }
  
      await this.prisma.channel.update({
        where: { channelId: existingChannel.channelId },
        data: {
          channelUsers: {
            connect: { userId: invitedUser.userId },
          },
        },
      });
  
      return true;
    }
  
    const channel = await this.prisma.channel.create({
      data: {
        channelName: channelName,
        channelAdmin: user.userId,
        channelAdminImage: user.image,
        channelUsers: {
          connect: [
            { userId: user.userId },
            { userId: invitedUser.userId },
          ],
        },
      },
    });
  
    return true;
  }

  async createEmptyChannel(channelName: string, userName: string): Promise<boolean> {
    const user = await this.userService.getUserByName(userName);
  
    if (!user)
      return false;
  
    const existingChannel = await this.getChannelByName(channelName);
  
    if (existingChannel) {
      if (!this.isUserAdminOfChannel(existingChannel, user))
        return false;
      return true;
    }
  
    const channel = await this.prisma.channel.create({
      data: {
        channelName: channelName,
        channelAdmin: user.userId,
        channelAdminImage: user.image,
        channelUsers: {
          connect: [
            { userId: user.userId },
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

  async joinChannel(channelName: string, userName: string): Promise<boolean> {
    const channel = await this.getChannelByName(channelName);
    const user = await this.userService.getUserByName(userName);
  
    if (!channel || !user)
      return false;
  
    await this.prisma.channel.update({
      where: { channelId: channel.channelId },
      data: {
        channelUsers: {
          connect: { userId: user.userId },
        },
      },
    });
    return true;
  }

  async getAllChannels(): Promise<Channel[]> {
    const channels = await this.prisma.channel.findMany({
      include: {
        channelMessages: true,
        channelOperators: true,
        channelUsers: true,
        channelUsersBan: true,
        channelUsersMute: true,
      },
    });
    return channels;
  }

  async getAllNewChannels(userName: string): Promise<Channel[]> {
    const user = await this.userService.getUserByName(userName);
    const channels = await this.prisma.channel.findMany({
      where: {
        NOT: [
          {
            channelAdmin: user.userId,
          },
          {
            channelUsers: {
              some: {
                userId: user.userId,
              },
            },
          },
        ],
      },
      include: {
        channelMessages: true,
        channelOperators: true,
        channelUsers: true,
        channelUsersBan: true,
        channelUsersMute: true,
      },
    });
    return channels;
  }

  async getMessagesFromChannel(channelName: string): Promise<Message[]> {
    
    const messages = await this.prisma.channel.findFirst({
      where: { channelName },
      include: {
        channelMessages: {
          include: {
            sender: true,
            Channel: true,
          },
        },
        channelOperators: true,
        channelUsers: true,
        channelUsersBan: true,
        channelUsersMute: true,
      },
    });
    
    if (!messages) {
      return [];
    }
    return messages.channelMessages;
  }

  async getUsersFromChannel(channelName: string): Promise<User[]> {
    const channel = await this.getChannelByName(channelName);

    if (!channel)
      return null;

    const users = await this.prisma.channel.findUnique({
      where: { channelId: channel.channelId },
    }).channelUsers();

    return users;
  }

  async getChannelByName(channelName: string): Promise<Channel> {
    const channel = await this.prisma.channel.findUnique({
      where: { channelName: channelName },
      include: {
        channelUsers: true,
        channelUsersBan: true,
        channelUsersMute: true,
        channelOperators: true,
        channelMessages: true,
      }, 
    });
    if (!channel)
      return null;
    return channel;
  }

  async isOperator(channelName: string, userName: string): Promise<User> {
    const channel = await this.getChannelByName(channelName);
    const user = await this.userService.getUserByName(userName);

    if (!channel || !user)
      return null;

    const channelUsers = await this.prisma.channel.findFirst({
      where: { channelId: channel.channelId },
      select: {
        channelOperators: {
          where: { userId: user.userId }
        }
      },
    });
    if (channelUsers && channelUsers.channelOperators.length > 0)
      return user;
    return null;
  }

  async isUserInChannel(channelName: string, userName: string): Promise<boolean> {
    const channel = await this.getChannelByName(channelName);
    const user = await this.userService.getUserByName(userName);

    if (!channel || !user)
      return false;

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

  async isUserAdminOfChannel(channel: Channel, user: User): Promise<Boolean> {
    const channelUser = await this.prisma.channel.findFirst({
      where: { channelAdmin: user.userId },
    });
    if(!channelUser)
      return false;
    return true;
  }

  async isUserBanInChannel(channelName: string, userName: string): Promise<boolean> {
    const channel = await this.getChannelByName(channelName);
    const user = await this.userService.getUserByName(userName);

    if (!channel || !user)
      return false;

    const channelUsers = await this.prisma.channel.findFirst({
      where: { channelId: channel.channelId },
      select: {
        channelUsersBan: {
          where: { userId: user.userId }
        }
      },
    });
    if (channelUsers && channelUsers.channelUsersBan.length > 0)
      return true;
    return false;
  }

  async isUserMuteInChannel(channelName: string, userName: string): Promise<boolean> {
    const channel = await this.getChannelByName(channelName);
    const user = await this.userService.getUserByName(userName);

    if (!channel || !user)
      return false;

    const channelUsers = await this.prisma.channel.findFirst({
      where: { channelId: channel.channelId },
      select: {
        channelUsersMute: {
          where: { userId: user.userId }
        }
      },
    });
    if (channelUsers && channelUsers.channelUsersMute.length > 0)
      return true;
    return false;
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

  async muteUserFromChannel(channelName: string, userName: string, duration: number): Promise<boolean> {
    const channel = await this.getChannelByName(channelName);
    const user = await this.userService.getUserByName(userName);
  
    if (!channel || !user) {
      return false;
    }
  
    const mutedUntil = new Date();
    mutedUntil.setUTCMinutes(mutedUntil.getUTCMinutes() + duration);
    await this.prisma.userChannelMute.create({
      data: {
        mutedUntil: mutedUntil,
        user: { connect: { userId: user.userId } },
        channel: { connect: { channelId: channel.channelId } },
      },
    });
  
    return true;
  }

  async removeOperator(channelName: string, operatorName: string): Promise<boolean> {
    const channel = await this.getChannelByName(channelName);
    const operator = await this.userService.getUserByName(operatorName);

    if (!channel || !operator)
      return false;

    await this.prisma.channel.update({
      where: { channelId: channel.channelId },
      data: {
        channelOperators: {
          disconnect: { userId: operator.userId },
        },
      },
    });
    return true;
  }

  async removeUserFromChannel(channelName: string, friendName: string): Promise<boolean> {
    const channel = await this.getChannelByName(channelName);
    const friend = await this.userService.getUserByName(friendName);
  
    if (!channel || !friend)
      return false;
  
    const userChannelMutes = await this.prisma.userChannelMute.findMany({
      where: {
        channelId: channel.channelId,
        userId: friend.userId,
      },
    });
  
    await this.prisma.channel.update({
      where: { channelId: channel.channelId },
      data: {
        channelUsers: {
          disconnect: { userId: friend.userId },
        },
        channelOperators: {
          disconnect: { userId: friend.userId },
        },
      },
    });
  
    return true;
  }

  async setAdmin(channelName: string, userName: string): Promise<boolean> {
    const channel = await this.getChannelByName(channelName);
    const user = await this.userService.getUserByName(userName);

    if (!channel || !user)
      return false;

    await this.prisma.channel.update({
      where: { channelId: channel.channelId },
      data: {
        channelAdmin: user.userId,
        channelAdminImage: user.image,
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

  async setPrivate(channelName: string): Promise<boolean> {
    const channel = await this.getChannelByName(channelName);

    if (!channel)
      return false;

    await this.prisma.channel.update({
      where: { channelId: channel.channelId },
      data: {
        isPrivate: !channel.isPrivate,
      },
    });
    return true;
  }

  async unmuteUserFromChannel(channelName: string, userName: string): Promise<boolean> {
    try {
      const channel = await this.getChannelByName(channelName);
      const user = await this.userService.getUserByName(userName);
    
      if (!channel || !user)
        return false;
   
      await this.prisma.userChannelMute.deleteMany({
        where: {
          channelId: channel.channelId,
          userId: user.userId,
        },
      });
      return true;
    }
    catch (error) {
      return false;
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
import { Injectable } from '@nestjs/common';
import { Channel, Prisma } from '@prisma/client';
import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma.service'

@Injectable()
export class ChannelService {
  constructor (private prisma: PrismaService, private userService: UserService) {}

  async createChannel(channelName: string, userName: string, invitedUserName: string): Promise<Channel> {
    const user = await this.userService.getUserByUserName(userName);
    const invitedUser = await this.userService.getUserByUserName(invitedUserName);

    console.log(user);
    console.log(invitedUser);

    if (!user || !invitedUser)
      throw new Error("error: user or invited user not found");

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
}

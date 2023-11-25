import { Injectable } from '@nestjs/common';
import { Notif } from '@prisma/client';
import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma.service'

@Injectable()
export class NotifService {
  constructor (private prisma: PrismaService, private userService: UserService) {}

  async createNotif(userName: string, notifText: string): Promise<boolean> {
    const user = await this.prisma.user.findFirst({
      where: {
        userName: userName,
      },
    });

    if (!user) {
      return false;
    }

    await this.prisma.notif.create({
      data: {
        notif: notifText,
        notifDate: new Date(),
        user: {
          connect: {
            userId: user.userId,
          },
        },
      },
    });
    return true;
  }

  async getNotifs(userName: string): Promise<Notif[]> {
    const user = await this.userService.getUserByName(userName);

    if (!user)
      return [];

    const notifs = await this.prisma.notif.findMany({
      where: {
        userId: user.userId,
      },
    });
		return notifs;
  }
}
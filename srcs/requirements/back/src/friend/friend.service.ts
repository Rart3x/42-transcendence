import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Friend, User, Prisma } from '@prisma/client';

@Injectable()
export class FriendService {
  constructor(private prisma: PrismaService) {}

  async createFriend(userId: number): Promise<Friend> {
    return this.prisma.friend.create({
      data: {
        friendList: { connect: { userId: userId } },
      },
    });
  }
}

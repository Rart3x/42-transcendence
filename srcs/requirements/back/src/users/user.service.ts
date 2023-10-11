import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service'
import { User, Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor (private prisma: PrismaService) {}

  async user(
      userWhereUniqueInput: Prisma.UserWhereUniqueInput,
    ): Promise<User | null> {
      return this.prisma.user.findUnique({
        where: userWhereUniqueInput,
      });
  }
  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async getUserByUserName(userName: string) {
    return this.prisma.user.findFirst({
      where: { userName: userName },
    });
  }
}
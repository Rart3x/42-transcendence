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

  async updateUserName(userId: number, newUserName: string): Promise<User> {
    return this.prisma.user.update({
      where: { userId: userId },
      data: { userName: newUserName },
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
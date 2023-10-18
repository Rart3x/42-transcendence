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
    // const imageResponse = await fetch(data.image);
    // const imageBlob = await imageResponse.blob();
    // const imageBytes = await new Response(imageBlob).arrayBuffer();

    // // Convert the bytes to base64 string
    // const base64Image= btoa(new Uint8Array(imageBytes).reduce(function (data, byte) {
    //   return data + String.fromCharCode(byte);
    // }, ''));

    // data.image = base64Image;
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
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service'
import { User, Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor (private prisma: PrismaService) {}

  async addFriend(userName: string, friendName: string) {
    const user = await this.prisma.user.findFirst({
      where: { userName: userName },
    });

    if (!user) {
      throw new Error("error: user not found");
    }
  
    const friend = await this.prisma.user.findFirst({
      where: { userName: friendName },
    });
  
    if (!friend) {
      throw new Error("error: friend not found");
    }
  
    return this.prisma.user.update({
      where: { userId: user.userId },
      data: { friendsId: { push: friend.userId } },
    }); 
  }

  async  setSocket(userId: number, socket: string): Promise<User> {
    return this.prisma.user.update({
      where : { userId: userId },
      data : { socket: socket }
    });
  }

  async getFriendUserNames(userId : number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { userId: userId },
      });
  
      if (!user) {
        throw new Error("error: user not found");
      }
  
      const friendUserNames = await this.prisma.user.findMany({
        where: {
          userId: { in: user.friendsId },
        },
        select: {
          userName: true,
        },
      });
      return friendUserNames.map((friend) => friend.userName);
    }
    catch (error) {
      console.error(error);
    }
  }

  async getUserByUserName(userName: string) {
    return await this.prisma.user.findFirst({
      where: { userName: userName },
    });
  }

  async getUserByCookie(cookie: string) {
  
    const user = await this.prisma.user.findFirst({
      where: { cookie: cookie },
    });

    return user;
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {

    console.log("createUser: ", data);
    
    if (await this.getUserByUserName(data.userName) != null) {
      return ;
    }

    // Fetch the image from the URL
    const imageResponse = await fetch(data.image);
    const imageBlob = await imageResponse.blob();
    const imageBytes = await new Response(imageBlob).arrayBuffer();

    // Convert the bytes to base64 string
    const base64Image= btoa(new Uint8Array(imageBytes).reduce(function (data, byte) {
      return data + String.fromCharCode(byte);
    }, ''));

    // Modify the data object to include the cookie
    const modifiedData = {
      ...data,
      image: base64Image,
    };
    data.image = base64Image;
    return this.prisma.user.create({
      data,
    });
  }

  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,): Promise<User | null> {
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
}

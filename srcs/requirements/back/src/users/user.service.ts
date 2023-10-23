import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service'
import { User, Prisma } from '@prisma/client';
import * as https from 'https';
import * as fs from 'fs';
import * as path from 'path';

async function downloadImage (url, filename) {
  if (!fs.existsSync(path.join(__dirname, '../images')))
    fs.mkdirSync(path.join(__dirname, '../images'));

  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      const fileStream = fs.createWriteStream(path.join(__dirname, '../images', filename));
      response.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close(resolve);
      });
      fileStream.on('error', reject);
    }).on('error', reject);
  });
}

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

    // Download the profile picture in a folder and save the path in the database
    const imagePath = `${data.userName}.jpg`;
    await downloadImage(data.image, imagePath);
    data.image = imagePath;

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

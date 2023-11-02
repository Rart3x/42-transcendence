import { authenticator } from 'otplib';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service'
import { User, Prisma } from '@prisma/client';
import * as https from 'https';
import * as fs from 'fs';
import * as path from 'path';

async function downloadImage (url, filename) {
  if (!fs.existsSync(path.join(__dirname, '../../../front/src/assets/userImages')))
    fs.mkdirSync(path.join(__dirname, '../../../front/src/assets/userImages'));

  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      const fileStream = fs.createWriteStream(path.join(__dirname, '../../../front/src/assets/userImages', filename));
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

  async addFriend(userName: string, friendName: string): Promise<User> {
    const user = await this.getUserByUserName(userName);
    const friend = await this.getUserByUserName(friendName);

    if (!user || !friend)
      throw new Error("error: user or friend not found");

    await this.prisma.user.update({
      where: { userId: user.userId },
      data: {
        friends: {
          connect: { userId: friend.userId }
        }
      }
    });

    await this.prisma.user.update({
      where: { userId: friend.userId },
      data: {
        friendOf: {
          connect: { userId: user.userId }
        }
      }
    });
    return user;
  }

  async getAllFriends(userId: number): Promise<User[]> {
    const friends = await this.prisma.user.findMany({
      where: {
        friendOf: {
          some: {
            userId: userId,
          },
        },
      },
    });

    return friends;
  }

  async removeFriend(userName: string, friendName: string): Promise<User> {
    const user = await this.getUserByUserName(userName);
    const friend = await this.getUserByUserName(friendName);

    if (!user || !friend)
      throw new Error("error: user or friend not found");

    // Supprimer la relation d'amitié des deux côtés
    await this.prisma.user.update({
      where: { userId: user.userId },
      data: {
        friends: {
          disconnect: { userId: friend.userId },
        },
      },
    });

    await this.prisma.user.update({
      where: { userId: friend.userId },
      data: {
        friendOf: {
          disconnect: { userId: user.userId },
        },
      },
    });

    // Supprimer également la relation d'amitié du côté de `friend`
    await this.prisma.user.update({
      where: { userId: user.userId },
      data: {
        friendOf: {
          disconnect: { userId: friend.userId },
        },
      },
    });

    await this.prisma.user.update({
      where: { userId: friend.userId },
      data: {
        friends: {
          disconnect: { userId: user.userId },
        },
      },
    });
    return user;
  }

  async  setSocket(userId: number, socket: string): Promise<User> {
    return this.prisma.user.update({
      where : { userId: userId },
      data : { socket: socket }
    });
  }

  async getUserByCookie(cookie: string) {
  
    const user = await this.prisma.user.findFirst({
      where: { cookie: cookie },
    });

    return user;
  }

  async getUserByUserName(userName: string) {
    return await this.prisma.user.findFirst({
      where: { userName: userName },
    });
  }

  async createUser(data: Prisma.UserCreateInput, friendName: string | null = null): Promise<User> {
    const user = await this.getUserByUserName(data.userName);
    
    if (user != null) {
      // console.log(user);
      return await this.updateCookie(user.userId, data.cookie);
    }
  
    // Download the profile picture in a folder and save the path in the database
    const imagePath = `${data.userName}.jpg`;
    await downloadImage(data.image, imagePath);
    data.image = imagePath;
    data.displayName = data.userName;
  
    const createUserInput: Prisma.UserCreateInput = {
      ...data,
    };
  
    return this.prisma.user.create({
      data: createUserInput,
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
      data: { displayName: newUserName },
    });
  }

  async updateCookie(userId: number, cookie: string): Promise<User> {
    return this.prisma.user.update({
      where: { userId: userId },
      data: { cookie: cookie },
    });
  }

  async updateImage(userName: string, imageFile: Express.Multer.File): Promise<User> {
    const imagePath = path.join(__dirname, '../../../front/src/assets/userImages', `${userName}.jpg`);
    fs.writeFileSync(imagePath, imageFile.buffer);

    return ;
  }

  async updateA2F(userName: string, A2F: boolean): Promise<User> {
    if (!A2F) {
      return this.prisma.user.update({
        where: { userName: userName },
        data: { A2FSecret: null, A2F: false },
      });
    }
    authenticator.resetOptions();
    const secret = authenticator.generateSecret();
    const otpAuthUrl = authenticator.keyuri(userName, 'PMU', secret);
    return this.prisma.user.update({
      where: { userName: userName },
      data: { A2FUrl: otpAuthUrl, A2F: true, A2FSecret: secret },
    });
  }
}
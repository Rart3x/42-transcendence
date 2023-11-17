import { authenticator } from 'otplib';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service'
import { Channel, User, Prisma } from '@prisma/client';
import * as https from 'https';
import * as fs from 'fs';
import * as path from 'path';
import { get } from 'http';
import { PartialUserDTO } from './dto/partial-user.dto';

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
/*-----------------------------------------------CHANNELS-----------------------------------------------*/
  async getAllChannels(userName: string): Promise<Channel[]> {
    const user = await this.getUserByName(userName);
    const userChannels = user.channels;
    const channels = await this.prisma.channel.findMany({
      where: {
        channelId: {
          in: userChannels.map((channel) => channel.channelId),
        },
      },
    });
    return channels;
  }

/*-----------------------------------------------FRIENDS-----------------------------------------------*/
  async addFriend(userName: string, friendName: string): Promise<boolean> {
    const user = await this.getUserByName(userName);
    const friend = await this.getUserByName(friendName);

    if (!user || !friend)
      return false;

    await this.prisma.user.update({
      where: { userId: user.userId },
      data: {
        friends: {
          connect: { userId: friend.userId }
        },
        friendOf: {
          connect: { userId: friend.userId }
        }
      }
    });

    await this.prisma.user.update({
      where: { userId: friend.userId },
      data: {
        friends: {
          connect: { userId: user.userId }
        },
        friendOf: {
          connect: { userId: user.userId }
        }
      }
    });

    return true;
  }

  async isFriend(userName: string, friendName: string): Promise<boolean> {
    const user = await this.getUserByName(userName);
    const friend = await this.getUserByName(friendName);
  
    if (!user || !friend)
      return false;
  
    const friendOf = await this.prisma.user.findMany({
      where: {
        userId: user.userId,
        friendOf: {
          some: {
            userId: friend.userId,
          },
        },
      },
    });
  
    const friends = await this.prisma.user.findMany({
      where: {
        userId: friend.userId,
        friends: {
          some: {
            userId: user.userId,
          },
        },
      },
    });
  
    if (friendOf.length > 0 && friends.length > 0)
      return true;
    return false;
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

  async removeFriend(userName: string, friendName: string): Promise<boolean> {
    const user = await this.getUserByName(userName);
    const friend = await this.getUserByName(friendName);

    if (!user || !friend)
      return false;

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
    return true;
  }
/*-----------------------------------------------USERS-----------------------------------------------*/
  async blockUser(userName: string, blockedUserName: string): Promise<boolean> {
    const user = await this.getUserByName(userName);
    const blockedUser = await this.getUserByName(blockedUserName);

    if (!user || !blockedUser)
      return false;

    await this.prisma.user.update({
      where: { userId: user.userId },
      data: {
        blockUsers: {
          connect: { userId: blockedUser.userId },
        },
        blockOf: {
          connect: { userId: blockedUser.userId },
        }
      },
    });
    return true;
  }

  async createUser(data: Prisma.UserCreateInput, friendName: string | null = null): Promise<User> {
    const user = await this.getUserByName(data.userName);
    
    if (user != null)
      return await this.updateCookie(user.userId, data.cookie);

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

  async isBlock(userName: string, blockedUserName: string): Promise<boolean> {
    const user = await this.getUserByName(userName);
    const blockedUser = await this.getUserByName(blockedUserName);

    if (!user || !blockedUser)
      return false;

    const blockOf = await this.prisma.user.findMany({
      where: {
        userId: user.userId,
        blockOf: {
          some: {
            userId: blockedUser.userId,
          },
        },
      },
    });

    const blockUsers = await this.prisma.user.findMany({
      where: {
        userId: blockedUser.userId,
        blockUsers: {
          some: {
            userId: user.userId,
          },
        },
      },
    });

    if (blockOf.length > 0 && blockUsers.length > 0)
      return true;
    return false;
  }

  async getUserByCookie(cookie: string) {
    
    const user = await this.prisma.user.findFirst({
      where: { cookie: cookie },
    });

    return user;
  }

  async getUserByName(userName: string) {
    return await this.prisma.user.findFirst({
      where: { userName: userName },
      include: {
        channels: true,
      },
    });
  }

  async getUserById(userId: number) {
    return await this.prisma.user.findFirst({
      where: { userId: userId },
    });
  }

  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,): Promise<User | null> {
      return this.prisma.user.findUnique({
        where: userWhereUniqueInput,
    });
  }

  async setStatus(userName: string, status : string): Promise<boolean> {
    const user = await this.getUserByName(userName);
    if (!user)
      return false;

    await this.prisma.user.update({
      where: { userId: user.userId },
      data: { status: status },
    });
    return true;
  }

  async unblockUser(userName: string, blockedUserName: string): Promise<boolean> {
    const user = await this.getUserByName(userName);
    const blockedUser = await this.getUserByName(blockedUserName);

    if (!user || !blockedUser)
      return false;

    await this.prisma.user.update({
      where: { userId: user.userId },
      data: {
        blockUsers: {
          disconnect: { userId: blockedUser.userId },
        },
        blockOf: {
          disconnect: { userId: blockedUser.userId },
        }
      },
    });

    await this.prisma.user.update({
      where: { userId: blockedUser.userId },
      data: {
        blockOf: {
          disconnect: { userId: user.userId },
        },
        blockUsers: {
          disconnect: { userId: user.userId },
        }
      },
    });
    return true;
  }

  async updateUserName(userId: number, newUserName: string): Promise<User> {
    return this.prisma.user.update({
      where: { userId: userId },
      data: { displayName: newUserName },
    });
  }

  async updateStatus(userId: number, newStatus: string): Promise<User> {
    return this.prisma.user.update({
      where: { userId: userId },
      data: { status: newStatus },
    });
  }
  
  async getAllUsers(): Promise<PartialUserDTO[]> {
    return await this.prisma.user.findMany({
      select: {
        userName: true,
        displayName: true,
        image: true,
      },
    });
  }
/*-----------------------------------------------UTILS-----------------------------------------------*/
  async  setSocket(userId: number, socket: string): Promise<User> {
    return this.prisma.user.update({
      where : { userId: userId },
      data : { socket: socket }
    });
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

  async updateCookie(userId: number, cookie: string): Promise<User> {
    return this.prisma.user.update({
      where: { userId: userId },
      data: { cookie: cookie },
    });
  }

  async updateImage(userName: string, imageFile: Express.Multer.File): Promise<User> {
    const imagePath = path.join(__dirname, '../../../front/src/assets/userImages', `${userName}.jpg`);
    fs.writeFileSync(imagePath, imageFile.buffer);

    return await this.getUserByName(userName);
  }
}
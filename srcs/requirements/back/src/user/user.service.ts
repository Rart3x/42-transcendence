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

  async addFriend(params: { where: { userName: string }; data: { friends?: { create?: { /* Données pour créer un nouvel ami */ } } } }): Promise<User | null> {
    const { where, data } = params;
  
    try {
      const updatedUser = await this.prisma.user.update({
        where: { userName: where.userName },
        data: {
          friends: {
            create: data.friends.create
          }
        },
        include: {
          friends: {
            include: {
              friendList: true
            }
          }
        }
      });
  
      return updatedUser;
    }
    catch (error) {
      console.error(error);
      return null;
    }
  }

  async  setSocket(userId: number, socket: string): Promise<User> {
    return this.prisma.user.update({
      where : { userId: userId },
      data : { socket: socket }
    });
  }

  // async getFriendUserNames(userId : number) {
  //   try {
  //     const user = await this.prisma.user.findUnique({
  //       where: { userId: userId },
  //     });
  
  //     if (!user) {
  //       throw new Error("error: user not found");
  //     }
  
  //     const friendUserNames = await this.prisma.user.findMany({
  //       where: {
  //         userId: { in: user.friendsId },
  //       },
  //       select: {
  //         userName: true,
  //       },
  //     });
  //     return friendUserNames.map((friend) => friend.userName);
  //   }
  //   catch (error) {
  //     console.error(error);
  //   }
  // }

  async getUserByUserName(userName: string) {
    return await this.prisma.user.findFirst({
      where: { userName: userName },
      include: { friends: { include: { friendList: true } } },
    });
  }

  async getUserByCookie(cookie: string) {
  
    const user = await this.prisma.user.findFirst({
      where: { cookie: cookie },
    });

    return user;
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
  
    // If a friend's name is provided, create a Friend record during user creation
    if (friendName) {
      createUserInput.friends = {
        create: [{
          friend: {
            create: {
              userName: friendName,
            },
          },
        }],
      };
    }
  
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
}
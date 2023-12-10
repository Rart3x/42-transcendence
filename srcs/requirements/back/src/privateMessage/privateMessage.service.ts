import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { UserService } from '../user/user.service';
import { PrivateMessage, User } from '@prisma/client';

@Injectable()
export class PrivateMessageService {
  constructor(private prisma: PrismaService, private userService: UserService) {}

  async createPrivateMessage(senderName: string, receiverName: string, privateMessageText: string): Promise<boolean> {
    const user1 = await this.userService.getUserByName(senderName);
    const user2 = await this.userService.getUserByName(receiverName);
    
    if (!user1 || !user2)
      return false;
    
    await this.prisma.privateMessage.create({
      data: {
        messageContent: privateMessageText,
        privateMessageDate: new Date(),
        senderName,
        receiverName,
      },
    });
  
    return true;
  }

  async getLastPrivateMessage(userName1: string, userName2: string): Promise<PrivateMessage> {
    const user1 = await this.userService.getUserByName(userName1);
    const user2 = await this.userService.getUserByName(userName2);

    if (!user1 || !user2)
      return null;
  
    const privateMessage = await this.prisma.privateMessage.findFirst({
      where: {
        AND: [
          { OR: [{ senderName: userName1 }, { senderName: userName2 }] },
          { OR: [{ receiverName: userName1 }, { receiverName: userName2 }] },
        ],
      },
      orderBy: {
        privateMessageDate: 'desc',
      },
    });

    return privateMessage;
  }
  
  async getPrivateMessage(userName1: string, userName2: string) {
    const user1 = await this.userService.getUserByName(userName1);
    const user2 = await this.userService.getUserByName(userName2);
  
    if (!user1 || !user2)
      return null;
  
    let privateMessage = await this.prisma.privateMessage.findFirst({
      where: {
        AND: [
          { OR: [{ senderName: userName1 }, { senderName: userName2 }] },
          { OR: [{ receiverName: userName1 }, { receiverName: userName2 }] },
        ],
      },
      include: {
        sender: true,
        receiver: true,
      },
    });
  
    if (!privateMessage) {
      privateMessage = await this.prisma.privateMessage.create({
        data: {
          sender: { connect: { userName: userName1 } },
          receiver: { connect: { userName: userName2 } },
          messageContent: '',
        },
        include: {
          sender: true,
          receiver: true,
        },
      });
    }
  
    return privateMessage;
  }
  
  async getPrivateMessagesByUserName(userName: string): Promise<{ [key: string]: PrivateMessage[] }> {
    const user = await this.userService.getUserByName(userName);
  
    if (!user)
      return null;
  
    const privateMessagesSent = await this.prisma.privateMessage.findMany({
      where: {
        OR: [
          { senderName: userName },
          { receiverName: userName },
        ],
      },
      orderBy: {
        privateMessageDate: 'asc',
      },
    });
  
    const messagePairs = {};
  
    privateMessagesSent.forEach((message) => {
      const pairKey = `${message.senderName}-${message.receiverName}`;
      if (!messagePairs[pairKey]) {
        messagePairs[pairKey] = [];
      }
      messagePairs[pairKey].push(message);
    });
  
    return messagePairs;
  }
}

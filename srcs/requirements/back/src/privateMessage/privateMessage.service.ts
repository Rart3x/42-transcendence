import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service'
import { UserService } from '../user/user.service'
import { Channel, PrivateMessage, User, Prisma } from '@prisma/client';
import { DMMF } from '@prisma/client/runtime/library';

@Injectable()
export class PrivateMessageService {
  constructor (private prisma: PrismaService, private userService: UserService) {}

	async createPrivateMessage(senderName: string, receiverName: string, privateMessageText: string): Promise<boolean> {
		const user1 = await this.userService.getUserByName(senderName);
		const user2 = await this.userService.getUserByName(receiverName);
	
		const existingPrivateMessage = await this.prisma.privateMessage.findFirst({
			where: {
				AND: [
					{ OR: [{ senderName }, { senderName: receiverName }] },
					{ OR: [{ receiverName }, { receiverName: senderName }] },
				],
			},
		});
	
		if (existingPrivateMessage) {
			await this.prisma.privateMessage.update({
				where: { privateMessageId: existingPrivateMessage.privateMessageId },
				data: {
					messageHistory: {
						push: privateMessageText,
					},
					privateMessageDate: new Date(),
				},
			});
		} 
		else {
			await this.prisma.privateMessage.create({
				data: {
					messageHistory: [privateMessageText],
					privateMessageDate: new Date(),
					sender: {
						connect: {
							userId: user1.userId,
						},
					},
					receiver: {
						connect: {
							userId: user2.userId,
						},
					},
				},
			});
		}
		return true;
	}

	async getPrivateMessage(userName1: string, userName2: string): Promise<PrivateMessage[]> {
		const user1 = await this.userService.getUserByName(userName1);
		const user2 = await this.userService.getUserByName(userName2);
	
		if (!user1 || !user2)
			return null;
	
		const privateMessages = await this.prisma.privateMessage.findMany({
			where: {
				OR: [
					{
						AND: [
							{ senderName: userName1 },
							{ receiverName: userName2 },
						],
					},
					{
						AND: [
							{ senderName: userName2 },
							{ receiverName: userName1 },
						],
					},
				],
			},
			include: {
				sender: true,
				receiver: true,
			},
		});
		return privateMessages;
	}

	async getPrivateMessagesByUserName(userName: string): Promise<PrivateMessage[]> {
		const user = await this.userService.getUserByName(userName);
	  
		if (!user) {
		  return null;
		}
	  
		const privateMessagesSent = await this.prisma.privateMessage.findMany({
		  where: {
			sender: {
			  userName: userName,
			},
		  },
		});
	  
		const privateMessagesReceived = await this.prisma.privateMessage.findMany({
		  where: {
			receiver: {
			  userName: userName,
			},
		  },
		});
	  
		const allPrivateMessages = privateMessagesSent.concat(privateMessagesReceived);
	  
		return allPrivateMessages;
	  }

}
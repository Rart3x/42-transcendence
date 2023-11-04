import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service'
import { Channel, Message, User, Prisma } from '@prisma/client';

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) {}

  async createMessage(channel: Channel): Promise<Message> {
    return await this.prisma.message.create({
      data: {
        channelId: channel.channelId,
      },
    });
  }

  async getMessage(): Promise<{ message_text: string; message_date: Date }[]> {
    const messages = await this.prisma.message.findMany({
      select: {
        message_text: true,
        message_date: true
      }
    });
    return messages.map((message) => ({
      message_text: message.message_text,
      message_date: message.message_date
    }));
  }

  async insertMessageToChannel(channelName: string, message_text : string): Promise<Message> {
    console.log(message_text  )
    const channel = await this.prisma.channel.findUnique({
      where: {
        channelName: channelName
      }
    });
    const message = await this.createMessage(channel);
    return await this.prisma.message.update({
      where: {
        messageId: message.messageId
      },
      data: {
        message_text: message_text,
        message_date: new Date(),
        Channel: {
          connect: {
            channelId: channel.channelId
          }
        },
      }
    });
  }
}
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service'
import { Channel, Message, User, Prisma } from '@prisma/client';

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) {}

  async createMessage(channel: Channel,): Promise<void> {
    await this.prisma.message.create({
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
}
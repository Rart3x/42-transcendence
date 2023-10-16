import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service'
import { Message, Prisma } from '@prisma/client';

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) {}

  async insertMessage(data: Prisma.MessageCreateInput): Promise<Message | null> {
    return this.prisma.message.create({
      data: {
        message_text: String(data.message_text),
      }
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
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service'
import { Message, Prisma } from '@prisma/client';

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) {}

  async insertMessage(data: Prisma.MessageCreateInput): Promise<Message | null> {
    return this.prisma.message.create({
      data: {
        message_text: data.message_text
      }
    });
  }
}
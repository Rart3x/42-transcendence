import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service'
import { QueueList, Prisma } from '@prisma/client';

@Injectable()
export class QueueListService {
  constructor (private prisma: PrismaService) {}

  async insertClientIntoQueueList(data: Prisma.QueueListCreateInput): Promise<QueueList> {
    return this.prisma.queueList.create({
        data,
    });
  }

  async getFirstClientFromQueueList(): Promise<QueueList> {
    const firstClient = await this.prisma.queueList.findFirst();
    if (!firstClient) {
      throw new Error('No clients in the queue list');
    }
    return firstClient;
  }

  async sumQueueList(): Promise<number> {
    return this.prisma.queueList.count();
  }

}


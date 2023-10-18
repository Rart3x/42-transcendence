import { Body, Controller, Get, Post } from '@nestjs/common';
import { QueueList } from '@prisma/client';
import { QueueListService } from './queueList.service';
import { Prisma } from '@prisma/client';

@Controller('queuelist')
export class QueueListController {
  constructor(private readonly QueueListService: QueueListService) {}

  @Post()
  async insertClientIntoQueueList(@Body() data: Prisma.QueueListCreateInput): Promise<QueueList> {
      return this.QueueListService.insertClientIntoQueueList(data);
  }

  @Get()
  async getFirstClientFromQueueList(): Promise<QueueList>{
    return this.QueueListService.getFirstClientFromQueueList();
  }

  @Get('/sum')
  async sumQueueList(): Promise<number>{
    return this.QueueListService.sumQueueList();
  }
}


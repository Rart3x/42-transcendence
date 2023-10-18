import { Body, Controller, Post } from '@nestjs/common';
import { Waiter } from '@prisma/client';
import { WaiterService } from './waiter.service';
import { Prisma } from '@prisma/client';

@Controller('waiter')
export class WaiterController {
  constructor(private readonly waiterService: WaiterService) {}

  @Post()
  async createWaiter(@Body() data: Prisma.WaiterCreateInput): Promise<Waiter> {
      return this.waiterService.createWaiter(data);
  }
}
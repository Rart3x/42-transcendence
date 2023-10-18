import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateWaiterDTO } from './dto/create-waiter.dto';
import { Waiter } from '@prisma/client';
import { WaiterService } from './waiter.service';
import { Prisma } from '@prisma/client';

@Controller('waiter')
export class WaiterController {
  constructor(private readonly waiterService: WaiterService) {}

  @Post()
  async createWaiter(@Body() createWaiterDTO : CreateWaiterDTO): Promise<Waiter> {
      return this.waiterService.createWaiter(createWaiterDTO);
  }

  @Get('/sum')
  async sumWaiters(): Promise<number> {
    const sum = await this.waiterService.getTotalWaiters();
    return sum;
  }
}